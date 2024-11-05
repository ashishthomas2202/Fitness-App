"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import GoalsForm from "@/app/(user)/dashboard/(user)/goals/components/GoalsForm";

export default function GoalsPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    if (!session || !session.user) {
      toast.error("User is not authenticated.");
      return;
    }
    try {
      const response = await axios.get("/api/goals", {
        params: { userId: session.user.id },
      });
      setGoals(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch goals.");
    }
  };

  const handleSaveGoal = async (goalData) => {
    if (!session || !session.user) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      const response = await axios.post("/api/goals/create", {
        ...goalData,
        userId: session.user.id,
      });
      toast.success("Goal saved successfully!");
      fetchGoals(); // Refresh goals after saving
    } catch (error) {
      toast.error(`Error saving goal: ${error.response?.data?.error || error.message}`);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [session]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Goals</h1>
      <GoalsForm onSave={handleSaveGoal} />
      <div className="mt-6">
        {goals.map((goal) => (
          <div key={goal.id} className="border p-4 mb-4 rounded">
            <p><strong>Calorie Goal:</strong> {goal.calorieGoal} kcal</p>
            <p><strong>Weight Goal:</strong> {goal.weightGoal} lbs</p>
          </div>
        ))}
      </div>
    </div>
  );
}

