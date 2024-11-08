// GoalsForm.jsx
// GoalsForm.jsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Calorie Goal (kcal)</Label>
                <Input type="number" value={calorieGoal} onChange={(e) => setCalorieGoal(e.target.value)} />
            </div>
            <div>
                <Label>Weight Goal (lbs)</Label>
                <Input type="number" value={weightGoal} onChange={(e) => setWeightGoal(e.target.value)} />
            </div>
            <div>
                <Label>Steps Goal</Label>
                <Input type="number" value={stepsGoal} onChange={(e) => setStepsGoal(e.target.value)} />
            </div>
            <div>
                <Label>Flights Climbed Goal</Label>
                <Input type="number" value={flightsClimbedGoal} onChange={(e) => setFlightsClimbedGoal(e.target.value)} />
            </div>
            <div>
                <Label>Distance Goal (miles)</Label>
                <Input type="number" value={distanceGoal} onChange={(e) => setDistanceGoal(e.target.value)} />
            </div>
            <div>
                <Label>Water Intake Goal (liters)</Label>
                <Input type="number" value={waterIntakeGoal} onChange={(e) => setWaterIntakeGoal(e.target.value)} />
            </div>
            <div>
                <Label>Calories Burned Goal</Label>
                <Input type="number" value={caloriesBurnedGoal} onChange={(e) => setCaloriesBurnedGoal(e.target.value)} />
            </div>
            <Button type="submit" className="mt-2">Save Goal</Button>
        </form>
    );
}
