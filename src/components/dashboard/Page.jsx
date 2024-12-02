import { cn } from "@/lib/utils";
import React from "react";

export const Page = ({
  title = "",
  children,
  className,
  noBackground = false,
  noTitle = false,
}) => {
  return (
    <section
      className={cn(
        "min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-70px)] py-5 px-4  max-w-[2500px] mx-auto rounded-xl",
        !noBackground && "bg-white dark:bg-neutral-900",
        className
      )}
    >
      {!noTitle && (
        <h1 className="text-3xl font-bold text-center sm:text-left mb-10">
          {title}
        </h1>
      )}
      <div>{children}</div>
    </section>
  );
};
