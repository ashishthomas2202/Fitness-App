import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";

export const Brand = ({ className }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <Image src="/flexfitlogo.jpg" alt="FlexFit Logo" width={50} height={50} />
      <h1 className="ml-2 text-2xl sm:text-5xl font-bold text-violet-500">
        FlexFit
      </h1>
    </div>
  );
};
