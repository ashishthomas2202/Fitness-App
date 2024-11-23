"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PublishWorkouts = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState("");

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`/api/workouts`);
      if (response?.data?.success) {
        setWorkouts(response.data.data); // Assume data contains an array of workouts
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedWorkoutID) {
      alert("Please select a workout to publish.");
      return;
    }

    try {
      const response = await axios.post(`/api/workouts/${selectedWorkoutID}/publish`);
      if (response?.data?.success) {
        alert("Workout published successfully!");
        router.push("/dashboard"); // Redirect to dashboard or another page
      } else {
        alert("Failed to publish workout. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing workout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchWorkouts();
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
      <h1 className="text-2xl font-bold mb-6">Publish Workouts</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="workout" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Workout:
          </label>
          <select
            id="workout"
            value={selectedWorkoutID}
            onChange={(e) => setSelectedWorkoutID(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="" disabled>
              Select a workout
            </option>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.name} (ID: {workout.id})
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={handlePublish}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Publish Workout
        </Button>
      </div>
    </div>
  );
};

export default PublishWorkouts;
