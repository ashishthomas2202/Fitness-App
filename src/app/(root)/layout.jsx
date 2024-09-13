import { Header } from "@/components/ui/Header";
import React from "react";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
