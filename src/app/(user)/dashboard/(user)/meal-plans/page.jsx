"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { PlusCircleIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import MealPlanCard from "./_components/MealPlanCard";
import MealPlanDialog from "./_components/MealPlanDialog";

export default function MealPlans() {
  const [mealPlans, setMealPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleSaveMealPlan = async (data) => {
    try {
      if (data.id) {
        await axios.put(`/api/mealplan/${data.id}`, data);
      } else {
        await axios.post("/api/mealplan/create", data);
      }
      toast.success("Meal plan saved successfully");
      fetchMealPlans();
    } catch {
      toast.error("Failed to save meal plan");
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
        <MealPlanDialog
          onSave={handleSaveMealPlan}
          meals={meals}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        >
          <Card
            className="p-2 min-h-52 justify-center cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <CardContent className="flex flex-col gap-2 justify-center items-center py-0">
              <PlusCircleIcon size={60} />
              <h3 className="text-xl font-light select-none">
                Create Meal Plan
              </h3>
            </CardContent>
          </Card>
        </MealPlanDialog>

        {mealPlans.map((mealPlan) => (
          <MealPlanCard
            key={mealPlan.id}
            mealPlan={mealPlan}
            meals={meals}
            onDelete={handleDeleteMealPlan}
            onSave={handleSaveMealPlan}
          />
        ))}
      </section>
    </div>
  );
}
