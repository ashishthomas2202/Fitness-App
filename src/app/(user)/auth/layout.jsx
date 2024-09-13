"use client";
import React from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Layout({ children }) {
  useDarkMode();

  return <>{children}</>;
}
