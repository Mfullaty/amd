import db from "@/lib/db";
import { NextResponse } from "next/server";
const columns = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   meta: { displayName: "ID", navigationUrl: "/dashboard/expenses/[id]" },
  // },
  {
    accessorKey: "title",
    header: "Expense",
    meta: {
      displayName: "Expense",
      navigationUrl: "/dashboard/expenses/[id]",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    meta: {
      displayName: "Description",
      navigationUrl: "/dashboard/expenses/[id]",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      displayName: "Amount",
      navigationUrl: "/dashboard/expenses/[id]",
    },
  },
  // {
  //   accessorKey: "date",
  //   header: "Date",
  //   meta: {
  //     displayName: "Date",
  //     navigationUrl: "/dashboard/expenses/[id]",
  //   },
  // },
  {
    accessorKey: "paymentMethod.title",
    header: "Paid Through",
    meta: {
      displayName: "Paid Through",
      navigationUrl: "/dashboard/expenses/[id]",
    },
  },
  {
    accessorKey: "added_by",
    header: "Added By",
    meta: {
      displayName: "Added By",
      navigationUrl: "/dashboard/expenses/[id]",
    },
  },
];

export async function POST(request) {
  try {
    const expenseItemData = await request.json();

    // Create the expense
    const expense = await db.expense.create({
      data: {
        title: expenseItemData.title,
        description: expenseItemData.description,
        amount: parseFloat(expenseItemData.amount),
        date: expenseItemData.date,
        added_by: expenseItemData.added_by,
        paymentMethodId: expenseItemData.paymentMethodId,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to create expense",
      },
      { status: 500 }
    );
  }
}

// ... GET method remains as is ...
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    const expenses = await db.expense.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        paymentMethod: true, //Return All payment methods
      },
      orderBy: {
        createdAt: "desc", //latest expenses
      },
    });
    console.log(expenses);
    return NextResponse.json({ data: expenses, columns: columns });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch Expenses",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    // Try to get the body containing ids
    const body = await request.json().catch(() => null);

    // If body has ids, delete multiple expenses
    if (body && body.ids) {
      const { ids } = body;
      const deleteExpenses = await db.expense.deleteMany({
        where: {
          id: { in: ids },
        },
      });
      return NextResponse.json({
        message: "Items deleted successfully",
        data: deleteExpenses,
      });
    }

    // If no ids in body, try to get a single id from the query params
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      const deleteExpense = await db.expense.delete({
        where: { id },
      });
      return NextResponse.json({
        message: "Item deleted successfully",
        data: deleteExpense,
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
        message: "Failed to delete expense",
      },
      { status: 500 }
    );
  }
}
