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
        protein: Yup.number()
            .typeError("Protein must be a valid number")
            .min(0, "Protein cannot be negative")
            .required("Protein is required"),
        carbs: Yup.number()
            .typeError("Carbs must be a valid number")
            .min(0, "Carbs cannot be negative")
            .required("Carbs is required"),
        fat: Yup.number()
            .typeError("Fat must be a valid number")
            .min(0, "Fat cannot be negative")
            .required("Fat is required"),
    }),
    calories: Yup.number()
        .typeError("Calories must be a valid number")
        .min(0, "Calories cannot be negative")
        .required("Calories is required"),
    ingredients: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required("Ingredient name is required"),
                amount: Yup.string().required("Ingredient amount is required"),
                unit: Yup.string().nullable(),
            })
        )
        .min(1, "At least one ingredient is required"),
    steps: Yup.array()
        .of(
            Yup.object().shape({
                description: Yup.string().required("Step description is required"),
            })
        )
        .min(1, "At least one step is required"),
    preparation_time_min: Yup.number()
        .typeError("Preperation time must be a valid number")
        .min(1, "Preperation time cannot be less than 1 minute")
        .required("Preperation time is required"),
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
        steps: [],
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
    const [ingredient, setIngredient] = useState({ name: "", amount: "", unit: "" });
    const [ingredientsList, setIngredientsList] = useState([]);

    const [step, setStep] = useState({ description: "" });
    const [stepsList, setStepsList] = useState([]); // List of steps added


    const units = ["g", "kg", "lbs", "ml", "cups", "tbsp", "tsp", "oz"];

    const addIngredient = () => {
        if (ingredient.name && ingredient.amount) {
            setIngredientsList([...ingredientsList, ingredient]);
            setIngredient({ name: "", amount: "", unit: "" });
            setValue("ingredients", [...ingredientsList, ingredient]);
        } else {
            toast.error("Please fill out name and amount.");
        }
    };

    // Function to remove an ingredient from the list
    const removeIngredient = (index) => {
        const newIngredientsList = ingredientsList.filter((_, i) => i !== index);
        setIngredientsList(newIngredientsList);
        setValue("ingredients", newIngredientsList);
    };

    const addStep = () => {
        if (step.description) {
            setStepsList([...stepsList, step]);
            setStep({ description: "" }); // Clear the step input field
            setValue("steps", [...stepsList, step]); // Update steps in form state
        } else {
            toast.error("Please provide a step description.");
        }
    };

    const removeStep = (index) => {
        const newStepsList = stepsList.filter((_, i) => i !== index);
        setStepsList(newStepsList);
        setValue("steps", newStepsList); // Update steps in form state
    };

    const onSubmit = async (data) => {
        console.log("data before submission", data);
        setLoading(true);
        setServerError("");
        setSuccessMessage("");

        // Flatten the ingredients
        const updatedData = {
            ...data,
            ingredients: ingredientsList,
            steps: stepsList, // Attach steps from the list

        };

        console.log("Updated data for submission", updatedData);


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
        } else if (mode === "edit") {
            // Update meal logic
            await axios.put(`/api/meals/update/${defaultValues.id}`, updatedData)
                .then((response) => {
                    if (response?.data?.success) {
                        toast.success("Meal updated successfully!");
                        router.push("/dashboard/meals");
                    } else {
                        toast.error("Failed to update meal");
                    }
                })
                .catch((error) => {
                    toast.error("Failed to update meal");
                });
        }

        setLoading(false);
    };

    useEffect(() => {
        if (defaultValues.preparation_time_min) {
            setValue("preparation_time_min", defaultValues.preparation_time_min)
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
        if (defaultValues.steps) {
            setStepsList(defaultValues.steps);
        }
        if (defaultValues.ingredients) {
            setIngredientsList(defaultValues.ingredients);
        }

    }, []);


    return (
        <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-700 shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Recipe Card</h2>

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
                            className="w-1/3 p-2 border rounded-md dark:bg-slate-500"
                            value={ingredient.name}
                            onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            className="w-1/3 p-2 border rounded-md dark:bg-slate-500"
                            value={ingredient.amount}
                            onChange={(e) => setIngredient({ ...ingredient, amount: e.target.value })}
                        />
                        <select
                            className="w-1/3 p-2 border rounded-md dark:bg-slate-500"
                            value={ingredient.unit}
                            onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
                        >
                            <option value="">No Unit</option>
                            {units.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                        <Button type="button" variant="outline" onClick={addIngredient}>
                            Add
                        </Button>
                    </div>

                    {/* Display list of ingredients */}
                    <ul>
                        {ingredientsList.map((ing, index) => (
                            <li key={index} className="flex justify-between mb-2">
                                <span>{`${ing.name} - ${ing.amount} ${ing.unit}`}</span>
                                <button type="button" onClick={() => removeIngredient(index)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    {errors.ingredients && <p className="text-red-500">{errors.ingredients.message}</p>}
                </div>
                {/* Steps */}
                <div className="mb-4">
                    <label className="block mb-2">Steps</label>
                    <div className="flex gap-4 mb-2">
                        <textarea
                            className="w-full p-2 border rounded-md dark:bg-slate-500"
                            placeholder="Enter cooking step"
                            value={step.description}
                            onChange={(e) => setStep({ description: e.target.value })}
                        />
                        <Button type="button" variant="outline" onClick={addStep}>
                            Add Step
                        </Button>
                    </div>

                    {/* Display list of steps */}
                    <ul>
                        {stepsList.map((step, index) => (
                            <li key={index} className="flex justify-between mb-2">
                                {`Step ${index + 1}: ${step.description}`}
                                <button type="button" onClick={() => removeStep(index)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    {errors.steps && <p className="text-red-500">{errors.steps.message}</p>}
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
                <div className="flex justify-center gap-4 w-full max-w-sm mx-auto">
                    <Button type="submit" variant="primary" className="flex-grow" disabled={loading}>
                        {loading ? "Saving..." : mode === "create" ? "Add Meal" : "Update Meal"}
                    </Button>
                    <Button type="button" variant="outline" className="flex-grow" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MealForm;
