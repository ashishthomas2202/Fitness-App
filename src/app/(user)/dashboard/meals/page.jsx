"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";
import { PencilIcon, Trash2 } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";

export default function MealsPage() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch meals from the server
    const fetchMeals = async () => {
        setLoading(true);
        await axios
            .get("/api/meals")
            .then((response) => {
                if (response?.data?.success) {
                    setMeals(response.data.data);
                    return response.data.data;
                }
                return null;
            })
            .catch((error) => {
                toast.error("Error fetching meals");
                return null;
            });
        setLoading(false);
    };

    // Delete a meal
    const deleteMeal = async (id) => {
        try {
            await axios.delete(`/api/meals/delete/${id}`);
            toast.success("Meal deleted successfully.");
            fetchMeals(); // Refresh the list after deletion
        } catch (error) {
            toast.error("Failed to delete meal.");
        }
    };

    useLayoutEffect(() => {
        fetchMeals();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Meals</h1>

            {/* Add Meal Card */}
            <div className="mb-6 max-w-sm mx-auto">
                <Button variant="primary" className="w-full py-6" asChild>
                    <Link href="/dashboard/meals/add">Add New Meal</Link>
                </Button>
            </div>

            {/* Meal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-600">
                        No meals available.
                    </p>
                ) : (
                    meals.map((meal) => (
                        <MealCard
                            key={meal.id}
                            meal={meal}
                            onDelete={() => deleteMeal(meal.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// Card component for meal
const MealCard = ({ meal, onDelete }) => {
    return (
        <div className="bg-neutral-50 dark:bg-slate-800 shadow-md rounded-lg p-6 flex flex-col justify-between">
            <h3 className="text-2xl font-semibold mb-2">{meal.name}</h3>
            <p className="text-gray-600 dark:text-white mb-4">
                Category: {meal.category}
            </p>
            <p className="text-gray-600 dark:text-white mb-4">
                Calories: {meal.calories} kcal
            </p>
            <p className="text-gray-600  dark:text-white mb-4">
                Macros: {meal.macros.protein}g Protein / {meal.macros.carbs}g Carbs /{" "}
                {meal.macros.fat}g Fat
            </p>
            <p className="text-gray-600 dark:text-white mb-4">
                Prep Time: {meal.preparation_time_min} mins
            </p>
            <div className="flex justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => Router.push(`/dashboard/meals/edit/${meal.id}`)}
                    className="w-10 h-10 p-0 flex items-center justify-center"
                >
                    <PencilIcon size={20} />
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => onDelete(meal.id)}
                    className="w-10 h-10 p-0 flex items-center justify-center"
                >
                    <Trash2 size={20} />
                </Button>
            </div>
        </div>
    );
};

