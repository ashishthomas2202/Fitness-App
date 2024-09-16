import { cn } from "@/lib/utils";
import React from "react";

export const Brand = ({ className }) => {
  return (
    <h1 className={cn("text-5xl font-bold text-violet-500", className)}>
      FlexFit
    </h1>
  );
};
