"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

export const Header = () => {
  return (
    <header className="w-full px-2">
      <nav className="h-16 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-violet-500">FlexFit</h1>
        <ul className="flex gap-4">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>

        <DarkModeToggle />

        <div className="flex gap-2">
          <Button>Sign In</Button>
          <Button variant="outline">Sign Up</Button>
        </div>
      </nav>
    </header>
  );
};
