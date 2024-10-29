"use client";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useContext } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";

export const DarkModeToggle = () => {
  // const [theme, toggleTheme] = useDarkMode();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <span className="flex justify-center items-center gap-1">
      <Button
        variant="ghost"
        onClick={() => toggleTheme()}
        className="rounded-full h-10 w-10 p-0 font-bold border bg-white dark:bg-neutral-900 border-neutral-50  dark:border-neutral-900 dark:hover:border-neutral-800"
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
