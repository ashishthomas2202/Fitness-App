import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Validation schema using Yup
const mealSchema = Yup.object().shape({
    name: Yup.string().required("Meal name is required"),
    category: Yup.string().required("Category is required"),
    macros: Yup.object().shape({
        protein: Yup.number().min(0, "Protein must be a positive number").required("Protein is required"),
        carbs: Yup.number().min(0, "Carbs must be a positive number").required("Carbs are required"),
        fat: Yup.number().min(0, "Fat must be a positive number").required("Fat is required"),
    }),
    calories: Yup.number().min(0, "Calories must be a positive number").required("Calories are required"),
    ingredients: Yup.array().of(Yup.string().required("Ingredient is required")).min(1, "At least one ingredient is required"),
    preparation_time_min: Yup.number().positive("Preparation time must be a positive number").required("Preparation time is required"),
});

const AddMealForm = ({ onMealAdded = "create" }) => {
    const [loading, setLoading] = useState(false); // Add loading state
    // Initialize the form with React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(mealSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch("/api/meals/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const newMeal = await response.json();
                alert("Meal added successfully!");
                reset();

                // Notify parent component of the new meal
                if (onMealAdded) {
                    onMealAdded(newMeal.data);
                }
            } else {
                alert("Failed to add meal");
            }
        } catch (error) {
            console.error("Error adding meal:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md space-y-4">
            {/* Meal Name */}
            <div>
                <label className="block text-sm font-medium">Meal Name</label>
                <input
                    type="text"
                    defaultValue={""}
                    {...register("name")}
                    className={`w-full mt-1 p-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium">Dietary Category</label>
                <select
                    {...register("category")}
                    className={`w-full mt-1 p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded-md`}
                >
                    <option value="">Select Category</option>
                    <option value="No Restriction">No Restriction</option>
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
                    defaultValue={0}
                    {...register("macros.protein")}
                    className={`w-full mt-1 p-2 border ${errors.macros?.protein ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.macros?.protein && <p className="text-red-500 text-sm mt-1">{errors.macros.protein.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Carbs (g)</label>
                <input
                    type="number"
                    defaultValue={0}
                    {...register("macros.carbs")}
                    className={`w-full mt-1 p-2 border ${errors.macros?.carbs ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.macros?.carbs && <p className="text-red-500 text-sm mt-1">{errors.macros.carbs.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Fat (g)</label>
                <input
                    type="number"
                    defaultValue={0}
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
                    defaultValue={0}
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
                    defaultValue={""}
                    {...register("ingredients[0]")} // For now we assume a single ingredient. Can expand to allow dynamic input fields.
                    className={`w-full mt-1 p-2 border ${errors.ingredients ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
            </div>

            {/* Preparation Time */}
            <div>
                <label className="block text-sm font-medium">Preparation Time (minutes)</label>
                <input
                    type="number"
                    defaultValue={0}
                    {...register("preparation_time_min")}
                    className={`w-full mt-1 p-2 border ${errors.preparation_time_min ? "border-red-500" : "border-gray-300"} rounded-md`}
                />
                {errors.preparation_time_min && <p className="text-red-500 text-sm mt-1">{errors.preparation_time_min.message}</p>}
            </div>

            {/* Submit Button */}
            {/* <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
            >
                Add Meal
            </button> */}
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700" disabled={loading}> 
                {loading ? "Adding..." : "Add Meal"}  {/* Show loading text if loading */}
            </button>
        </form>
    );
};

export default AddMealForm;
