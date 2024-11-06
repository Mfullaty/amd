import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const onlineCustomerData = await request.json();
    const customer = await db.customerItem.create({
      data: {
        price_paid: parseFloat(onlineCustomerData.price_paid),
        price_remain: parseFloat(onlineCustomerData.price_remain),
        total:
          parseFloat(onlineCustomerData.price_paid) +
          parseFloat(onlineCustomerData.price_remain), // Include the calculated total
        itemId: onlineCustomerData.itemId,
        userId: onlineCustomerData.userId,
        added_by: onlineCustomerData.added_by,
        orderId: onlineCustomerData.orderId,
      },
    });
    console.log(onlineCustomerData);
    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Add a Customer",
      },
      {
        status: 500,
      }
    );
  }
}

