"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export default function DeleteButton({
  resourceTitle,
  id, //Handles arrays of Ids or single Id;
  deleteText,
  deleteConfirmationText = "This action cannot be undone. This will permanently delete this item and its related data",
  className = "",
  skeletonWitdth = "7",
  skeletonHeight = "3",
  afterDelete,
}) {
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDelete() {
    setIsDialogOpen(true);
    setLoading(true);
    // Handle both single ID and array of IDs
    const idsToDelete = Array.isArray(id) ? id : [id];

    try {
      const deleteUrl = new URL(`${baseUrl}/api/${resourceTitle}`);
      idsToDelete.forEach((id) => deleteUrl.searchParams.append("id", id));

      const response = await fetch(deleteUrl, { method: "DELETE" });

      if (response.ok) {
        if (afterDelete && typeof afterDelete === "function") {
          afterDelete();
        }
        toast.success("Deleted Successfully");
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during deletion");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  }

  if (typeof resourceTitle !== "string") {
    throw new Error("Resource title must be a string");
  }

  return (
    <>
      <AlertDialog onClose={() => setIsDialogOpen(loading ? true : false)}>
        <AlertDialogTrigger
          className={`font-medium flex items-center space-x-1 ${className}`}
          onClick={() => setIsDialogOpen(true)}
        >
          {" "}
          {/* The trigger */}
          {loading ? (
            <Skeleton className={`w-${skeletonWitdth} h-${skeletonHeight}`} />
          ) : (
            <span className="border-0 dark:border-0">{deleteText}</span>
          )}
        </AlertDialogTrigger>

        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmationText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white text-gray-700 border border-gray-400 hover:bg-slate-100 hover:text-black transition-all duration-200 ease-in-out"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-black text-white hover:bg-red-600 transition-all duration-200 ease-in-out"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
