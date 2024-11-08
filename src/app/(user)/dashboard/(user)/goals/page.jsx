"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import GoalsForm from "@/app/(user)/dashboard/(user)/goals/components/GoalsForm";
import WeightTracker from "@/app/(user)/dashboard/(user)/goals/components/WeightTracker";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";

export default function GoalsPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState([]);
  const [currentCalories, setCurrentCalories] = useState(0);
  const [currentCaloriesBurned, setCurrentCaloriesBurned] = useState(0);
  const [currentSteps, setCurrentSteps] = useState(0);
  const [currentFlights, setCurrentFlights] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [currentWaterIntake, setCurrentWaterIntake] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(null);
  const [caloriesBurnedGoal, setCaloriesBurnedGoal] = useState(null);
  const [stepsGoal, setStepsGoal] = useState(null);
  const [flightsGoal, setFlightsGoal] = useState(null);
  const [distanceGoal, setDistanceGoal] = useState(null);
  const [waterIntakeGoal, setWaterIntakeGoal] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");

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
        const goal = goalsData[0];
        setCalorieGoal(goal.calorieGoal);
        setCaloriesBurnedGoal(goal.caloriesBurnedGoal);
        setStepsGoal(goal.stepsGoal);
        setFlightsGoal(goal.flightsClimbedGoal);
        setDistanceGoal(goal.distanceGoal);
        setWaterIntakeGoal(goal.waterIntakeGoal);
      }
    } catch (error) {
      toast.error("Failed to fetch goals.");
    }
  };

  const fetchTodayActivity = async () => {
    try {
      const response = await axios.get("/api/mealplan/today", {
        params: { userId: session.user.id },
      });
      setCurrentCalories(response.data.calories || 0);
      setCurrentCaloriesBurned(activityData.caloriesBurned || 0);
      setCurrentSteps(response.data.steps || 0);
      setCurrentFlights(response.data.flights || 0);
      setCurrentDistance(response.data.distance || 0);
      setCurrentWaterIntake(response.data.waterIntake || 0);
    } catch (error) {
      toast.error("Failed to fetch today's activity data.");
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
      fetchGoals();
    } catch (error) {
      toast.error(`Error saving goal: ${error.response?.data?.error || error.message}`);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchTodayActivity();
  }, [session]);

  const caloriePercentage = Math.min((currentCalories / (calorieGoal || 1)) * 100, 100);
  const stepsPercentage = Math.min((currentSteps / (stepsGoal || 1)) * 100, 100);
  const flightsPercentage = Math.min((currentFlights / (flightsGoal || 1)) * 100, 100);
  const distancePercentage = Math.min((currentDistance / (distanceGoal || 1)) * 100, 100);
  const waterPercentage = Math.min((currentWaterIntake / (waterIntakeGoal || 1)) * 100, 100);

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

  // Responsive Goal Card component
  function GoalCard({ title, current, goal, color, unit, message }) {
    const percentage = Math.min((current / (goal || 1)) * 100, 100);

    return (
      <div className="flex flex-col items-center justify-center w-full p-4">
        <div className="relative flex items-center justify-center">
          <ProgressRing percentage={percentage} color={color} strokeWidth={10} noText={true} />
          {/* Centered text inside the ring */}
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {current} / {goal || "N/A"} {unit}
            </span>
          </div>
        </div>
        <div className="text-center text-md text-gray-500 dark:text-gray-400 mt-2">
          {title}
        </div>
        {message && <p className="mt-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">{message}</p>}
      </div>
    );
  }


  // Page layout with responsive card arrangement
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Goals</h1>
      <GoalsForm onSave={(goalData) => handleSaveGoal(goalData)} />

      {/* Metabolic Goals */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Metabolic Goals</h2>
        <Card className="p-6">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-around">
            <GoalCard title="Calorie Intake" current={currentCalories} goal={calorieGoal} color="#4CAF50" unit="kcal" message={motivationalMessage} />
            <GoalCard title="Calories Burned" current={currentCaloriesBurned} goal={caloriesBurnedGoal} color="#FF7043" unit="kcal" />
            <GoalCard title="Water Consumed" current={currentWaterIntake} goal={waterIntakeGoal} color="#03A9F4" unit="L" />
          </div>
        </Card>
      </div>

      {/* Activity Goals */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activity Goals</h2>
        <Card className="p-6">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-around">
            <GoalCard title="Steps" current={currentSteps} goal={stepsGoal} color="#FF9800" unit="steps" />
            <GoalCard title="Flights Climbed" current={currentFlights} goal={flightsGoal} color="#2196F3" unit="flights" />
            <GoalCard title="Distance" current={currentDistance} goal={distanceGoal} color="#673AB7" unit="km" />
          </div>
        </Card>
      </div>

      {/* Weight Tracker */}
      <div className="mt-8">
        <WeightTracker />
      </div>
    </div>
  );
}
