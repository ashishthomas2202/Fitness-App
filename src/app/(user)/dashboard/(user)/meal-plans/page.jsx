"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Page } from "@/components/dashboard/Page";
import axios from "axios";
import { Calendar } from "@/components/ui/Calendar";
import { MealDialog } from "./_components/MealDialog";
import { MealPlanCard } from "./_components/MealPlanCard";
import { Card, CardContent } from "@/components/ui/Card";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "react-toastify";

export default function MealPlans() {
  const [mealPlans, setMealPlans] = useState([]);
  const [meals, setMeals] = useState([]);

  const fetchMealPlans = async () => {
    return await axios.get("/api/mealplan")
      .then((response) => {
        if (response?.data?.success) {
          setMealPlans(response?.data?.data || []);
          return response?.data?.data || [];
        }
        return [];
      })
      .catch((error) => {
        return [];
      });
  };

  const fetchMeals = async () => {
    return await axios
      .get("/api/meals")
      .then((response) => {
        if (response?.data?.success) {
          setMeals(response?.data?.data || []);
          return response?.data?.data || [];
        }
        return [];
      })
      .catch((error) => {
        return [];
      });
  };

  const createMealPlan = async (data) => {
    console.log("Payload sent to create meal plan:", data); // Debugging
    try {
      await axios.post("/api/mealplan/create", data);
      toast.success("Meal plan created successfully");
      fetchMealPlans();
    } catch (error) {
      console.error("Error creating meal plan:", error.response?.data || error.message);
      toast.error("Failed to create meal plan");
    }
  };

  const updateMealPlan = async (planId, data) => {
    return await axios
      .put(`/api/mealplan/${planId}/update`, data)
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Meal plan updated successfully");
          fetchMealPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to update meal plan");
      });
  };

  const updateMealPlanStatus = async (planId, status) => {
    return await axios
      .patch(`/api/mealplan/${planId}/update-status`, { status })
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Meal plan status updated successfully");
          fetchMealPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to update meal plan status");
      });
  };

  const updateMealPlanColor = async (planId, color) => {
    return await axios
      .patch(`/api/mealplan/${planId}/update-color`, { color })
      .then((response) => {
        if (response?.data?.success) {
          toast.success("Meal plan color updated successfully");
          fetchMealPlans();
        }
      })
      .catch((error) => {
        toast.error("Failed to update meal plan color");
      });
  };

  const handleDelete = async (planId) => {
    try {
      await axios.delete(`/api/mealplan/${planId}/delete`);
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
    <Page title="Meal Plans">
      <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Create Meal Plan Dialog */}
        <MealDialog onCreate={createMealPlan} meals={meals}>
          <Card className="p-2 min-h-52 justify-center cursor-pointer">
            <CardContent className="flex flex-col gap-2 justify-center items-center py-0">
              <PlusCircleIcon size={60} />
              <h3 className="text-xl font-light select-none">
                Create Meal Plan
              </h3>
            </CardContent>
          </Card>
        </MealDialog>

        {/* Meal Plan Cards */}
        {mealPlans.map((mealPlan) => (
          <MealPlanCard
            key={mealPlan.id}
            meals={meals}
            mealPlan={mealPlan}
            onUpdate={updateMealPlan}
            updateColor={updateMealPlanColor}
            updateStatus={updateMealPlanStatus}
            onDelete={handleDelete}
          />
        ))}
      </section>
    </Page>
  );
}
