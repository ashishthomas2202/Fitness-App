"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FaFire, FaWeight, FaShoePrints, FaMountain, FaMapMarkerAlt, FaTint, FaBurn } from "react-icons/fa";

// Define Yup validation schema
const validationSchema = Yup.object().shape({
    calorieGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
    weightGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
    stepsGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
    flightsClimbedGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
    distanceGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
    waterIntakeGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
    caloriesBurnedGoal: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").nullable(),
});

export default function GoalsForm({ onSave, currentGoals }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            calorieGoal: 0,
            weightGoal: 0,
            stepsGoal: 0,
            flightsClimbedGoal: 0,
            distanceGoal: 0,
            waterIntakeGoal: 0,
            caloriesBurnedGoal: 0,
        },
    });

    // Populate form fields with current goals if provided
    useEffect(() => {
        if (currentGoals) {
            Object.keys(currentGoals).forEach((goal) => {
                setValue(goal, currentGoals[goal] || 0);
            });
        }
    }, [currentGoals, setValue]);

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md">
            {/* Calorie Goal */}
            <div className="flex items-center space-x-3">
                <FaFire className="text-red-500" />
                <Label className="w-36">Calorie Goal (kcal)</Label>
                <div className="w-full">
                    <Input type="number" {...register("calorieGoal")} className="bg-gray-100 w-full" />
                    {errors.calorieGoal && <p className="text-red-500 text-sm">{errors.calorieGoal.message}</p>}
                </div>
            </div>

            {/* Weight Goal */}
            <div className="flex items-center space-x-3">
                <FaWeight className="text-blue-500" />
                <Label className="w-36">Weight Goal (lbs)</Label>
                <div className="w-full">
                    <Input type="number" {...register("weightGoal")} className="bg-gray-100 w-full" />
                    {errors.weightGoal && <p className="text-red-500 text-sm">{errors.weightGoal.message}</p>}
                </div>
            </div>

            {/* Steps Goal */}
            <div className="flex items-center space-x-3">
                <FaShoePrints className="text-green-500" />
                <Label className="w-36">Steps Goal</Label>
                <div className="w-full">
                    <Input type="number" {...register("stepsGoal")} className="bg-gray-100 w-full" />
                    {errors.stepsGoal && <p className="text-red-500 text-sm">{errors.stepsGoal.message}</p>}
                </div>
            </div>

            {/* Flights Climbed Goal */}
            <div className="flex items-center space-x-3">
                <FaMountain className="text-purple-500" />
                <Label className="w-36">Flights Climbed Goal</Label>
                <div className="w-full">
                    <Input type="number" {...register("flightsClimbedGoal")} className="bg-gray-100 w-full" />
                    {errors.flightsClimbedGoal && <p className="text-red-500 text-sm">{errors.flightsClimbedGoal.message}</p>}
                </div>
            </div>

            {/* Distance Goal */}
            <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-yellow-500" />
                <Label className="w-36">Distance Goal (miles)</Label>
                <div className="w-full">
                    <Input type="number" {...register("distanceGoal")} className="bg-gray-100 w-full" />
                    {errors.distanceGoal && <p className="text-red-500 text-sm">{errors.distanceGoal.message}</p>}
                </div>
            </div>

            {/* Water Intake Goal */}
            <div className="flex items-center space-x-3">
                <FaTint className="text-blue-400" />
                <Label className="w-36">Water Intake Goal (liters)</Label>
                <div className="w-full">
                    <Input type="number" {...register("waterIntakeGoal")} className="bg-gray-100 w-full" />
                    {errors.waterIntakeGoal && <p className="text-red-500 text-sm">{errors.waterIntakeGoal.message}</p>}
                </div>
            </div>

            {/* Calories Burned Goal */}
            <div className="flex items-center space-x-3">
                <FaBurn className="text-red-400" />
                <Label className="w-36">Calories Burned Goal</Label>
                <div className="w-full">
                    <Input type="number" {...register("caloriesBurnedGoal")} className="bg-gray-100 w-full" />
                    {errors.caloriesBurnedGoal && <p className="text-red-500 text-sm">{errors.caloriesBurnedGoal.message}</p>}
                </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2">
                Save Goal
            </Button>
        </form>
    );
}
