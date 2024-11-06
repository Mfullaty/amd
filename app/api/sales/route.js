import db from "@/lib/db";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtovtzadn",
  api_key: "571871856498513",
  api_secret: "_tFT4yonMCQM4RvTb6VoYnRxwrc",
});

const columns = [
  {
    accessorKey: "title",
    header: "Sales Title",
    meta: {
      displayName: "Sales Title",
      navigationUrl: "/dashboard/sales/[id]",
    },
  },
  {
    accessorKey: "price",
    header: "Sales Price",
    meta: {
      displayName: "Sales Price",
      navigationUrl: "/dashboard/sales/[id]",
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    meta: {
      displayName: "Quantity",
      navigationUrl: "/dashboard/sales/[id]",
    },
  },
  {
    accessorKey: "added_by",
    header: "Sold By",
    meta: {
      displayName: "Sold By",
      navigationUrl: "/dashboard/sales/[id]",
    },
  },
];

export async function POST(request) {
  try {
    const saleData = await request.json();
    const sale = await db.sale.create({
      data: {
        title: saleData.title,
        categoryId: saleData.categoryId,
        imageUrls: saleData.imageUrls,
        quantity: parseInt(saleData.quantity),
        unitId: saleData.unitId,
        price: parseFloat(saleData.price),
        added_by: saleData.added_by,
        notes: saleData.notes,
      },
    });
    console.log(saleData);
    return NextResponse.json(sale);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Create an sale",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  try {
    const sales = await db.sale.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        category: true, //Return All sales
        unit: true, //Returns all associated units,
      },
      orderBy: {
        createdAt: "desc", //latest sales
      },
    });
    return NextResponse.json({ data: sales, columns: columns });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch Sales",
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

    let saleToDelete = [];

    if (body && body.ids) {
      const { ids } = body;
      saleToDelete = await db.sale.findMany({
        where: { id: { in: ids } },
      });
    } else {
      const id = request.nextUrl.searchParams.get("id");
      if (id) {
        const sale = await db.sale.findUnique({
          where: { id },
        });
        if (sale) {
          saleToDelete = [sale];
        } else {
          return NextResponse.json(
            { message: "Sale not found" },
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

    // Delete images for all Sales
    for (const sale of saleToDelete) {
      const publicIds = sale.imageUrls
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

    // Delete all Sales
    await db.sale.deleteMany({
      where: { id: { in: saleToDelete.map((sale) => sale.id) } },
    });

    return NextResponse.json({ message: "Sales deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: error.message, message: "Failed to delete sale" },
      { status: 500 }
    );
  }
}
