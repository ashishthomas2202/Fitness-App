"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

const publishMeals = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [selectedMealID, setSelectedMealID] = useState("");

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`/api/meals`);
      if (response?.data?.success) {
        setMeals(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Error fetching meals");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedMealID) {
      toast.error("Please select a meal to publish.");
      return;
    }

    try {
      const response = await axios.post(`/api/meals/${selectedMealID}/publish`);
      if (response?.data?.success) {
        toast.success("Meal published successfully!");
        router.push("/dashboard"); // Navigate to dashboard after publishing
      } else {
        toast.error("Failed to publish meal. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing meal:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchMeals();
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
      <h1 className="text-2xl font-bold mb-6">Publish Meals</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="meal" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Meal:
          </label>
          <select
            id="meal"
            value={selectedMealID}
            onChange={(e) => setSelectedMealID(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-purple-300"
          >
            <option value="" disabled>
              Select a meal
            </option>
            {meals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name} (ID: {meal.id})
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={handlePublish}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg"
        >
          Publish Meal
        </Button>
      </div>
    </div>
  );
};

export default publishMeals;
