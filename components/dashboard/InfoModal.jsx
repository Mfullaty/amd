"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function InfoModal({ messageTitle="", id, messageText = "Hello there, just a message here", triggerText }) {
  const [loading, setLoading] = useState(false);  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>

      <AlertDialog  onClose={() => setIsDialogOpen(loading ? true : false)}>
      <AlertDialogTrigger className="font-medium flex items-center space-x-1" onClick={() => setIsDialogOpen(true)}> {/* The trigger */}
          <span>{triggerText}</span>
      </AlertDialogTrigger>
      
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>{messageTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {messageText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-foreground text-white dark:text-black hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-500 transition-all duration-200 ease-in-out" onClick={() => setIsDialogOpen(false)}>Okay</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
