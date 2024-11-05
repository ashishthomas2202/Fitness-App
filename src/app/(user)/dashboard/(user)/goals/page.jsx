// GoalsPage.jsx 
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import GoalsForm from "@/app/(user)/dashboard/(user)/goals/components/GoalsForm";
import WeightTracker from "@/app/(user)/dashboard/(user)/goals/components/WeightTracker";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";

export default function GoalsPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState([]);
  const [currentCalories, setCurrentCalories] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  // Fetch the user's goals, including the calorie goal
  const fetchGoals = async () => {
    if (!session || !session.user) {
      toast.error("User is not authenticated.");
      return;
    }
    try {
      const response = await axios.get("/api/goals", {
        params: { userId: session.user.id },
      });
      const goalsData = response.data.data || [];
      setGoals(goalsData);
      if (goalsData.length > 0) {
        setCalorieGoal(goalsData[0].calorieGoal);
      }
    } catch (error) {
      toast.error("Failed to fetch goals.");
    }
  };

  // Fetch the total calories for today's meal plan
  const fetchTodayCalories = async () => {
    try {
      const response = await axios.get("/api/mealplan/today", {
        params: { userId: session.user.id },
      });
      setCurrentCalories(response.data.calories || 0);
    } catch (error) {
      toast.error("Failed to fetch today's calorie intake.");
    }
  };

  const handleSaveGoal = async (goalData) => {
    if (!session || !session.user) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      await axios.post("/api/goals/create", {
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
    fetchTodayCalories();
  }, [session]);

  // Calculate the percentage of the calorie goal achieved and ensure it’s within bounds
  const caloriePercentage = Math.max(0, Math.min((currentCalories / (calorieGoal || 1)) * 100, 100));

  // Set motivational messages based on progress
  useEffect(() => {
    if (caloriePercentage >= 100) {
      setMotivationalMessage("Fantastic job! You've hit your goal for today!");
    } else if (caloriePercentage >= 75) {
      setMotivationalMessage("Almost there! Keep going, you're so close!");
    } else if (caloriePercentage >= 50) {
      setMotivationalMessage("Great job! You've crossed halfway. Keep it up!");
    } else if (caloriePercentage >= 25) {
      setMotivationalMessage("Nice start! Keep pushing to reach your goal!");
    } else {
      setMotivationalMessage("Let’s get started! Every step counts!");
    }
  }, [caloriePercentage]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Goals</h1>
      <GoalsForm onSave={handleSaveGoal} />

      <Card className="w-1/2 mx-auto mt-6">
        <CardHeader>
          <CardTitle>Calorie Goal</CardTitle>
          <CardDescription>Daily Calorie Intake Goal</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center relative">
          <ProgressRing
            percentage={caloriePercentage} // Safe percentage value
            color="#4CAF50"
            strokeWidth={40} // Thicker stroke width
            noText={true} // Hide the percentage text
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-700 dark:text-gray-300">
            {currentCalories} / {calorieGoal || "N/A"} kcal
          </div>
          {/* Display Motivational Message */}
          <p className="mt-4 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            {motivationalMessage}
          </p>
        </CardContent>
      </Card>

      {/* Weight Tracker component for graphing weight history */}
      <div className="mt-8">
        <WeightTracker />
      </div>

      <div className="mt-6">
        {goals.map((goal) => (
          <div key={goal.id} className="border p-4 mb-4 rounded dark:border-gray-700">
            <p><strong>Calorie Goal:</strong> {goal.calorieGoal} kcal</p>
            <p><strong>Weight Goal:</strong> {goal.weightGoal} lbs</p>
            <p><strong>Goal Period:</strong> {goal.startDate ? new Date(goal.startDate).toLocaleDateString() : "N/A"} - {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}