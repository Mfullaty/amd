"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, Search } from "lucide-react";
import Link from "next/link";
import MobileSideBar from "./MobileSideBar";
import AppDropDownMenu from "@/components/dashboard/AppDropDownMenu";
import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "@/components/dashboard/ModeToggle";
import { useState } from "react";
import { generateInitials } from "@/lib/generateInitials";
import { Skeleton } from "@/components/ui/skeleton";

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const menuItems = [
    { label: "Profile", link: "/dashboard/profile" },
    {
      label: "Logout",
      onClick: () => {
        signOut();
      },
    },
  ];
  const {data: session, status} = useSession();

  const user = session?.user;

  const avatar = (
    <Avatar className="w-10 h-10 cursor-pointer">
      <AvatarImage
        src={user.image}
        alt={user.name}
        className="object-cover"
      />
      <AvatarFallback>{generateInitials(user.name)}</AvatarFallback>
    </Avatar>
  );

  return (
    <header className="bg-background shadow-md sm:py-2 sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-300 dark:border-gray-700 px-4 sm:static sm:h-auto sm:border-0 sm:px-6">
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="sm:hidden bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <MobileSideBar closeSidebar={() => setSidebarOpen(false)} />
      </Sheet>

      <div className="relative ml-auto flex-1 md:grow-0">
        <ModeToggle />
      </div>
      {
        status === "loading" ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <AppDropDownMenu
          label="My Account"
          menuItems={menuItems}
          trigger={avatar}
        />
        )
      }
     
    </header>
  );
}

export default Header;
