import { cn } from "@/lib/utils";
import React from "react";

export const SmallCard = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => {
  return (
    <div className="w-full  md:w-1/3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className={cn("text-sm md:text-base text-foreground/90", className)}>{value}</p>
    </div>
  );
};

