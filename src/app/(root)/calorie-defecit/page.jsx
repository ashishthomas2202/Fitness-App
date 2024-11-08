// CalorieDeficitPage.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import CalorieCalculator from "@/components/ui/CalorieCalculator";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function CalorieDeficit() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (session && session.user) {
      const res = await axios
        .get("/api/userdata")
        .then((response) => {
          if (response?.data?.success) {
            setUser(response.data.data);
            return response.data.data;
          }
          return null;
        })
        .catch((error) => {
          return null;
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Loader2 className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
      <main 
>
  <div className="text-center mt-4 mb-6">
    <h1 className="text-2xl font-bold mb-2 cursor-text">
      Welcome to the <span className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">Calorie Deficit Calculator</span>
    </h1>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Calculate your personalized calorie targets to achieve your fitness goals
    </p>
  </div>
  
  <CalorieCalculator user={user} />
</main>
  );
}