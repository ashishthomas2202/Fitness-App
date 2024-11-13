"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import MealPlanDialog from "./MealPlanDialog";
import { Trash2Icon, PenIcon } from "lucide-react";

export default function MealPlanCard({ mealPlan, meals, onDelete, onSave }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => onDelete(mealPlan.id);

  const formatDate = (date) => {
    if (!date) return "Ongoing";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="relative p-4">
      <CardHeader>
        <h3 className="text-xl font-semibold">{mealPlan.planName}</h3>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Status:</strong> {mealPlan.status || "Not specified"}
        </p>
        <p>
          <strong>Start Date:</strong> {formatDate(mealPlan.startDate)}
        </p>
        <p>
          <strong>End Date:</strong> {formatDate(mealPlan.endDate)}
        </p>
      </CardContent>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button
          onClick={() => setDialogOpen(true)}
          variant="outline"
          className="p-1 h-8 w-8"
        >
          <PenIcon size={16} />
        </Button>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="p-1 h-8 w-8 text-red-500"
        >
          <Trash2Icon size={16} />
        </Button>
      </div>

      <MealPlanDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onSave={(updatedData) => {
          onSave({ ...updatedData, id: mealPlan.id });
        }}
        mealPlan={mealPlan}
        meals={meals}
      />
    </Card>
  );
}
