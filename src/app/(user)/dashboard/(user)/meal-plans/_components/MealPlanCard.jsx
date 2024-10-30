"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MealPlanDialog from "./MealPlanDialog";
import { Trash2Icon, PenIcon } from "lucide-react";

export default function MealPlanCard({ mealPlan, meals, onDelete }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDelete = () => onDelete(mealPlan.id);

    return (
        <Card>
            <CardHeader className="flex justify-between items-center p-4">
                <h3 className="text-xl font-semibold">{mealPlan.planName}</h3>
                <div className="flex items-center">
                    <Button onClick={() => setDialogOpen(true)} variant="outline" className="mr-2">
                        <PenIcon />
                    </Button>
                    <Button onClick={handleDelete} variant="outline" className="text-red-500">
                        <Trash2Icon />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p>
                    <strong>Status:</strong> {mealPlan.status}
                </p>
                <p>
                    <strong>Start Date:</strong> {mealPlan.startDate}
                </p>
                <p>
                    <strong>End Date:</strong> {mealPlan.endDate || "Ongoing"}
                </p>
            </CardContent>
            <MealPlanDialog
                onCreate={(data) => console.log("Update meal plan:", data)}
                meals={meals}
            />
        </Card>
    );
}
