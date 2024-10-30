"use client";
import React, { useEffect } from "react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import { TbLogout } from "react-icons/tb";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/hooks/useScreenSize";

export const Sidebar = ({ menu = [], open = true }) => {
  const { xs } = useScreenSize();
  //   const xs = true;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "p-2 h-screen fixed left-0 transition-all duration-300 ease-in-out",
        !open && "left-[-100px] sm:left-0"
      )}
    >
      <nav
        className={cn(
          "h-full flex flex-col gap-4 items-center justify-between w-16 sm:w-40 py-2 px-2 md rounded-xl bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 ease-in-out",
          !open && "sm:w-16"
        )}
      >
        <Brand noText={xs || !open} size={xs ? "md" : open ? "md" : "lg"} />
        <ul className="min-h-[50vh] px-2 overflow-auto">
          {menu.map((item, i) => (
            <li key={`${item.name}-${i}`} className="mb-4">
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center justify-center hover:bg-violet-100 dark:hover:bg-neutral-800  dark:hover:text-neutral-400 transition-all duration-100 ease-in-out w-10",
                  open && "sm:w-36 sm:px-2 sm:justify-start",
                  pathname === item.href && "bg-violet-100 dark:bg-neutral-800"
                )}
                asChild
              >
                <Link href={item?.href || ""}>
                  <span className="text-violet-500 font-bold">
                    {item?.icon}
                  </span>
                  <span
                    className={`overflow-hidden transition-all delay-100 duration-500 ease-in-out
        ${open ? "sm:ml-2 opacity-100 w-auto" : "opacity-0 w-0"} `}
                  >
                    {item.title}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>

        <Button
          variant="primary"
          className="justify-self-end shadow-xl w-full"
          onClick={async () => {
            await signOut({
              callbackUrl: "/",
              redirect: false,
            }).then(() => {
              router.push("/");
            });
          }}
        >
          <span className="font-bold">
            <TbLogout size={20} />
          </span>
        </Button>
      </nav>
    </aside>
  );
};
