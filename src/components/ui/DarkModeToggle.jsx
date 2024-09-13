"use client";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Switch } from "@/components/ui/Switch";
import { CiLight, CiDark } from "react-icons/ci";
import { Button } from "@/components/ui/Button";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export const DarkModeToggle = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <span className="flex justify-center items-center gap-1">
      <Button
        variant="ghost"
        onClick={() => toggleTheme()}
        className="rounded-full h-10 w-10 p-0 font-bold border border-slate-50 dark:border-gray-800"
      >
        {theme === "light" ? (
          <MdOutlineLightMode size={20} />
        ) : (
          <MdOutlineDarkMode size={20} />
        )}
      </Button>
      {/* <Switch
        checked={theme === "dark"}
        //   onChange={toggleTheme}
        onCheckedChange={() => toggleTheme()}
        className="bg-gray-200 dark:bg-violet-500"
      /> */}
    </span>
  );
};
