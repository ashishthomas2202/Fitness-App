"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      router.replace(`/auth/signin?callbackUrl=${pathname}`);
    }
  }, []);
  return <>{children}</>;
}
