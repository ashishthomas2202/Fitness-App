// GoalsForm.jsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GoalsForm({ onSave }) {
    const [calorieGoal, setCalorieGoal] = useState("");
    const [weightGoal, setWeightGoal] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const goalData = {
            calorieGoal: parseInt(calorieGoal),
            weightGoal: parseInt(weightGoal),
            startDate: new Date(startDate).toISOString(), // Ensure ISO format
            endDate: new Date(endDate).toISOString(),     // Ensure ISO format
        };
        console.log("Goal data being submitted:", goalData); // Debugging log
        onSave(goalData);
        setCalorieGoal("");
        setWeightGoal("");
        setStartDate("");
        setEndDate("");
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
            <div>
                <Label>Start Date</Label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div>
                <Label>End Date</Label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <Button type="submit" className="mt-2">Save Goal</Button>
        </form>
    );
}

