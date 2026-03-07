"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export const Navbar = () => {
  const user = useAuth();

  function formatPathName(): string {
    const pathname = usePathname();

    if (!pathname) return "Overview";

    const splitRoute = pathname.split("/");
    const lastIndex = splitRoute.length - 1 > 2 ? 2 : splitRoute.length - 1;

    const pathName = splitRoute[lastIndex];

    const formattedPath = pathName.replace(/-/g, " ");

    return formattedPath;
  }

  const path = formatPathName();

  return (
    <div className="mt-3 mx-3 xl:mx-4 px-5 py-3 rounded-2xl border border-border/70 bg-card/85 backdrop-blur-sm flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-semibold text-foreground/85 capitalize">
        {path || "Overview"}
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative text-muted-foreground">
          <Bell className="size-5" />
          <p className="absolute -top-2 -right-2 size-4 bg-primary text-primary-foreground rounded-full text-[10px] text-center font-medium">
            2
          </p>
        </div>

        {user?.userId && <UserButton />}
      </div>
    </div>
  );
};
