"use client";
import { useRouter } from "next/navigation";
import React from "react";
import AppIcon from "./AppIcon";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="text-lg bg-muted-foreground text-background shadow-lg dark:shadow-md dark:shadow-slate-400 hover:bg-indigo-500 transition-all ease-in-out rounded-full p-1 hover:scale-110"
      type="button"
      onClick={() => router.back()}
    >
      <AppIcon className="w-5 h-5" icon="ArrowLeft" />
    </button>
  );
}
