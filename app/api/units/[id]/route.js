import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const unit = await db.unit.findUnique({
      where: {
        id, //The id
      },
    });
    return NextResponse.json(unit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch unit",
      },
      {
        status: 500,
      }
    );
  }
}

// Update
export async function PUT(request, { params: { id } }) {
  try {
    const jsonData = await request.json();
    const title = jsonData.title;
    const abbreviation = jsonData.abbreviation;

    const unit = await db.unit.update({
      where: {
        id, //The id
      },
      data: {
        title,
        abbreviation
      },
    });
    return NextResponse.json(unit);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Update unit",
      },
      {
        status: 500,
      }
    );
  }
}
