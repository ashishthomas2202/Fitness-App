"use client";// src/app/workouts/[id]/edit/page.jsx
import WorkoutForm from "@/components/ui/WorkoutForm";
import { useRouter } from "next/navigation";

const EditWorkoutPage = ({params}) => {
  const router = useRouter();
  const {workoutID} = params;
  const data = {
    "reps": 20,
    "sets": 4,
    "calories_burned_per_min": 45,
    "duration_min": 15,
    "equipment": [
      "Dumbbells"
    ],
    "difficulty_level": "Beginner",
    "muscle_groups": [
      "Arms"
    ],
    "category": [
      "Weight Training"
    ],
    "type": [
      "Strength"
    ],
    "name": "Bicep Curls"
  }
  if (!workoutID) return <p>Loading...</p>; // Handle loading state

  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Workout</h1>
      <WorkoutForm mode= "edit" defaultValues={data} />
    </div>
  );
};

export default EditWorkoutPage;
