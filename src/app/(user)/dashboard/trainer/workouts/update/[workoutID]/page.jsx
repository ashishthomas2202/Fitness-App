"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import WorkoutForm from "@/components/form/WorkoutForm";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { set } from "lodash";

const UpdateWorkoutPage = ({ params }) => {
  const { workoutID } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState(null);
  // const data = {
  //   reps: 20,
  //   sets: 4,
  //   calories_burned_per_min: 45,
  //   duration_min: 15,
  //   equipment: ["Dumbbells"],
  //   difficulty_level: "Beginner",
  //   muscle_groups: ["Arms"],
  //   category: ["Weight Training"],
  //   type: ["Strength"],
  //   name: "Bicep Curls",
  // };

  const fetchWorkout = async () => {
    // Fetch workout data from the server
    const response = await axios
      .get(`/api/workouts/${workoutID}`)
      .then((response) => {
        if (response?.data?.success) {
          setWorkout(response.data.data);
          return response.data.data;
        }
        return null;
      });
    setLoading(false);
    return response;
  };

  // if (!workoutID) return <p>Loading...</p>; // Handle loading state
  useLayoutEffect(() => {
    fetchWorkout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Loader2 className="w-16 h-16 animate-spin" />
      </div>
    );
  }
  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Update Workout</h1>
      <WorkoutForm mode="update" defaultValues={workout} />
    </div>
  );
};

export default UpdateWorkoutPage;
