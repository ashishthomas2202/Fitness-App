"use client";

import { useRouter, useParams } from "next/navigation"; // Use these hooks to handle dynamic routes
import { useEffect, useState } from "react";
import axios from "axios";
import MealForm from "@/components/form/MealForm"; // Assuming this is the path to your form
import { toast } from "react-toastify";

const EditMealPage = () => {
    const router = useRouter();
    const { id } = useParams(); // Get the meal ID from the URL params
    const [mealData, setMealData] = useState(null); // State to store fetched meal data
    const [loading, setLoading] = useState(true);

    // Fetch meal data based on the ID
    const fetchMeal = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/meals/${id}`);
            if (response?.data?.success) {
                setMealData(response.data.data); // Set meal data in state
            } else {
                toast.error("Failed to load meal");
            }
        } catch (error) {
            toast.error("Failed to fetch meal");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (id) {
            fetchMeal();
        }
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 dark:bg-slate-800 rounded-xl my-10">
            <h1 className="text-2xl font-bold mb-4">Edit Meal</h1>
            {mealData && <MealForm mode="edit" defaultValues={mealData} />} {/* Pass meal data to form */}
        </div>
    );
};

export default EditMealPage;
