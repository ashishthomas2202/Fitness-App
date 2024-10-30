"use client";
import React, { useEffect, useLayoutEffect, useContext } from "react";
import { Button } from "@/components/ui/Button";
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
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ProfileContext } from "@/providers/ProfileProvider";

export const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useContext(ProfileContext);
  // const [profile, setProfile] = useState(null);

  // const fetchProfile = async () => {
  //   return await axios
  //     .get("/api/profile/get-profile")
  //     .then((response) => {
  //       // console.log("Profile data:", response.data);
  //       if (response?.data?.success) {
  //         setProfile(response.data.data);
  //         return response.data.data;
  //       }
  //       return null;
  //     })
  //     .catch((error) => {
  //       // console.error("Error fetching profile:", error);
  //       return null;
  //     });
  // };

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
      name: "Calorie Calculator",
      href: "/calorie-defecit",
    },
  ];

  // useLayoutEffect(() => {
  //   fetchProfile();
  // }, []);

  // useEffect(() => {
  //   if (session?.user?.id) {
  //     fetchProfile();
  //   }
  // }, [session]);

  return (
    <header className="w-full px-2 shadow-sm sticky top-0 z-50 bg-white dark:bg-neutral-950 dark:shadow-2xl">
      <nav className="h-16 flex justify-between items-center  max-w-screen-2xl mx-auto lg:px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="dark:bg-neutral-900 md:hidden">
              <HamburgerMenuIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {menu.map((item, i) => (
              <DropdownMenuItem
                key={`${item.name}-${i}`}
                className="text-center"
                asChild
              >
                <Link href={item?.href || ""}>{item.name}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Brand />

        <div className="flex items-center gap-2">
          <ul className="hidden md:flex gap-4">
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
            <DropdownMenuContent className="rounded-lg">
              {status === "authenticated" ? (
                <>
                  <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/workouts">Workouts</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/meals">Meals</Link>
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
