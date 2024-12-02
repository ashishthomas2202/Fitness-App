//src\app\(user)\dashboard\(user)\goals\page.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import GoalsForm from "@/app/(user)/dashboard/(user)/goals/components/GoalsForm";
import GoalHistoryCard from "./components/GoalHistoryCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card } from "@/components/ui/Card";
import {
  FaFire,
  FaUtensils,
  FaMapMarkerAlt,
  FaTint,
  FaWalking,
  FaMountain,
  FaEdit,
} from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

export default function GoalsPage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState(null); // Change to null to check if goals exist
  const [isUpdateMode, setIsUpdateMode] = useState(false);
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
  const [goalsAchieved, setGoalsAchieved] = useState(0);
  const [loggedGoals, setLoggedGoals] = useState([]);
  const [hasLoggedCalorieAchievement, setHasLoggedCalorieAchievement] =
    useState(false);
  const [achievementDate, setAchievementDate] = useState(() => {
    const storedDate = localStorage.getItem("achievementDate");
    return storedDate ? storedDate : null;
  });

  const fetchGoals = async () => {
    if (!session || !session.user) {
      toast.error("User is not authenticated.");
      return;
    }
    try {
      const response = await axios.get("/api/goals", {
        params: { userId: session.user.id },
      });
      const goalsData = response.data.data;
      if (goalsData && goalsData.length > 0) {
        const goal = goalsData[0];
        setGoals(goal); // Set the goals state with fetched data
        setIsUpdateMode(true); // Set update mode if goals exist
        setCalorieGoal(goal.calorieGoal);
        setCaloriesBurnedGoal(goal.caloriesBurnedGoal);
        setStepsGoal(goal.stepsGoal);
        setFlightsGoal(goal.flightsClimbedGoal);
        setDistanceGoal(goal.distanceGoal);
        setWaterIntakeGoal(goal.waterIntakeGoal);
      } else {
        setIsUpdateMode(false); // Switch to create mode if no goals found
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  const fetchTodayActivity = async () => {
    try {
      const response = await axios.get("/api/mealplan/today", {
        params: { userId: session.user.id },
      });
      const activityData = response.data;
      setCurrentCalories(activityData.calories || 0);
      setCurrentCaloriesBurned(activityData.caloriesBurned || 0);
      setCurrentSteps(activityData.steps || 0);
      setCurrentFlights(activityData.flights || 0);
      setCurrentDistance(activityData.distance || 0);
      setCurrentWaterIntake(activityData.waterIntake || 0);
    } catch (error) {
      console.error("Failed to fetch today's activity data:", error);
    }
  };

  const fetchLoggedGoals = async (date) => {
    try {
      const from = date.toISOString().split("T")[0];
      const response = await axios.get("/api/goals/get-history", {
        params: { userId: session?.user.id, from, to: from },
      });
      const loggedGoalNames = response.data.data.map((goal) => goal.name);
      setLoggedGoals(loggedGoalNames);
    } catch (error) {
      console.error("Failed to fetch logged goals:", error);
    }
  };

  const checkGoalCompletion = async () => {
    const completedGoals = [];
    const today = new Date().toISOString().split("T")[0];
    const goalChecks = [
      { name: "Calorie Intake", current: currentCalories, target: calorieGoal },
      {
        name: "Calories Burned",
        current: currentCaloriesBurned,
        target: caloriesBurnedGoal,
      },
      { name: "Steps", current: currentSteps, target: stepsGoal },
      { name: "Flights Climbed", current: currentFlights, target: flightsGoal },
      { name: "Distance", current: currentDistance, target: distanceGoal },
      {
        name: "Water Intake",
        current: currentWaterIntake,
        target: waterIntakeGoal,
      },
    ];

    goalChecks.forEach(({ name, current, target }) => {
      if (target && current >= target && !loggedGoals.includes(name)) {
        completedGoals.push({
          name,
          progress: current,
          target,
          isCompleted: true,
          completedAt: new Date(),
        });
      }
    });

    if (
      !hasLoggedCalorieAchievement &&
      calorieGoal &&
      currentCalories >= calorieGoal
    ) {
      if (achievementDate !== today) {
        console.log("Tracking calorie achievement...");
        await trackCalorieAchievement();
        setAchievementDate(today);
        setHasLoggedCalorieAchievement(true);
        localStorage.setItem("achievementDate", today); // Persist the date
      }
    }

    if (completedGoals.length > 0) {
      await axios.post("/api/goals/add-history", { goals: completedGoals });
      fetchLoggedGoals(new Date());
    }
  };

  const trackCalorieAchievement = async () => {
    try {
      await axios.post("/api/achievements/track", {
        achievementKey: "Weekly Calorie Goal",
        progressIncrement: 1,
      });

      console.log("Achievement progress updated successfully.");
    } catch (error) {
      console.error(
        "Failed to track calorie achievement:",
        error.response?.data || error.message
      );
    }
  };

  const handleSaveGoal = async (goalData) => {
    if (!session || !session.user) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      if (isUpdateMode && goals) {
        // Update goals if they already exist
        await handleUpdateGoal(goals._id, goalData);
      } else {
        // Create goals if none exist
        await axios.post("/api/goals/create", {
          ...goalData,
          userId: session.user.id,
        });
        toast.success("Goal saved successfully!");
        setIsUpdateMode(true); // Switch to update mode after creation
        fetchGoals();
      }
    } catch (error) {
      toast.error(
        `Error saving goal: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const handleUpdateGoal = async (goalId, updatedGoalData) => {
    try {
      await axios.put(`/api/goals/update/${goalId}`, updatedGoalData);
      toast.success("Goal updated successfully!");
      fetchGoals(); // Refresh goals after update
    } catch (error) {
      toast.error(
        `Error updating goal: ${error.response?.data?.error || error.message}`
      );
    }
  };

  // Initialize data
  useEffect(() => {
    if (session?.user) {
      fetchGoals();
      fetchTodayActivity();
      fetchLoggedGoals(new Date());
    }
  }, [session]);

  // Check for goal completion and update achievements
  useEffect(() => {
    checkGoalCompletion();
    const goals = [
      { current: currentCalories, goal: calorieGoal },
      { current: currentCaloriesBurned, goal: caloriesBurnedGoal },
      { current: currentSteps, goal: stepsGoal },
      { current: currentFlights, goal: flightsGoal },
      { current: currentDistance, goal: distanceGoal },
      { current: currentWaterIntake, goal: waterIntakeGoal },
    ];

    const achievedCount = goals.reduce((count, { current, goal }) => {
      if (goal > 0 && current >= goal) {
        return count + 1;
      }
      return count;
    }, 0);

    setGoalsAchieved(achievedCount);
  }, [
    currentCalories,
    currentCaloriesBurned,
    currentSteps,
    currentFlights,
    currentDistance,
    currentWaterIntake,
    calorieGoal,
    caloriesBurnedGoal,
    stepsGoal,
    flightsGoal,
    distanceGoal,
    waterIntakeGoal,
    hasLoggedCalorieAchievement,
    achievementDate,
  ]);

  function GoalCard({
    goalId,
    title,
    field,
    current,
    goal,
    color,
    unit,
    icon,
    onSaveGoal,
  }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newGoal, setNewGoal] = useState(goal);
    const percentage = Math.min((current / (goal || 1)) * 100, 100);

    const getMotivationalMessage = (current, goal) => {
      if (current === 0) {
        return "";
      }
      if (goal > 0 && current >= goal) {
        return "🎉 Goal achieved! Amazing work!";
      } else if (goal > 0 && current >= goal * 0.75) {
        return "👍 Almost there! Keep pushing!";
      } else if (goal > 0 && current >= goal * 0.5) {
        return "💪 You're halfway there!";
      } else {
        return "🌟 Great start! Keep going!";
      }
    };

    const message = getMotivationalMessage(current, goal);

    const handleEditToggle = () => {
      setIsEditing(!isEditing);
      setNewGoal(goal);
    };

    const handleSave = () => {
      onSaveGoal(newGoal);
      handleUpdateGoal(goalId, { [field]: newGoal });
      setIsEditing(false);
    };

    return (
      <motion.div layout className="w-full">
        <div
          className={`goal-card flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg transform transition-transform ${
            !isEditing ? "hover:scale-105 hover:shadow-xl" : ""
          }`}
        >
          <motion.div
            layout
            className="relative flex items-center justify-center mb-4"
          >
            <ProgressRing
              percentage={percentage}
              color={color}
              strokeWidth={10}
              noText={true}
            />
            <div className="absolute flex flex-col items-center">
              <div className="text-2xl mb-1">{icon}</div>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {current} / {goal || 0} {unit}
              </span>
            </div>
          </motion.div>
          <div className="text-center text-lg font-medium text-gray-600 dark:text-gray-300">
            {title}
          </div>
          {message && (
            <p className="mt-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              {message}
            </p>
          )}
          <AnimatePresence>
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex space-x-2"
              >
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(parseInt(e.target.value))}
                  className="border rounded px-2 py-1 dark:bg-neutral-800"
                />
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-sm bg-indigo-600 text-white rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-2 py-1 text-sm bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="absolute bottom-4 right-4 px-2 py-1 text-sm text-blue rounded"
              >
                <LuPencil />
              </button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Today's Summary
  function TodaysSummary() {
    let achievementColor = "bg-red-100 text-red-700";
    let emoji = "💪";
    let message = "You're just getting started! Aim higher tomorrow!";

    if (goalsAchieved === 6) {
      achievementColor = "bg-green-100 text-green-700";
      emoji = "🎉";
      message = "Amazing! You've achieved all your goals today!";
    } else if (goalsAchieved >= 4) {
      achievementColor = "bg-yellow-100 text-yellow-700";
      emoji = "👍";
      message = "Great job! You’re close to hitting all your goals!";
    } else if (goalsAchieved >= 2) {
      achievementColor = "bg-orange-100 text-orange-700";
      emoji = "💪";
      message = "Good effort! Keep pushing to achieve more tomorrow!";
    }

    return (
      <div
        className={`mb-6 p-6 ${achievementColor} rounded-lg shadow-lg text-center`}
      >
        <h2 className="text-2xl font-bold mb-4 text-neutral-800">
          Today’s Summary
        </h2>
        <div className="flex justify-center items-center space-x-2 mb-4">
          <span className="text-3xl">{emoji}</span>
          <p className="text-xl font-semibold">
            You met {goalsAchieved} out of 6 goals today!
          </p>
        </div>
        <p className="text-lg font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <TodaysSummary />
      <h1 className="text-3xl font-bold mb-6">Your Goals</h1>
      <GoalsForm
        onSave={(goalData) => handleSaveGoal(goalData)}
        currentGoals={goals}
        isUpdateMode={isUpdateMode}
      />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Metabolic Goals</h2>
        <Card className="p-6 bg-gray-100 dark:bg-neutral-800 rounded-lg">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-around">
            <GoalCard
              title="Calorie Intake"
              field="calorieGoal"
              goalId={goals?._id}
              current={currentCalories}
              goal={calorieGoal}
              color="#4CAF50"
              unit="kcal"
              icon={<FaUtensils />}
              onSaveGoal={setCalorieGoal}
            />
            <GoalCard
              title="Calories Burned"
              field="caloriesBurnedGoal"
              goalId={goals?._id}
              current={currentCaloriesBurned}
              goal={caloriesBurnedGoal}
              color="#FF7043"
              unit="kcal"
              icon={<FaFire />}
              onSaveGoal={setCaloriesBurnedGoal}
            />
            <GoalCard
              title="Water Consumed"
              field="waterIntakeGoal"
              goalId={goals?._id}
              current={currentWaterIntake}
              goal={waterIntakeGoal}
              color="#03A9F4"
              unit="L"
              icon={<FaTint />}
              onSaveGoal={setWaterIntakeGoal}
            />
          </div>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activity Goals</h2>
        <Card className="p-6 bg-gray-100 dark:bg-neutral-800 rounded-lg">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-around">
            <GoalCard
              title="Steps"
              field="stepsGoal"
              goalId={goals?._id}
              current={currentSteps}
              goal={stepsGoal}
              color="#FF9800"
              unit="steps"
              icon={<FaWalking />}
              onSaveGoal={setStepsGoal}
            />
            <GoalCard
              title="Flights Climbed"
              field="flightsClimbedGoal"
              goalId={goals?._id}
              current={currentFlights}
              goal={flightsGoal}
              color="#2196F3"
              unit="flights"
              icon={<FaMountain />}
              onSaveGoal={setFlightsGoal}
            />
            <GoalCard
              title="Distance"
              field="distanceGoal"
              goalId={goals?._id}
              current={currentDistance}
              goal={distanceGoal}
              color="#673AB7"
              unit="km"
              icon={<FaMapMarkerAlt />}
              onSaveGoal={setDistanceGoal}
            />
          </div>
        </Card>
      </div>
      <GoalHistoryCard userId={session?.user?.id} />
    </div>
  );
}
