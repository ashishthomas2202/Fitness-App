import { Header } from "@/components/ui/Header";
import React from "react";

export default function layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
