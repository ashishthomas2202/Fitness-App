"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import MealPlanCard from "./_components/MealPlanCard";
import MealPlanDialog from "./_components/MealPlanDialog";

export default function MealPlans() {
  const [mealPlans, setMealPlans] = useState([]);
  const [meals, setMeals] = useState([]);

  const fetchMealPlans = async () => {
    try {
      const response = await axios.get("/api/mealplan");
      setMealPlans(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch meal plans");
    }
  };

  const fetchMeals = async () => {
    try {
      const response = await axios.get("/api/meals");
      setMeals(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch meals");
    }
  };

  const handleCreateMealPlan = async (data) => {
    try {
      await axios.post("/api/mealplan/create", {
        ...data,
        startDate: data.startDate || new Date(),  
        endDate: data.endDate || null
      });
      toast.success("Meal plan created successfully");
      fetchMealPlans();
    } catch {
      toast.error("Failed to create meal plan");
    }
  };

  const handleDeleteMealPlan = async (id) => {
    try {
      await axios.delete(`/api/mealplan/delete/${id}`);
      toast.success("Meal plan deleted successfully");
      fetchMealPlans();
    } catch {
      toast.error("Failed to delete meal plan");
    }
  };


  useEffect(() => {
    fetchMeals();
    fetchMealPlans();
  }, []);

  return (
    <div className="p-4">
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MealPlanDialog onCreate={handleCreateMealPlan} meals={meals}>
          <Card className="p-2 min-h-52 justify-center cursor-pointer">
            <CardContent className="flex flex-col gap-2 justify-center items-center py-0">
              <PlusCircleIcon size={60} />
              <h3 className="text-xl font-light select-none">Create Meal Plan</h3>
            </CardContent>
          </Card>
        </MealPlanDialog>

        {mealPlans.map((mealPlan) => (
          <MealPlanCard
            key={mealPlan.id}
            mealPlan={mealPlan}
            meals={meals}
            onDelete={handleDeleteMealPlan}
          />
        ))}
      </section>
    </div>
  );
}
