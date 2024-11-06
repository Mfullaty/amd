"use client";
import AppIcon from "@/components/dashboard/AppIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const sidebarNavItems = [
  {
    label: "Home",
    link: "/dashboard",
    icon: "Home",
  },
  {
    label: "Customers",
    link: "/dashboard/customers",
    icon: "BadgeDollarSign",
  },
  {
    label: "Items",
    link: "/dashboard/items",
    icon: "Boxes",
  },
  {
    label: "sales",
    link: "/dashboard/sales",
    icon: "ShoppingCart",
  },
  {
    label: "Categories",
    link: "/dashboard/categories",
    icon: "Blocks",
  },
  {
    label: "Units",
    link: "/dashboard/units",
    icon: "PencilRuler",
  },

  {
    label: "Analytics",
    link: "/dashboard/analytics",
    icon: "LineChart",
  },
  {
    label: "Users",
    link: "/dashboard/users",
    icon: "Users2",
  },
  {
    label: "Expenses",
    link: "/dashboard/expenses",
    icon: "HandCoins",
  },
];
function Sidebar() {
  const pathName = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-3">
        <TooltipProvider>
          {sidebarNavItems.map((item, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  href={item.link}
                  className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  transition-colors  md:h-8 md:w-8 ${
                    item.link === pathName
                      ? "bg-primary text-white dark:bg-white dark:text-gray-800 "
                      : "bg-white dark:text-white dark:bg-gray-800 text-gray-800 hover:text-foreground"
                  } `}
                >
                  <AppIcon
                    icon={item.icon}
                    className="w-4 h-4 transition-all group-hover:scale-110"
                  />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/profile"
                className={`flex h-9 w-9 items-center justify-center rounded-lg  transition-colors ${pathName === "/dashboard/profile" ? "text-foreground" : "text-gray-700"} hover:text-foreground md:h-8 md:w-8`}
              >
                <UserCircle className="h-7 w-7" />
                <span className="sr-only">Profile</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}

export default Sidebar;
