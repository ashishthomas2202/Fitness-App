"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Page } from "@/components/dashboard/Page";
import { Calendar } from "@/components/ui/Calendar";
import axios from "axios";
import { CreateWorkoutPlanCard } from "@/app/(user)/dashboard/(user)/workout-plans/_components/CreateWorkoutPlanCard";
import { WorkoutPlanCard } from "@/app/(user)/dashboard/(user)/workout-plans/_components/WorkoutPlanCard";
import { toast } from "react-toastify";

export default function WorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const fetchWorkoutPlans = async () => {
    // Fetch workout plans
    return await axios
      .get("/api/workout-plan")
      .then((response) => {
        if (response?.data?.success) {
          console.log(response?.data?.data);
          setWorkoutPlans(response?.data?.data || []);
          return response?.data?.data || [];
        }
        return [];
      })
      .catch((error) => {
        return [];
      });
  };

  const createWorkoutPlan = async (data) => {
    return await axios
      .post("/api/workout-plan/create", data)
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Workout plan created successfully");
          fetchWorkoutPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to create workout plan");
      });
  };

  const updateWorkoutPlanStatus = async (planId, status) => {
    return await axios
      .patch("/api/workout-plan/update-status", { planId, status })
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Workout plan status updated successfully");
          fetchWorkoutPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to update workout plan status");
      });
  };

  const handleDelete = async (planId) => {
    return await axios
      .delete(`/api/workout-plan/${planId}/delete`)
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Workout plan deleted successfully");
          fetchWorkoutPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to delete workout plan");
      });
  };

  useLayoutEffect(() => {
    fetchWorkoutPlans();
  }, []);

  return (
    <Page title="Workout Plans">
      <Calendar />
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <CreateWorkoutPlanCard onCreate={createWorkoutPlan} />
        {workoutPlans.map((workoutPlan) => (
          <WorkoutPlanCard
            key={workoutPlan.id}
            workoutPlan={workoutPlan}
            updateStatus={updateWorkoutPlanStatus}
            onDelete={handleDelete}
          />
        ))}
      </section>
    </Page>
  );
}
