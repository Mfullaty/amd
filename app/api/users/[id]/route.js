import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params: { id } }) {
  try {
    if (!id) {
      return NextResponse.json(
        {
          error: "Invalid ID",
          message: "ID parameter is required",
        },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id, //The id
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
          message: `No user found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "Failed To Fetch User",
      },
      {
        status: 500,
      }
    );
  }
}

// Update User Role (using PATCH)
export async function PATCH(request, { params: { id } }) {
  try {
    const jsonData = await request.json();
    const newRole = jsonData.role;

    //   Input Validation
    if (
      !newRole ||
      !["DEVELOPER", "OWNER", "ADMIN", "MANAGER", "MODERATOR", "CUSTOMER", "USER"].includes(newRole)
    ) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update Role in Database
    const updatedUser = await db.user.update({
      where: { id },
      data: { role: newRole },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed to update user role",
      },
      {
        status: 500,
      }
    );
  }
}

//UPDATE USER
export async function PUT(request, { params: { id } }) {
  try {
    const jsonData = await request.json();
    const name = jsonData.name;
    // const email = jsonData.email;

    const user = await db.user.update({
      where: {
        id, //The id
      },
      data: {
        name,
        // email
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Update user",
      },
      {
        status: 500,
      }
    );
  }
}
