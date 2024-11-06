import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const category = await db.category.findUnique({
      where: {
        id, //The id
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch category",
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
    const description = jsonData.description;

    const category = await db.category.update({
      where: {
        id, //The id
      },
      data: {
        title,
        description
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Update category",
      },
      {
        status: 500,
      }
    );
  }
}
