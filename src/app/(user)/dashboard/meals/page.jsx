'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddMealForm from "@/components/ui/AddMealForm";
import Link from "next/link";

const MealsPage = () => {
    const { data: session, status } = useSession();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            if (status === "authenticated" && session.user?.email) {
                try {
                    const response = await fetch(`/api/meals/list?email=${session.user.email}`);
                    const data = await response.json();

                    if (response.ok) {
                        setMeals(data.data);
                    } else {
                        setError(data.message || "Failed to fetch meals");
                    }
                } catch (err) {
                    setError("Error fetching meals");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMeals();
    }, [session, status]);

    const handleDelete = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this meal?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/meals/delete/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Meal deleted successfully");
                setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
            } else {
                alert("Failed to delete meal");
            }
        } catch (error) {
            alert("Error deleting meal");
        }
    };

    const handleMealAdded = (newMeal) => {
        setMeals((prevMeals) => [newMeal, ...prevMeals]);
    };

    if (loading) return <p>Loading meals...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Add Meal Form on the left */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Add New Meal</h2>
                    <AddMealForm onMealAdded={handleMealAdded} />
                </div>

                {/* Meal List on the right */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Your Meals</h2>
                    {meals.length === 0 ? (
                        <p>No meals added yet. Start by adding a meal!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-gray-200 text-left">
                                        <th className="p-2">Meal Name</th>
                                        <th className="p-2">Category</th>
                                        <th className="p-2">Calories</th>
                                        <th className="p-2">Macros (P/C/F)</th>
                                        <th className="p-2">Prep Time (min)</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meals.map((meal) => (
                                        <tr key={meal.id} className="border-t">
                                            <td className="p-2">{meal.name}</td>
                                            <td className="p-2">{meal.category}</td>
                                            <td className="p-2">{meal.calories}</td>
                                            <td className="p-2">
                                                {meal.macros.protein}g / {meal.macros.carbs}g / {meal.macros.fat}g
                                            </td>
                                            <td className="p-2">{meal.preparation_time_min}</td>
                                            <td className="p-2">
                                                <Link href={`/meals/edit/${meal.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    onClick={() => handleDelete(meal.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MealsPage;
