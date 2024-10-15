"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiOutlineUser } from "react-icons/ai";
import Image from "next/image";
import { ProfileContext } from "@/providers/ProfileProvider";
import { Button } from "@/components/ui/button";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export const Header = ({ handleSidebar = () => {} }) => {
  const [greeting, setGreeting] = useState(getGreeting());
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useContext(ProfileContext);
  //   const greeting = `${getGreeting()}, ${session?.user?.firstName}`;
  //   const greeting = "Hello, User";
  //   const greeting = getGreeting();

  useEffect(() => {
    setGreeting(`${getGreeting()}, ${session?.user?.firstName || ""}`);
  }, [session]);
  return (
    <header className="sticky top-0 bg-slate-100 dark:bg-neutral-950 z-50">
      <nav className=" py-3 px-0 sm:px-2 flex flex-col justify-between items-center ">
        <div className="w-full flex justify-between gap-4">
          <Button variant="primary" onClick={handleSidebar}>
            <HamburgerMenuIcon size={20} />
          </Button>

          <h2 className="text-3xl font-bold hidden md:block">{greeting}</h2>

          <div className="flex gap-4">
            <DarkModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full h-10 w-10 p-0 dark:bg-neutral-900 dark:hover:bg-neutral-800 relative overflow-hidden"
                >
                  {session?.user && profile?.profilePicture ? (
                    <Image
                      className="object-cover"
                      src={profile?.profilePicture}
                      fill
                      alt="Profile Picture"
                      priority
                    />
                  ) : (
                    <AiOutlineUser size={20} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session?.user?.userRole == "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut({
                      callbackUrl: "/",
                      redirect: false,
                    }).then(() => {
                      router.push("/");
                    });
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <h2 className="text-3xl font-bold mt-2 md:hidden">{greeting}</h2>
      </nav>
    </header>
  );
};

const getGreeting = () => {
  const date = new Date();
  const hours = date.getHours();
  let greeting = "";
  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return greeting;
};
