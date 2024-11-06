import db from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password, phone, country, image } = await request.json();

    // Check if user email already exists
    const userExist = await db.user.findUnique({
      where: { email },
    });
    if (userExist) {
      return NextResponse.json(
        {
          message: "User already exists",
          user: null,
        },
        { status: 409 }
      );
    }

    // Check if phone number already exists
    const phoneExist = await db.user.findUnique({
      where: { phone },
    });
    if (phoneExist) {
      return NextResponse.json(
        {
          message: "Phone number already exists",
          user: null,
        },
        { status: 409 }
      );
    }

    // Check if all required fields are filled
    if (!name || !email || !password || !phone || !country) {
      return NextResponse.json(
        {
          message: "All fields are required",
          user: null,
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    if (!hashedPassword) {
      return NextResponse.json(
        {
          message: "Failed to hash password",
          user: null,
        },
        { status: 500 }
      );
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        phone,
        country,
        image,
        hashedPassword,
      },
    });
    if (!newUser) {
      return NextResponse.json(
        {
          message: "Failed to create new user",
          user: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        user: null,
      },
      { status: 500 }
    );
  }
}
