import db from "@/lib/db";
import { NextResponse } from "next/server";

// Get Users
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  try {
    const users = await db.user.findMany({
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: {
        createdAt: "desc", //latest users
      },
      include: {
        accounts: true, //Return All accounts
        profile: true, //Returns all profiles associated users,
      },
    });
    if (!users) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Failed To Fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

// Delete
export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => null);

    let usersToDelete = [];

    if (body && body.ids) {
      const { ids } = body;
      usersToDelete = await db.user.findMany({
        where: { id: { in: ids } },
      });
    } else {
      const id = request.nextUrl.searchParams.get("id");
      if (id) {
        const user = await db.user.findUnique({
          where: { id },
        });
        if (user) {
          usersToDelete = [user];
        } else {
          return NextResponse.json(
            { message: "user not found" },
            { status: 404 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "No ID or IDs provided for deletion" },
          { status: 400 }
        );
      }
    }

    // Delete images for all users
    // Delete images for all users
    for (const user of usersToDelete) {
      const publicIds = Array.isArray(user.image)
        ? user.image
            .map((url) => {
              const match = url.match(/\/v\d+\/([^.]+)\.\w+$/);
              return match ? match[1] : null;
            })
            .filter(Boolean)
        : [];

      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds, {
          resource_type: "image",
        });
      }
    }

    // Delete all users
    await db.user.deleteMany({
      where: { id: { in: usersToDelete.map((user) => user.id) } },
    });

    return NextResponse.json({ message: "users deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
