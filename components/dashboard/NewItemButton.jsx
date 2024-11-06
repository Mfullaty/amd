import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NewItemButton({ title, link }) {
  return (
    <div className="flex absolute top-4 right-2 items-center justify-center py-2 px-3 rounded-md bg-foreground hover:bg-indigo-500 transition-colors ease-in-out text-background cursor-pointer">
        <Plus width={15} className=""/>
        <Link
        className="text-sm"
        href={link}
        >
        New {title}
        </Link>
    </div>
    
  );
}
