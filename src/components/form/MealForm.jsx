"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Validation schema with Yup
const mealSchema = Yup.object().shape({
    name: Yup.string().required("Meal name is required"),
    category: Yup.string().required("Category is required"),
    macros: Yup.object().shape({
        protein: Yup.number().required("Protein is required"),
        carbs: Yup.number().required("Carbs are required"),
        fat: Yup.number().required("Fat is required"),
    }),
    calories: Yup.number().required("Calories are required"),
    ingredients: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required("Ingredient name is required"),
                amount: Yup.string().required("Ingredient amount is required"),
            })
        )
        .min(1, "At least one ingredient is required"),
    preparation_time_min: Yup.number().required("Preparation time is required"),
});

const MealForm = ({
    mode = "create",
    defaultValues = {
        name: "",
        category: "",
        macros: {
            protein: 0,
            carbs: 0,
            fat: 0,
        },
        calories: 0,
        ingredients: [],
        preparation_time_min: 0,
    },
}) => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
        reset,
    } = useForm({
        resolver: yupResolver(mealSchema),
        defaultValues: defaultValues,
    });

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Ingredient state to store individual ingredient input
    const [ingredient, setIngredient] = useState({ name: "", amount: "" });
    const [ingredientsList, setIngredientsList] = useState([]); // List of ingredients added

    const addIngredient = () => {
        if (ingredient.name && ingredient.amount) {
            const newIngredientsList = [...ingredientsList, ingredient];
            setIngredientsList(newIngredientsList);
            setIngredient({ name: "", amount: "" }); // Clear input fields after adding
            setValue("ingredients", newIngredientsList); // Update ingredients in form state
        }
    };

    // Function to remove an ingredient from the list
    const removeIngredient = (index) => {
        const newIngredientsList = ingredientsList.filter((_, i) => i !== index);
        setIngredientsList(newIngredientsList);
        setValue("ingredients", newIngredientsList); // Update ingredients in form state
    };

    const onSubmit = async (data) => {
        console.log("data before submission", data); // Add this to inspect the form data
        setLoading(true);
        setServerError("");
        setSuccessMessage("");

        // Flatten the ingredients
        const updatedData = {
            ...data,
            ingredients: ingredientsList, // Attach ingredients from the list
        };

        console.log("Updated data for submission", updatedData); // Add this to inspect the final payload


        if (mode == "create") {
            const response = await axios.post("/api/meals/create", updatedData)
                .then((response) => {
                    if (response?.data?.success) {
                        toast.success("Meal created successfully!");
                        router.push("/dashboard/meals");
                        return response?.data?.data;
                    }
                    toast.error("Failed to create meal");
                    return null;
                })
                .catch((error) => {
                    toast.error("Failed to create meal");
                    return null;
                });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (defaultValues.preparation_time_min) {
            setValue("preparation_time_min", defaultValues.name)
        }
        if (defaultValues.category) {
            setValue("category", defaultValues.category);
        }
        if (defaultValues.calories) {
            setValue("calories", defaultValues.calories);
        }
        if (defaultValues.macros) {
            setValue("macros", defaultValues.macros);
        }
        if (defaultValues.name) {
            setValue("name", defaultValues.name);
        }
        if (defaultValues.ingredients) {
            setIngredientsList(defaultValues.ingredients);
        }
    }, []);


    return (
        <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-700 shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Add New Meal</h2>

            {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="">
                {/* Meal Name */}
                <div className="mb-4">
                    <label className="block mb-2">Meal Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block mb-2">Category</label>
                    <input
                        type="text"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("category")}
                    />
                    {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                </div>

                {/* Macros */}
                <div className="mb-4">
                    <label className="block mb-2">Protein (g)</label>
                    <input
                        type="number"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("macros.protein")}
                    />
                    {errors.macros?.protein && (
                        <p className="text-red-500">{errors.macros.protein.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Carbs (g)</label>
                    <input
                        type="number"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("macros.carbs")}
                    />
                    {errors.macros?.carbs && (
                        <p className="text-red-500">{errors.macros.carbs.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Fat (g)</label>
                    <input
                        type="number"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("macros.fat")}
                    />
                    {errors.macros?.fat && (
                        <p className="text-red-500">{errors.macros.fat.message}</p>
                    )}
                </div>

                {/* Calories */}
                <div className="mb-4">
                    <label className="block mb-2">Calories</label>
                    <input
                        type="number"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("calories")}
                    />
                    {errors.calories && <p className="text-red-500">{errors.calories.message}</p>}
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                    <label className="block mb-2">Ingredients</label>
                    <div className="flex gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Ingredient"
                            className="w-1/2 p-2 border rounded-md dark:bg-slate-500"
                            value={ingredient.name}
                            onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Amount"
                            className="w-1/2 p-2 border rounded-md dark:bg-slate-500"
                            value={ingredient.amount}
                            onChange={(e) => setIngredient({ ...ingredient, amount: e.target.value })}
                        />
                        <Button type="button" variant="outline" onClick={addIngredient}>
                            Add
                        </Button>
                    </div>

                    {/* Display list of ingredients */}
                    <ul>
                        {ingredientsList.map((ing, index) => (
                            <li key={index} className="flex justify-between mb-2">
                                <span>{`${ing.name} - ${ing.amount}`}</span>
                                <button type="button" onClick={() => removeIngredient(index)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    {errors.ingredients && <p className="text-red-500">{errors.ingredients.message}</p>}
                </div>

                {/* Preparation Time */}
                <div className="mb-4">
                    <label className="block mb-2">Preparation Time (minutes)</label>
                    <input
                        type="number"
                        className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
                        {...register("preparation_time_min")}
                    />
                    {errors.preparation_time_min && (
                        <p className="text-red-500">{errors.preparation_time_min.message}</p>
                    )}
                </div>

                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Saving..." : "Add Meal"}
                </Button>
            </form>
        </div>
    );
};

export default MealForm;
