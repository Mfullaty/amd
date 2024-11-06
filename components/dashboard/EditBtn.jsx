import Link from "next/link";
import React from "react";
import AppIcon from "./AppIcon";

export default function EditBtn({ title, link }) {
  return (
    <div className="flex  items-center justify-center py-2 px-3 rounded-md bg-foreground hover:bg-indigo-500 transition-colors ease-in-out text-background cursor-pointer">
        <AppIcon icon="Pencil" className="w-3 h-3" />
        <Link
        className="text-sm"
        href={link}
        >
        Edit {title}
        </Link>
    </div>
    
  );
}
