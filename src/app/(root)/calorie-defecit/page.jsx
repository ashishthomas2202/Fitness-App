// CalorieDeficitPage.jsx
"use client";

import React, { useEffect, useState } from "react";
import CalorieCalculator from "@/components/ui/CalorieCalculator";
import { getSession } from "next-auth/react";

export default function caloriedefecit() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session and user profile data client-side
  useEffect(() => {
    const fetchProfile = async () => {
      const session = await getSession(); // Fetch the current session

      if (session) {
        try {
          // Fetch user data based on session userId from the API route
          const res = await fetch("/api/userdata");
          const { data } = await res.json();

          if (data) {
            setUser(data); // Set the fetched user data (profile data)
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Welcome to the Calorie Deficit Calculator</h1>
      {/* Pass user profile data to CalorieCalculator */}
      <CalorieCalculator user={user} />
    </main>
  );
}
