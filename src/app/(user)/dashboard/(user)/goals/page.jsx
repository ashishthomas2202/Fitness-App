"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import GoalsForm from "@/app/(user)/dashboard/(user)/goals/components/GoalsForm";
import WeightTracker from "@/app/(user)/dashboard/(user)/goals/components/WeightTracker";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card } from "@/components/ui/Card";
import { FaFire,FaUtensils, FaMapMarkerAlt, FaTint, FaWalking, FaMountain, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
  const [goalsAchieved, setGoalsAchieved] = useState(0);

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
      const activityData = response.data;
      setCurrentCalories(activityData.calories || 0);
      setCurrentCaloriesBurned(activityData.caloriesBurned || 0);
      setCurrentSteps(activityData.steps || 0);
      setCurrentFlights(activityData.flights || 0);
      setCurrentDistance(activityData.distance || 0);
      setCurrentWaterIntake(activityData.waterIntake || 0);
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

  useEffect(() => {
    const goals = [
      { current: currentCalories, goal: calorieGoal },
      { current: currentCaloriesBurned, goal: caloriesBurnedGoal },
      { current: currentSteps, goal: stepsGoal },
      { current: currentFlights, goal: flightsGoal },
      { current: currentDistance, goal: distanceGoal },
      { current: currentWaterIntake, goal: waterIntakeGoal },
    ];

    // Count how many goals are achieved
    const achievedCount = goals.reduce((count, { current, goal }) => {
      // Ensure goal is defined and greater than zero, and current meets or exceeds goal
      if (goal > 0 && current >= goal) {
        return count + 1;
      }
      return count;
    }, 0);

    setGoalsAchieved(achievedCount);
  }, [currentCalories, currentCaloriesBurned, currentSteps, currentFlights, currentDistance, currentWaterIntake, calorieGoal, caloriesBurnedGoal, stepsGoal, flightsGoal, distanceGoal, waterIntakeGoal]);


  // Congratulatory message for progress
  useEffect(() => {
    if (currentCalories >= calorieGoal) setMotivationalMessage("🎉 Congratulations! You've met your calorie intake goal!");
    else if (currentCalories >= calorieGoal * 0.75) setMotivationalMessage("Almost there! Keep going!");
    else setMotivationalMessage("Let's keep going towards your goals!");
  }, [currentCalories]);


  // Interactive Goal Card with edit option
  function GoalCard({ title, current, goal, color, unit, icon, message, onSaveGoal, onClearGoal }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newGoal, setNewGoal] = useState(goal);
    const percentage = Math.min((current / (goal || 1)) * 100, 100);

    const handleEditToggle = () => {
      setIsEditing(!isEditing);
      setNewGoal(goal);
    };

    const handleSave = () => {
      onSaveGoal(newGoal);
      setIsEditing(false);
    };

    return (
      <motion.div layout className="w-full">
        <div
          className={`goal-card flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-transform ${!isEditing ? 'hover:scale-105 hover:shadow-xl' : ''
            }`}
        >
          <motion.div layout className="relative flex items-center justify-center mb-4">
            {/* Render ProgressRing without percentage text */}
            <ProgressRing percentage={percentage} color={color} strokeWidth={10} noText={true} />

            {/* Centered container for icon and text */}
            <div className="absolute flex flex-col items-center">
              <div className="text-2xl mb-1">{icon}</div> {/* Icon positioned above text */}
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {current} / {goal || "N/A"} {unit}
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
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button onClick={handleSave} className="px-2 py-1 text-sm bg-green-500 text-white rounded">
                  Confirm
                </button>
                <button onClick={handleEditToggle} className="px-2 py-1 text-sm bg-gray-300 rounded">
                  Cancel
                </button>
              </motion.div>
            ) : (
              <button onClick={handleEditToggle} className="mt-4 px-2 py-1 text-sm bg-blue-500 text-white rounded">
                <FaEdit />
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
      <div className={`mb-6 p-6 ${achievementColor} rounded-lg shadow-lg text-center`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Today’s Summary
        </h2>
        <div className="flex justify-center items-center space-x-2 mb-4">
          <span className="text-3xl">{emoji}</span>
          <p className="text-xl font-semibold">
            You met {goalsAchieved} out of 6 goals today!
          </p>
        </div>
        <p className="text-lg font-medium">
          {message}
        </p>
      </div>
    );
  }




  return (
    <div className="p-4">
      <TodaysSummary />
      <h1 className="text-3xl font-bold mb-6">Your Goals</h1>
      <GoalsForm onSave={(goalData) => handleSaveGoal(goalData)} />

      {/* Metabolic Goals */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Metabolic Goals</h2>
        <Card className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-around">
            <GoalCard title="Calorie Intake" current={currentCalories} goal={calorieGoal} color="#4CAF50" unit="kcal" icon={<FaUtensils />} message={motivationalMessage} onSaveGoal={setCalorieGoal} onClearGoal={() => setCalorieGoal(null)} />
            <GoalCard title="Calories Burned" current={currentCaloriesBurned} goal={caloriesBurnedGoal} color="#FF7043" unit="kcal" icon={<FaFire />} onSaveGoal={setCaloriesBurnedGoal} onClearGoal={() => setCaloriesBurnedGoal(null)} />
            <GoalCard title="Water Consumed" current={currentWaterIntake} goal={waterIntakeGoal} color="#03A9F4" unit="L" icon={<FaTint />} onSaveGoal={setWaterIntakeGoal} onClearGoal={() => setWaterIntakeGoal(null)} />
          </div>
        </Card>
      </div>

      {/* Activity Goals */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activity Goals</h2>
        <Card className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-around">
            <GoalCard title="Steps" current={currentSteps} goal={stepsGoal} color="#FF9800" unit="steps" icon={<FaWalking />} onSaveGoal={setStepsGoal} onClearGoal={() => setStepsGoal(null)} />
            <GoalCard title="Flights Climbed" current={currentFlights} goal={flightsGoal} color="#2196F3" unit="flights" icon={<FaMountain />} onSaveGoal={setFlightsGoal} onClearGoal={() => setFlightsGoal(null)} />
            <GoalCard title="Distance" current={currentDistance} goal={distanceGoal} color="#673AB7" unit="km" icon={<FaMapMarkerAlt />} onSaveGoal={setDistanceGoal} onClearGoal={() => setDistanceGoal(null)} />
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
