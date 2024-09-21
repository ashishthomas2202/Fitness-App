import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const MealList = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // For navigation

    // Fetch the list of meals from the API when the component mounts
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch("/api/meals/list");
                const data = await response.json();

                if (response.ok) {
                    setMeals(data.data); // Set the meals from API response
                } else {
                    setError(data.message || "Failed to fetch meals");
                }
            } catch (err) {
                setError("Error fetching meals");
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    // Delete meal handler
    const handleDelete = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this meal?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/meals/delete/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Meal deleted successfully");
                setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id)); // Remove the meal from UI
            } else {
                alert("Failed to delete meal");
            }
        } catch (error) {
            alert("Error deleting meal");
        }
    };

    // Render loading or error states
    if (loading) return <p>Loading meals...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Meal List</h2>
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
                                    {/* Edit Button */}
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                        onClick={() => router.push(`/dashboard/meals/edit/${meal.id}`)}
                                    >
                                        Edit
                                    </button>

                                    {/* Delete Button */}
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
        </div>
    );
};

export default MealList;
