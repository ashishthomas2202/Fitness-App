"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Page } from "@/components/dashboard/Page";
import { Calendar } from "@/components/ui/Calendar";
import axios from "axios";
import { CreateWorkoutPlanCard } from "@/app/(user)/dashboard/(user)/workout-plans/_components/CreateWorkoutPlanCard";
import { WorkoutPlanCard } from "@/app/(user)/dashboard/(user)/workout-plans/_components/WorkoutPlanCard";
import { toast } from "react-toastify";
import {
  CreateUpdateWorkoutPlanCard,
  WorkoutDialog,
} from "./_components/WorkoutDialog";
import { Card, CardContent } from "@/components/ui/Card";
import { PlusCircleIcon } from "lucide-react";

export default function WorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [workouts, setWorkouts] = useState([]);

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

  const fetchWorkouts = async () => {
    return await axios
      .get("/api/workouts")
      .then((response) => {
        if (response?.data?.success) {
          setWorkouts(response?.data?.data || []);
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

  const updateWorkoutPlan = async (planId, data) => {
    return await axios
      .put(`/api/workout-plan/${planId}/update`, data)
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Workout plan updated successfully");
          fetchWorkoutPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to update workout plan");
      });
  };

  const updateWorkoutPlanStatus = async (planId, status) => {
    return await axios
      .patch(`/api/workout-plan/${planId}/update-status`, { status })
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
  const updateWorkoutPlanColor = async (planId, color) => {
    return await axios
      .patch(`/api/workout-plan/${planId}/update-color`, { color })
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Workout plan color updated successfully");
          fetchWorkoutPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to update workout plan color");
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
    fetchWorkouts();
    fetchWorkoutPlans();
  }, []);

  return (
    <Page title="Workout Plans">
      <Calendar />
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* <CreateWorkoutPlanCard onCreate={createWorkoutPlan} />
         */}
        <WorkoutDialog onCreate={createWorkoutPlan} workouts={workouts}>
          <Card className="p-2 min-h-52 justify-center cursor-pointer">
            <CardContent className="flex flex-col gap-2 justify-center items-center py-0">
              <PlusCircleIcon size={60} />
              <h3 className="text-xl font-light select-none">
                Create Workout Plan
              </h3>
            </CardContent>
          </Card>
        </WorkoutDialog>
        {workoutPlans.map((workoutPlan) => (
          <WorkoutPlanCard
            key={workoutPlan.id}
            workouts={workouts}
            workoutPlan={workoutPlan}
            onUpdate={updateWorkoutPlan}
            updateColor={updateWorkoutPlanColor}
            updateStatus={updateWorkoutPlanStatus}
            onDelete={handleDelete}
          />
        ))}
      </section>
    </Page>
  );
}
