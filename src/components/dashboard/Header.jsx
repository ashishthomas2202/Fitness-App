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
} from "@/components/ui/Dropdown-menu";
import { AiOutlineUser } from "react-icons/ai";
import Image from "next/image";
import { ProfileContext } from "@/providers/ProfileProvider";
import { Button } from "@/components/ui/Button";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export const Header = ({ handleSidebar = () => {} }) => {
  const [greeting, setGreeting] = useState(getGreeting());
  const [minify, setMinify] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useContext(ProfileContext);
  //   const greeting = `${getGreeting()}, ${session?.user?.firstName}`;
  //   const greeting = "Hello, User";
  //   const greeting = getGreeting();

  const handleScroll = () => {
    const position = window.pageYOffset;
    const buffer = 20; // Buffer range for smoother transitions

    if (position > 100 + buffer) {
      setMinify(true);
    } else if (position < 100 - buffer) {
      setMinify(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

          <h2 className="text-2xl sm:text-3xl font-bold hidden md:block">
            {greeting}
          </h2>

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

        {/* <span className={cn("", minify && "delay")}> */}
        <h2
          className={cn(
            "text-3xl font-bold mt-2 md:hidden opacity-100 transition-all duration-300 h-max",
            minify && "transform -translate-y-1/2 opacity-0 h-0 mt-0"
          )}
        >
          {greeting}
        </h2>
        {/* </span> */}
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
