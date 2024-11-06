import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    const expense = await db.expense.findUnique({
      where: {
        id, //The id
      },
      include: {
        paymentMethod: true, //Return All payment methods
      },
    });
    return NextResponse.json(expense);
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

    const updatedExpense = await db.expense.update({
      where: { id: id },
      data: {
        title: jsonData.title,
        description: jsonData.description,
        amount: parseFloat(jsonData.amount),
        date: jsonData.date,
        paymentMethod: {
          connect: {
            id: jsonData.paymentMethod.id,
            title: jsonData.paymentMethod.title,
            description: jsonData.paymentMethod.description,
            createdAt: jsonData.paymentMethod.createdAt,
          },
        },
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Update expense",
      },
      { status: 500 }
    );
  }
}
