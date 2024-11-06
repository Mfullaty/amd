"use client";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import AppIcon from "./AppIcon";
import { toast } from "sonner";

export default function ImageInput({
  label,
  imageUrls,
  setImageUrls,
  className = "col-span-full",
  handleUpload, // Receive handleUpload as a prop
  resourceId, // Pass resourceId as a prop
  resource
}) {
  const [loadingStates, setLoadingStates] = useState({});
  const [showUploadButton, setShowUploadButton] = useState(true);

  useEffect(() => {
    setShowUploadButton(imageUrls.length === 0);
  }, [imageUrls]);

  const removeImage = async (url) => {
    setLoadingStates((prevState) => ({ ...prevState, [url]: true }));
    try {
      // Call your API to delete the image from Cloudinary
      const response = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image from Cloudinary");
      }

      toast.success("Removed Image");

      // Remove the image from the local state
      setImageUrls((prevUrls) =>
        prevUrls.filter((imageUrl) => imageUrl !== url)
      );


      // Update the item to reflect the image deletion
      if(resource && resourceId){
        const updateResponse = await fetch(`/api/${resource}/${resourceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrls: imageUrls.filter((imageUrl) => imageUrl !== url),
          }),
        });
  
        if (!updateResponse.ok) {
          throw new Error("Failed to update item images");
        }
        toast.success("Removed Image");
      }
    } catch (error) {
      console.error("Error Deleting image:", error);
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, [url]: false }));
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center my-4">
        <label
          htmlFor="course-image"
          className="block text-sm font-medium leading-6 text-muted-foreground"
        >
          {label}
        </label>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <Image
              src={url}
              alt={`Item image ${index + 1}`}
              layout="responsive"
              width={16}
              height={9}
              className="w-full h-64 object-cover rounded-md shadow-md dark:shadow-slate-400"
              onLoad={() =>
                setLoadingStates((prevState) => ({
                  ...prevState,
                  [url]: false,
                }))
              }
            />

            {loadingStates[url] && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
              </div>
            )}

            {!loadingStates[url] && (
              <button
                onClick={() => removeImage(url)}
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <AppIcon icon="X" className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="q8vfxsqh"
        multiple
        onSuccess={handleUpload}
        options={{ 
          multiple: true,
          maxFiles: 7,
          maxImageFileSize: 8500000,
          maxFileSize: 8500000,
          resourceType: "image",
          clientAllowedFormats: ["image"],
          maxRawFileSize: 8500000,
          sources: ["local", "camera", "url", "image_search"]
         }}
      >
        {({ open }) =>
          showUploadButton && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                open();
              }}
              variant="outline"
            >
              Upload Image(s)
            </Button>
          )
        }
      </CldUploadWidget>
    </div>
  );
}
