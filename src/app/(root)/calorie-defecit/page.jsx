// CalorieDeficitPage.jsx
"use client";

import React, { useEffect, useState } from "react";
import CalorieCalculator from "@/components/ui/CalorieCalculator";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function caloriedefecit() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (session && session.user) {
      // Fetch user data based on session userId from the API route
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

  // Fetch session and user profile data client-side
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
    <main className="min-h-[90vh]">
      <h1>Welcome to the Calorie Deficit Calculator</h1>
      {/* Pass user profile data to CalorieCalculator */}
      <CalorieCalculator user={user} />
    </main>
  );
}
