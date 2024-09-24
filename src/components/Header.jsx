"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { AiOutlineUser } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Brand } from "@/components/Brand";
import axios from "axios";
import Image from "next/image";

export const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    return await axios
      .get("/api/profile/get-profile")
      .then((response) => {
        // console.log("Profile data:", response.data);
        if (response?.data?.success) {
          setProfile(response.data.data);
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        // console.error("Error fetching profile:", error);
        return null;
      });
  };

  const menu = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/",
    },
    {
      name: "Services",
      href: "/",
    },
    {
      name: "Contact",
      href: "/",
    },
  ];

  useLayoutEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  return (
    <header className="w-full px-2">
      <nav className="h-16 flex justify-between items-center shadow-sm">
        <Brand />

        <div className="flex items-center gap-2">
          <ul className="flex gap-4">
            {menu.map((item, i) => (
              <Link key={`${item.name}-${i}`} href={item?.href || ""}>
                <li className="font-light">{item.name}</li>
              </Link>
            ))}
          </ul>

          <DarkModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full h-10 w-10 p-0 dark:bg-gray-900 dark:hover:bg-gray-800 relative overflow-hidden"
              >
                {profile ? (
                  <Image
                    className="object-cover"
                    src={profile?.profilePicture}
                    fill
                  />
                ) : (
                  <AiOutlineUser size={20} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg">
              {status === "authenticated" ? (
                <>
                  <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>

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
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full text-sm" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button variant="ghost" className="w-full text-sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};
