import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const item = await db.item.findUnique({
      where: {
        id, //The id
      },
      include: {
        category: true, //Return All categories
        unit: true, //Returns all associated units,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch item",
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
    const categoryId = jsonData.categoryId;
    const imageUrls = jsonData.imageUrls;
    const quantity = parseInt(jsonData.quantity);
    const unitId = jsonData.unitId;
    const price = parseFloat(jsonData.price);
    const notes = jsonData.notes;

    const item = await db.item.update({
      where: {
        id, //The id
      },
      data: {
        title,
        categoryId,
        imageUrls,
        quantity,
        unitId,
        price,
        notes
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Update item",
      },
      {
        status: 500,
      }
    );
  }
}
