"use client";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/Button";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export const DarkModeToggle = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <span className="flex justify-center items-center gap-1">
      <Button
        variant="ghost"
        onClick={() => toggleTheme()}
        className="rounded-full h-10 w-10 p-0 font-bold border border-slate-50 dark:border-gray-800 dark:hover:border-gray-800"
      >
        {theme === "light" ? (
          <MdOutlineLightMode size={20} />
        ) : (
          <MdOutlineDarkMode size={20} />
        )}
      </Button>
    </span>
  );
};
