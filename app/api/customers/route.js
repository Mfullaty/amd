import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtovtzadn",
  api_key: "571871856498513",
  api_secret: "_tFT4yonMCQM4RvTb6VoYnRxwrc",
});

const columns = [
  {
    accessorKey: "user.name",
    header: "Customer Name",
    meta: {
      displayName: "Customer Name",
      navigationUrl: "/dashboard/customers/[id]",
    },
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
    meta: { displayName: "Phone", navigationUrl: "/dashboard/customers/[id]" },
  },
  {
    accessorKey: "item.title",
    header: "Item",
    meta: { displayName: "Item", navigationUrl: "/dashboard/customers/[id]" },
  },
  {
    accessorKey: "price_paid",
    header: "Paid",
    meta: { displayName: "Paid", navigationUrl: "/dashboard/customers/[id]" },
  },
  {
    accessorKey: "price_remain",
    header: "Remaining",
    meta: {
      displayName: "Remaining",
      navigationUrl: "/dashboard/customers/[id]",
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    meta: { displayName: "Total", navigationUrl: "/dashboard/customers/[id]" },
  },
  {
    accessorKey: "added_by",
    header: "Added by",
    meta: { displayName: "Added By", navigationUrl: "/dashboard/customers/[id]" },
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  try {
    const customers = await db.customerItem.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        user: true,
        item: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(customers);
    return NextResponse.json({ data: customers, columns });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error, message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const customerData = await request.json();
    const customer = await db.customerItem.create({
      data: {
        price_paid: parseFloat(customerData.price_paid),
        price_remain: parseFloat(customerData.price_remain),
        total:
          parseFloat(customerData.price_paid) +
          parseFloat(customerData.price_remain),
        itemId: customerData.itemId,
        userId: customerData.userId,
        description: customerData.description,
        added_by: customerData.added_by,
        bringing_date: customerData.bringing_date,
        collection_date: customerData.collection_date,
        imageUrls: customerData.imageUrls, // Add this line
      },
    });
    console.log(customerData);
    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Add a Customer",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => null);

    let customersToDelete = [];

    if (body && body.ids) {
      const { ids } = body;
      customersToDelete = await db.customerItem.findMany({
        where: { id: { in: ids } },
      });
    } else {
      const id = request.nextUrl.searchParams.get("id");
      if (id) {
        const customer = await db.customerItem.findUnique({
          where: { id },
        });
        if (customer) {
          customersToDelete = [customer];
        } else {
          return NextResponse.json(
            { message: "Customer not found" },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "No ID or IDs provided for deletion" },
          { status: 400 }
        );
      }
    }

    // Delete images for all customers
    for (const customer of customersToDelete) {
      const publicIds = customer.imageUrls
        .map((url) => {
          const match = url.match(/\/v\d+\/([^.]+)\.\w+$/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds, {
          resource_type: "image",
        });
      }
    }

    // Delete all customers
    await db.customerItem.deleteMany({
      where: { id: { in: customersToDelete.map((customer) => customer.id) } },
    });

    return NextResponse.json({ message: "Customers deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: error.message, message: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
