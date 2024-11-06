import db from "@/lib/db";
import { NextResponse } from "next/server";

const columns = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   meta: { displayName: "ID", navigationUrl: "/dashboard/categories/[id]" },
  // },
  {
    accessorKey: "title",
    header: "Category Name",
    meta: {
      displayName: "Category Name",
      navigationUrl: "/dashboard/categories/[id]",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    meta: {
      displayName: "Description",
      navigationUrl: "/dashboard/categories/[id]",
    },
  },
  {
    accessorKey: "added_by",
    header: "Added By",
    meta: {
      displayName: "Added By",
      navigationUrl: "/dashboard/categories/[id]",
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   meta: {
  //     displayName: "Created At",
  //     navigationUrl: "/dashboard/categories/[id]",
  //   },
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated At",
  //   meta: {
  //     displayName: "Updated At",
  //     navigationUrl: "/dashboard/categories/[id]",
  //   },
  // },
];
export async function POST(request) {
  try {
    const { title, description, added_by } = await request.json();
    const category = await db.category.create({
      data: {
        title,
        description,
        added_by,
      },
    });
    console.log(category);
    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Create a Category",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate") || null;
  const endDate = searchParams.get("endDate") || null;
  try {
    const categories = await db.category.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: {
        createdAt: "desc", //latest categories
      },
    });
    return NextResponse.json({ data: categories, columns: columns });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch Categories",
      },
      {
        status: 500,
      }
    );
  }
}

// Delete
export async function DELETE(request) {
  try {
    // Try to get the body containing ids
    const body = await request.json().catch(() => null);

    // If body has ids, delete multiple categories
    if (body && body.ids) {
      const { ids } = body;
      const deleteCategories = await db.category.deleteMany({
        where: {
          id: { in: ids },
        },
      });
      return NextResponse.json({
        message: "Categories deleted successfully",
        data: deleteCategories,
      });
    }

    // If no ids in body, try to get a single id from the query params
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      const deleteCategory = await db.category.delete({
        where: { id },
      });
      return NextResponse.json({
        message: "Category deleted successfully",
        data: deleteCategory,
      });
    }

    // If no id or ids are provided, return an error
    return NextResponse.json(
      { message: "No ID or IDs provided for deletion" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      {
        error,
        message: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}
