import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React from "react";

export const dynamic = "force-dynamic";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex bg-background">
      <div className="w-[15%] md:w-[9%] lg:w-[17%] xl:w-[15%]">
        <Sidebar />
      </div>

      <div className="w-[85%] md:w-[91%] lg:w-[83%] xl:w-[85%] flex flex-col">
        <Navbar />

        <div className="h-full w-full px-3 pb-3 xl:px-4 xl:pb-4 overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
