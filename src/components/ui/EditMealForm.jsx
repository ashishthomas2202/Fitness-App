import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Yup validation schema
const editMealSchema = Yup.object().shape({
    name: Yup.string().required("Meal name is required"),
    category: Yup.string().required("Category is required"),
    macros: Yup.object().shape({
        protein: Yup.number().positive("Protein must be a positive number").required("Protein is required"),
        carbs: Yup.number().positive("Carbs must be a positive number").required("Carbs are required"),
        fat: Yup.number().positive("Fat must be a positive number").required("Fat is required"),
    }),
    calories: Yup.number().positive("Calories must be a positive number").required("Calories are required"),
    ingredients: Yup.array().of(Yup.string().required("Ingredient is required")).min(1, "At least one ingredient is required"),
    preparation_time_min: Yup.number().positive("Preparation time must be a positive number").required("Preparation time is required"),
});

const EditMealForm = ({ mealId }) => {
    const [mealData, setMealData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize the form with React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(editMealSchema),
        defaultValues: mealData, // Pre-fill the form with the fetched meal data
    });

    // Fetch the existing meal data based on the meal ID
    useEffect(() => {
        const fetchMealData = async () => {
            try {
                const response = await fetch(`/api/meals/list/${mealId}`);
                const data = await response.json();

                if (response.ok) {
                    setMealData(data);
                    reset(data); // Pre-populate the form fields
                    setLoading(false);
                } else {
                    console.error("Failed to fetch meal data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching meal:", error);
            }
        };

        fetchMealData();
    }, [mealId, reset]);

    // Form submission logic
    const onSubmit = async (data) => {
        try {
            const response = await fetch(`/api/meals/update/${mealId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Meal updated successfully!");
            } else {
                const errorData = await response.json();
                alert(`Failed to update meal: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error updating meal:", error);
        }
    };

    if (loading) return <p>Loading meal data...</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md space-y-4">
            {/* Meal Name */}
            <div>
                <label className="block text-sm font-medium">Meal Name</label>
                <input
                    type="text"
                    {...register("name")}
                    className={`w-full mt-1 p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                    {...register("category")}
                    className={`w-full mt-1 p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-md`}
                >
                    <option value="">Select Category</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            {/* Macronutrients */}
            <div>
                <label className="block text-sm font-medium">Protein (g)</label>
                <input
                    type="number"
                    {...register("macros.protein")}
                    className={`w-full mt-1 p-2 border ${errors.macros?.protein ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.macros?.protein && <p className="text-red-500 text-sm mt-1">{errors.macros.protein.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Carbs (g)</label>
                <input
                    type="number"
                    {...register("macros.carbs")}
                    className={`w-full mt-1 p-2 border ${errors.macros?.carbs ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.macros?.carbs && <p className="text-red-500 text-sm mt-1">{errors.macros.carbs.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Fat (g)</label>
                <input
                    type="number"
                    {...register("macros.fat")}
                    className={`w-full mt-1 p-2 border ${errors.macros?.fat ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.macros?.fat && <p className="text-red-500 text-sm mt-1">{errors.macros.fat.message}</p>}
            </div>

            {/* Calories */}
            <div>
                <label className="block text-sm font-medium">Calories</label>
                <input
                    type="number"
                    {...register("calories")}
                    className={`w-full mt-1 p-2 border ${errors.calories ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories.message}</p>}
            </div>

            {/* Ingredients */}
            <div>
                <label className="block text-sm font-medium">Ingredients</label>
                <input
                    type="text"
                    {...register("ingredients[0]")} // Assume a single ingredient for simplicity
                    className={`w-full mt-1 p-2 border ${errors.ingredients ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
            </div>

            {/* Preparation Time */}
            <div>
                <label className="block text-sm font-medium">Preparation Time (minutes)</label>
                <input
                    type="number"
                    {...register("preparation_time_min")}
                    className={`w-full mt-1 p-2 border ${errors.preparation_time_min ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.preparation_time_min && <p className="text-red-500 text-sm mt-1">{errors.preparation_time_min.message}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
                Update Meal
            </button>

            {/* Cancel Button */}
            <button
                type="button"
                className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 mt-2"
                onClick={() => alert("Cancelled")} // Implement navigation logic
            >
                Cancel
            </button>
        </form>
    );
};

export default EditMealForm;
