import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const {title, description} = await request.json();
        const paymentMethod = await db.paymentMethod.create({
            data : {
                title, 
                description
            }
        });
        console.log(paymentMethod);
        return NextResponse.json(paymentMethod)
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed To Create a Payment Method"
        },{
            status: 500
        });
    }
}

export async function GET(request){
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
    try {
        const paymentMethods = await db.paymentMethod.findMany({
          where: {
            createdAt: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined,
            },
          },
            orderBy:{
                createdAt: 'desc' //latest paymentMethod
            },
        });
        return NextResponse.json(paymentMethods);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error,
            message: "Failed To Fetch paymentMethods"
        },{
            status: 500
        });
    }
}

// Delete
export async function DELETE(request) {
    try {
      // Try to get the body containing ids
      const body = await request.json().catch(() => null);
  
      // If body has ids, delete multiple payment methods
      if (body && body.ids) {
        const { ids } = body;
        const deletePaymentMethods = await db.paymentMethod.deleteMany({
          where: {
            id: { in: ids },
          },
        });
        return NextResponse.json({ message: "Items deleted successfully", data: deletePaymentMethods });
      }
  
      // If no ids in body, try to get a single id from the query params
      const id = request.nextUrl.searchParams.get("id");
      if (id) {
        const deletePaymentMethod = await db.paymentMethod.delete({
          where: { id },
        });
        return NextResponse.json({ message: "Item deleted successfully", data: deletePaymentMethod });
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
          message: "Failed to delete payment Method",
        },
        { status: 500 }
      );
    }
  }