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
    header: "Item Name",
    meta: {
      displayName: "Item Name",
      navigationUrl: "/dashboard/items/[id]",
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    meta: {
      displayName: "Notes",
      navigationUrl: "/dashboard/items/[id]",
    },
  },
  {
    accessorKey: "added_by",
    header: "Added By",
    meta: {
      displayName: "Added By",
      navigationUrl: "/dashboard/items/[id]",
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   meta: {
  //     displayName: "Created At",
  //     navigationUrl: "/dashboard/items/[id]",
  //   },
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated At",
  //   meta: {
  //     displayName: "Updated At",
  //     navigationUrl: "/dashboard/items/[id]",
  //   },
  // },
];
export async function POST(request) {
  try {
    const itemData = await request.json();
    const item = await db.item.create({
      data: {
        title: itemData.title,
        categoryId: itemData.categoryId,
        imageUrls: itemData.imageUrls,
        quantity: parseInt(itemData.quantity),
        unitId: itemData.unitId,
        price: parseFloat(itemData.price),
        added_by: itemData.added_by,
        notes: itemData.notes,
      },
    });
    console.log(itemData);
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Create an Item",
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
    const items = await db.item.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },

      include: {
        category: true, //Return All items
        unit: true, //Returns all associated units,
      },
      orderBy: {
        createdAt: "desc", //latest items
      },
    });
    return NextResponse.json({ data: items, columns: columns });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch Items",
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

    let itemsToDelete = [];

    if (body && body.ids) {
      const { ids } = body;
      itemsToDelete = await db.item.findMany({
        where: { id: { in: ids } }, 
      });
    } else {
      const id = request.nextUrl.searchParams.get("id");
      if (id) {
        const item = await db.item.findUnique({
          where: { id },
        });
        if (item) {
          itemsToDelete = [item];
        } else {
          return NextResponse.json({ message: "Item not found" }, { status: 404 });
        }
      } else {
        return NextResponse.json(
          { message: "No ID or IDs provided for deletion" },
          { status: 400 }
        );
      }
    }

    // Delete images for all items
    for (const item of itemsToDelete) {
      const publicIds = item.imageUrls
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

    // Delete all items
    await db.item.deleteMany({
      where: { id: { in: itemsToDelete.map(item => item.id) } }, 
    });

    return NextResponse.json({ message: "Items deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: error.message, message: "Failed to delete item" },
      { status: 500 }
    );
  }
}

