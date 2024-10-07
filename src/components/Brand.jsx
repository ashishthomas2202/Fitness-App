import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Brand = ({
  className,
  size = "lg",
  noText = false,
  noIcon = false,
}) => {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 50,
  };
  const textSizes = {
    sm: "text-lg sm:text-2xl",
    md: "text-xl sm:text-3xl",
    lg: "text-2xl sm:text-5xl",
  };
  return (
    <Link href="/">
      <div className={cn("flex items-center", textSizes[size] || textSizes.lg)}>
        {!noIcon && (
          <Image
            src="/flexfitlogo.jpg"
            alt="FlexFit Logo"
            width={sizes[size] || 50}
            height={sizes[size] || 50}
            className="cursor-pointer"
          />
        )}
        {!noText && (
          <h1 className={cn("font-bold text-violet-500", !noIcon && "ml-1")}>
            FlexFit
          </h1>
        )}
      </div>
    </Link>
  );
};
