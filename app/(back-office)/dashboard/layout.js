"use client"
import { useSession } from "next-auth/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CustomerSidebar from "./CustomerSidebar";
import Login from "@/app/login/page";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppGridDotBackgrounds from "@/components/dashboard/AppGridDotBackgrounds";

function DashboardLayout({ children }) {
  const {data: session, status} = useSession();

  if (status === "loading") {
    return <div className="min-h-screen w-full flex justify-center items-center">
      <LoadingSpinner />
    </div>
  }
  
  if(!session || status === "unauthenticated"){
    return <Login/>
  }
  

  return (
    <div className="flex min-h-screen  flex-col bg-muted/40">
      {/* SideBar */}
      {
        session.user.role !== "CUSTOMER" ? <Sidebar /> : <CustomerSidebar />
      }
      <div className="flex flex-col sm:gap-4  sm:pl-14 w-full   min-h-screen">
        {/* Header */}
        <Header />
        <main className="grid flex-1 items-start gap-4 p-2  md:p-4 md:gap-8">
          <AppGridDotBackgrounds />
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
