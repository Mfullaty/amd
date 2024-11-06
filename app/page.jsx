import { AppGrid } from "@/components/AppGrid";
import Hero from "@/components/Hero";
import AppIcon from "@/components/dashboard/AppIcon";
import { FloatingNav } from "@/components/ui/FloatingNav";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <AppIcon icon="Home" />,
  },
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <AppIcon icon="AppWindow" />,
  },
];
export default async function Home() {
  return (
    <main className="relative dark:bg-black-100 flex justify-center items-center flex-col mx-auto  sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <AppGrid />
      </div>
    </main>
  );
}
