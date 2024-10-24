"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Page } from "@/components/dashboard/Page";
import { Calendar } from "@/components/ui/Calendar";
import axios from "axios";
import { CreateWorkoutPlanCard } from "@/app/(user)/dashboard/(user)/workout-plans/_components/CreateWorkoutPlanCard";

export default function WorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const fetchWorkoutPlans = async () => {
    // Fetch workout plans
    return await axios
      .get("/api/workout-plan")
      .then((response) => {
        if (response?.data?.success) {
          setWorkoutPlans(response?.data?.data || []);
          return response?.data?.data || [];
        }
        return [];
      })
      .catch((error) => {
        return [];
      });
  };

  const handleAddWorkout = async () => {
    console.log("Add workout plan");
  };

  const createWorkoutPlan = async (data) => {
    return await axios
      .post("/api/workout-plan/create", data)
      .then((response) => {
        if (response?.data?.success) {
          fetchWorkoutPlans();
        }
      })
      .catch((error) => {
        console.error("Error creating workout plan:", error);
      });
  };
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  return (
    <Page title="Workout Plans">
      <Calendar />
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateWorkoutPlanCard onCreate={createWorkoutPlan} />
      </section>
    </Page>
  );
}
