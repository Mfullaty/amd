import { SheetContent } from "@/components/ui/sheet";
import { Package2, UserCircle } from "lucide-react";
import Link from "next/link";
import AppIcon from "@/components/dashboard/AppIcon";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const customerNavItems = [
  {
    label: "Home",
    link: "/",
    icon: "Home",
  },
];



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

function MobileSideBar({ closeSidebar }) {

  
  const pathName = usePathname();
  const { data: session, status } = useSession();

  return (
    <SheetContent side="left" className="sm:max-w-xs">
      <nav className="grid gap-6 text-lg font-medium">
        <Link
          href="#"
          onClick={closeSidebar}
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">AMD Inc</span>
        </Link>
        {session.user.role === "CUSTOMER" ? customerNavItems.map((item, i) => (
          <Link
            key={i}
            onClick={closeSidebar}
            href={item.link}
            className={`${
              pathName === item.link
                ? "hover:text-foreground"
                : "text-muted-foreground"
            } flex items-center gap-4 px-2.5 `}
          >
            <AppIcon icon={item.icon} className="w-5 h-5" />
            {item.label}
          </Link>
        )):
        sidebarNavItems.map((item, i) => (
          <Link
            key={i}
            onClick={closeSidebar}
            href={item.link}
            className={`${
              pathName === item.link
                ? "hover:text-foreground"
                : "text-muted-foreground"
            } flex items-center gap-4 px-2.5 `}
          >
            <AppIcon icon={item.icon} className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-3 left-6">
        <Link
          href="/dashboard/profile"
          onClick={closeSidebar}
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <UserCircle className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">AMD Inc</span>
        </Link>
      </div>
    </SheetContent>
  );
}

export default MobileSideBar;
