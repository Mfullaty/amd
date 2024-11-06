import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtovtzadn",
  api_key: "571871856498513",
  api_secret: "_tFT4yonMCQM4RvTb6VoYnRxwrc",
});

export async function POST(request) {
  const { url } = await request.json();

  // Input Validation
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Valid image URL is required" }, { status: 400 });
  }

  try {
    // Extract Public ID (handle different Cloudinary URL formats)
    const publicIdMatch = url.match(/\/v\d+\/([^.]+)\.\w+$/); 
    if (!publicIdMatch) {
      return NextResponse.json(
        { error: "Could not extract public ID from URL" },
        { status: 400 }
      );
    }
    const publicId = publicIdMatch[1]; 

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    // Error Handling based on Cloudinary response
    if (result.result !== "ok") {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary", cloudinaryResult: result },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the image" },
      { status: 500 }
    );
  }
}
