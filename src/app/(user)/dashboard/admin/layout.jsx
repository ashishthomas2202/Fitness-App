"use client";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { LuGoal, LuLayoutDashboard } from "react-icons/lu";
import { GiKnifeFork } from "react-icons/gi";
import { IoMdFitness } from "react-icons/io";
import { PiChartLineUpBold } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi2";
import { FiSettings } from "react-icons/fi";
import React, { useState, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const menu = [
    {
      title: "Dashboard",
      icon: <LuLayoutDashboard size={20} />,
      href: "/dashboard",
    },
    {
      title: "Workouts",
      icon: <IoMdFitness size={20} />,
      href: "/dashboard/admin/workouts",
    },
    // {
    //   title: "Goals",
    //   icon: <LuGoal size={20} />,
    //   href: "/dashboard/goals",
    // },
    // {
    //   title: "Meal Plans",
    //   icon: <GiKnifeFork size={20} />,
    //   href: "/dashboard/meal-plans",
    // },
    // {
    //   title: "Workout Plans",
    //   icon: <IoMdFitness size={20} />,
    //   href: "/dashboard/workout-plans",
    // },
    // {
    //   title: "Progress",
    //   icon: <PiChartLineUpBold size={20} />,
    //   href: "/dashboard/progress",
    // },
    // {
    //   title: "Community",
    //   icon: <HiUserGroup size={20} />,
    //   href: "/dashboard/community",
    // },
    // {
    //   title: "Settings",
    //   icon: <FiSettings size={20} />,
    //   href: "/dashboard/settings",
    // },
  ];

  //   useEffect(() => {
  //     setLoading(false);
  //   }, []);

  const isAdmin = async () => {
    const admin = await axios
      .get("/api/user/is-admin")
      .then((response) => {
        if (response?.data?.success) {
          return response.data.data;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });

    if (!admin) {
      router.push("/dashboard");
      toast.error("Unauthorized User");
    }

    setLoading(false);
    return admin;
  };

  useLayoutEffect(() => {
    isAdmin();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader2 className="w-16 h-16 animate-spin" />
      </div>
    );
  }
  return (
    <section className="bg-slate-100 dark:bg-neutral-950 min-h-screen">
      <Sidebar menu={menu} open={sidebarOpen} />
      <article
        className={cn(
          "pr-2 pl-2 sm:pl-20 transition-all duration-300 ease-in-out",
          sidebarOpen && "pl-20 sm:pl-44"
        )}
      >
        <Header handleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="rounded-xl overflow-y-auto">{children}</main>
      </article>
    </section>
  );
}
