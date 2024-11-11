"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FaFire, FaWeight, FaShoePrints, FaMountain, FaRulerVertical, FaTint, FaBurn } from "react-icons/fa";

export default function GoalsForm({ onSave }) {
    const [calorieGoal, setCalorieGoal] = useState("");
    const [weightGoal, setWeightGoal] = useState("");
    const [stepsGoal, setStepsGoal] = useState("");
    const [flightsClimbedGoal, setFlightsClimbedGoal] = useState("");
    const [distanceGoal, setDistanceGoal] = useState("");
    const [waterIntakeGoal, setWaterIntakeGoal] = useState("");
    const [caloriesBurnedGoal, setCaloriesBurnedGoal] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const goalData = {
            calorieGoal: parseInt(calorieGoal),
            weightGoal: parseInt(weightGoal),
            stepsGoal: parseInt(stepsGoal),
            flightsClimbedGoal: parseInt(flightsClimbedGoal),
            distanceGoal: parseFloat(distanceGoal),
            waterIntakeGoal: parseFloat(waterIntakeGoal),
            caloriesBurnedGoal: parseInt(caloriesBurnedGoal),
        };
        onSave(goalData);
        setCalorieGoal("");
        setWeightGoal("");
        setStepsGoal("");
        setFlightsClimbedGoal("");
        setDistanceGoal("");
        setWaterIntakeGoal("");
        setCaloriesBurnedGoal("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md">
            {/* Goal fields with aligned labels */}
            <div className="flex items-center space-x-3">
                <FaFire className="text-red-500" />
                <Label className="w-36">Calorie Goal (kcal)</Label> {/* Fixed width for label */}
                <Input type="number" value={calorieGoal} onChange={(e) => setCalorieGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <div className="flex items-center space-x-3">
                <FaWeight className="text-blue-500" />
                <Label className="w-36">Weight Goal (lbs)</Label>
                <Input type="number" value={weightGoal} onChange={(e) => setWeightGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <div className="flex items-center space-x-3">
                <FaShoePrints className="text-green-500" />
                <Label className="w-36">Steps Goal</Label>
                <Input type="number" value={stepsGoal} onChange={(e) => setStepsGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <div className="flex items-center space-x-3">
                <FaMountain className="text-purple-500" />
                <Label className="w-36">Flights Climbed Goal</Label>
                <Input type="number" value={flightsClimbedGoal} onChange={(e) => setFlightsClimbedGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <div className="flex items-center space-x-3">
                <FaRulerVertical className="text-yellow-500" />
                <Label className="w-36">Distance Goal (miles)</Label>
                <Input type="number" value={distanceGoal} onChange={(e) => setDistanceGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <div className="flex items-center space-x-3">
                <FaTint className="text-blue-400" />
                <Label className="w-36">Water Intake Goal (liters)</Label>
                <Input type="number" value={waterIntakeGoal} onChange={(e) => setWaterIntakeGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <div className="flex items-center space-x-3">
                <FaBurn className="text-red-400" />
                <Label className="w-36">Calories Burned Goal</Label>
                <Input type="number" value={caloriesBurnedGoal} onChange={(e) => setCaloriesBurnedGoal(e.target.value)} className="bg-gray-100 w-full" />
            </div>
            <Button type="submit" className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2">
                Save Goal
            </Button>
        </form>
    );
}

