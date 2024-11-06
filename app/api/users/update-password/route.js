import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function PUT(request) {
  try {
    const { password, id } = await request.json();
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          data: null,
          message: "No User Found",
        },
        { status: 404 }
      );
    }
    // Encrypt the Password =>bcrypt
    const passwordHashed = await bcrypt.hash(password, 10);
    if(!passwordHashed){
      return NextResponse.json(
        {
          data: null,
          message: "Failed To Hash Password",
        },
        { status: 500 }
      );
    }
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        hashedPassword: passwordHashed,
      },
    });
    if(!updatedUser){
      return NextResponse.json(
        {
          data: null,
          message: "Failed To Update User",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to Update User",
        error,
      },
      { status: 500 }
    );
  }
}
