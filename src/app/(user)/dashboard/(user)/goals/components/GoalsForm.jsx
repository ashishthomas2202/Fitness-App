"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GoalsForm({ onSave }) {
    const [calorieGoal, setCalorieGoal] = useState("");
    const [weightGoal, setWeightGoal] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const goalData = {
            calorieGoal: parseInt(calorieGoal),
            weightGoal: parseInt(weightGoal),
        };
        onSave(goalData);
        setCalorieGoal("");
        setWeightGoal("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Calorie Goal (kcal)</Label>
                <Input
                    type="number"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                />
            </div>
            <div>
                <Label>Weight Goal (lbs)</Label>
                <Input
                    type="number"
                    value={weightGoal}
                    onChange={(e) => setWeightGoal(e.target.value)}
                />
            </div>
            <Button type="submit" className="mt-2">Save Goal</Button>
        </form>
    );
}

