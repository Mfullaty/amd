import db from "@/lib/db";
import { NextResponse } from "next/server";

const columns = [
    {
      accessorKey: "title",
      header: "Unit Name",
      meta: {
        displayName: "Unit Name",
        navigationUrl: "/dashboard/units/[id]",
      },
    },
    {
      accessorKey: "abbreviation",
      header: "Abbreviation",
      meta: {
        displayName: "Abbreviation",
        navigationUrl: "/dashboard/units/[id]",
      },
    },
    {
      accessorKey: "added_by",
      header: "Added By",
      meta: {
        displayName: "Added By",
        navigationUrl: "/dashboard/units/[id]",
      },
    },
  ];

export async function POST(request) {
    try {
        const { title, abbreviation, added_by } = await request.json();

        // Input Validation
        if (!title || !abbreviation || !added_by) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const unit = await db.unit.create({
            data: {
                title,
                abbreviation,
                added_by,
            },
        });

        console.log(unit);
        return NextResponse.json(unit);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                error,
                message: "Failed To Create a Unit",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const units = await db.unit.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: {
        createdAt: "desc", // latest units
      },
    });

    if (!units) {
      return NextResponse.json(
        { message: "No units found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: units, columns: columns });
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred",
        message: "Failed to fetch units",
      },
      { status: 500 }
    );
  }
}

// Delete
export async function DELETE(request) {
    try {
      // Try to get the body containing ids
      const body = await request.json().catch((error) => {
        console.error("Error parsing request body:", error);
        return null;
      });
  
      // If body has ids, delete multiple units
      if (body && body.ids) {
        const { ids } = body;
        if (!ids || ids.length === 0) {
          return NextResponse.json(
            { message: "No IDs provided for deletion" },
            { status: 400 }
          );
        }
        const deleteUnits = await db.unit.deleteMany({
          where: {
            id: { in: ids },
          },
        });
        return NextResponse.json({ message: "Units deleted successfully", data: deleteUnits });
      }
  
      // If no ids in body, try to get a single id from the query params
      const id = request.nextUrl.searchParams.get("id");
      if (!id) {
        return NextResponse.json(
          { message: "No ID or IDs provided for deletion" },
          { status: 400 }
        );
      }
      const deleteUnit = await db.unit.delete({
        where: { id },
      });
      return NextResponse.json({ message: "Unit deleted successfully", data: deleteUnit });
  
    } catch (error) {
      console.error("Error deleting resource:", error);
      return NextResponse.json(
        {
          error,
          message: "Failed to delete unit",
        },
        { status: 500 }
      );
    }
  }
