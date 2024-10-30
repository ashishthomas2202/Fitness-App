"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import moment from "moment";

export default function MealPlanDialog({ onCreate, meals, children }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [planName, setPlanName] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);
    const [note, setNote] = useState("");
    const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(null);
    const [color, setColor] = useState("#10B981"); // Default color
    const [error, setError] = useState({});

    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Adds a new day with empty meal list if not already present
    const toggleDaySelection = (day) => {
        setSelectedDays((prev) =>
            prev.some((d) => d.day === day)
                ? prev.filter((d) => d.day !== day)
                : [...prev, { day, meals: [] }]
        );
    };

    const toggleMealSelection = (day, mealId) => {
        setSelectedDays((prev) =>
            prev.map((d) => {
                if (d.day === day) {
                    const isSelected = d.meals.some((meal) => meal.mealId === mealId);
                    return {
                        ...d,
                        meals: isSelected
                            ? d.meals.filter((meal) => meal.mealId !== mealId)
                            : [...d.meals, { mealId, order: d.meals.length, quantity: null }],
                    };
                }
                return d;
            })
        );
    };

    const validate = () => {
        let errors = {};
        if (!planName) errors.planName = "Plan name is required";
        if (!startDate) errors.startDate = "Start date is required";
        if (selectedDays.length === 0) errors.days = "Select at least one day with meals";
        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateMealPlan = () => {
        if (!validate()) return;

        const data = {
            planName,
            days: selectedDays.map((d) => ({
                day: d.day,
                meals: d.meals.map((meal) => ({
                    mealId: meal.mealId,
                    order: meal.order,
                    quantity: meal.quantity,
                })),
            })),
            startDate,
            endDate,
            status: "active",
            note,
            color,
        };

        console.log("Data being sent to API:", data); // Debugging log
        onCreate(data);
        resetFields();
        setDialogOpen(false);
    };

    const resetFields = () => {
        setPlanName("");
        setSelectedDays([]);
        setStartDate(moment().format("YYYY-MM-DD"));
        setEndDate(null);
        setNote("");
        setColor("#10B981");
        setError({});
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
                <DialogTitle>Create Meal Plan</DialogTitle>
                <h2 className="text-xl font-semibold">Create Meal Plan</h2>
                <div>
                    <Label>Plan Name</Label>
                    <Input value={planName} onChange={(e) => setPlanName(e.target.value)} />
                    {error.planName && <p className="text-red-500">{error.planName}</p>}
                </div>
                <div>
                    <Label>Days</Label>
                    {dayOptions.map((day) => (
                        <div key={day} className="mt-2">
                            <Checkbox
                                checked={selectedDays.some((d) => d.day === day)}
                                onCheckedChange={() => toggleDaySelection(day)}
                            />
                            <span>{day}</span>
                            {selectedDays.some((d) => d.day === day) && (
                                <ScrollArea className="h-40 border rounded-md mt-2">
                                    {meals.map((meal) => (
                                        <div key={meal.id} className="flex items-center">
                                            <Checkbox
                                                checked={selectedDays
                                                    .find((d) => d.day === day)
                                                    .meals.some((m) => m.mealId === meal.id)}
                                                onCheckedChange={() => toggleMealSelection(day, meal.id)}
                                            />
                                            <p>{meal.name}</p>
                                        </div>
                                    ))}
                                </ScrollArea>
                            )}
                        </div>
                    ))}
                    {error.days && <p className="text-red-500">{error.days}</p>}
                </div>
                <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    {error.startDate && <p className="text-red-500">{error.startDate}</p>}
                </div>
                <div>
                    <Label>End Date</Label>
                    <Input type="date" value={endDate || ""} onChange={(e) => setEndDate(e.target.value || null)} />
                </div>
                <div>
                    <Label>Note</Label>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <Button onClick={handleCreateMealPlan}>Create Meal Plan</Button>
            </DialogContent>
        </Dialog>
    );
}