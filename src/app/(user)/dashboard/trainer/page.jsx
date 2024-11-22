// import React from "react";

// export default function TrainerDashboard() {
//   return <div>Trainer Dashboard</div>;
  
// }
"use client";
import React, { useState, useLayoutEffect } from "react";
import axios from "axios";

export default function TrainerDashboard() {
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [postedMeals, setPostedMeals] = useState([]);
  const [postedWorkouts, setPostedWorkouts] = useState([]);

  const fetchFollowersCount = async () => {
    try {
      const response = await axios.get("/api/follower/total/followers");
      setTotalFollowers(response.data.data.followers || 0);
    } catch {
      setTotalFollowers(0);
    }
  };

  const fetchPostedMeals = async () => {
    try {
      const response = await axios.get("/api/trainer/posted-meals");
      setPostedMeals(response.data.meals || []);
    } catch {
      setPostedMeals([]);
    }
  };

  const fetchPostedWorkouts = async () => {
    try {
      const response = await axios.get("/api/trainer/posted-workouts");
      setPostedWorkouts(response.data.workouts || []);
    } catch {
      setPostedWorkouts([]);
    }
  };

  useLayoutEffect(() => {
    fetchFollowersCount();
    fetchPostedMeals();
    fetchPostedWorkouts();
  }, []);

  return (
    <div className="content p-4">
      {/* Followers Section */}
      <div className="p-4 bg-white dark:bg-neutral-800 shadow rounded-lg mb-4">
        <h2 className="text-xl font-bold">Followers</h2>
        <p className="text-2xl">{totalFollowers}</p>
      </div>

      {/* Posted Meals Section */}
      <div className="p-4 bg-white dark:bg-neutral-800 shadow rounded-lg mb-4">
        <h2 className="text-xl font-bold">Posted Meals</h2>
        <ul className="list-disc pl-5 space-y-2">
          {postedMeals.length > 0 ? (
            postedMeals.map((meal, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {meal.name}
              </li>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No meals posted yet.</p>
          )}
        </ul>
      </div>

      {/* Posted Workout Plans Section */}
      <div className="p-4 bg-white dark:bg-neutral-800 shadow rounded-lg mb-4">
        <h2 className="text-xl font-bold">Posted Workout Plans</h2>
        <ul className="list-disc pl-5 space-y-2">
          {postedWorkouts.length > 0 ? (
            postedWorkouts.map((workout, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {workout.name}
              </li>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No workout plans posted yet.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
