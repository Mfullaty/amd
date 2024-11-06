// /app/api/customers/[id]/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const customer = await db.customerItem.findUnique({
      where: { id }, //The id
      include: {
        user: true,
        item: true
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch Customer",
      },
      { status: 500 }
    );
  }
}

// Update
export async function PUT(request, { params: { id } }) {
  try {
    const jsonData = await request.json();
    const {
      itemId,
      price_paid,
      price_remain,
      description,
      added_by,
      bringing_date,
      collection_date,
      imageUrls, // Add this line
    } = jsonData;

    const updatedCustomerItem = await db.customerItem.update({
      where: { id },
      data: {
        price_paid: parseFloat(price_paid),
        price_remain: parseFloat(price_remain),
        total: parseFloat(price_paid) + parseFloat(price_remain),
        description,
        added_by,
        bringing_date,
        collection_date,
        itemId,
        imageUrls, // Add this line
      },
    });

    return NextResponse.json(updatedCustomerItem);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Update This CustomerItem",
      },
      { status: 500 }
    );
  }
}
