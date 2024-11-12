"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { PlusCircleIcon, Trash2Icon, CheckCircleIcon } from "lucide-react";

export default function MealPlanDialog({
  onSave,
  dialogOpen,
  setDialogOpen,
  meals,
  mealPlan,
  children,
}) {
  const [planName, setPlanName] = useState("");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  useEffect(() => {
    if (mealPlan) {
      setPlanName(mealPlan.planName || "");
      setSelectedMeals(mealPlan.days?.flatMap((day) => day.meals) || []);
      setStartDate(
        mealPlan.startDate
          ? mealPlan.startDate.split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setEndDate(mealPlan.endDate ? mealPlan.endDate.split("T")[0] : "");
      setNote(mealPlan.note || "");
      const updatedDays = mealPlan.days?.reduce(
        (acc, day) => {
          acc[day.day] = true;
          return acc;
        },
        { ...daysOfWeek }
      );
      setDaysOfWeek(updatedDays || daysOfWeek);
    }
  }, [mealPlan]);

  const filteredMeals = meals.filter((meal) => {
    const matchesSearchTerm = meal.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? meal.category === selectedCategory
      : true;
    const matchesDiet = selectedDiet ? meal.diet?.includes(selectedDiet) : true;
    return matchesSearchTerm && matchesCategory && matchesDiet;
  });

  const handleToggleMeal = (meal) => {
    setSelectedMeals((prev) => {
      if (prev.some((selectedMeal) => selectedMeal.id === meal.id)) {
        return prev.filter((selectedMeal) => selectedMeal.id !== meal.id);
      } else {
        return [...prev, meal];
      }
    });
  };

  const handleRemoveMeal = (mealId) => {
    setSelectedMeals((prev) => prev.filter((meal) => meal.id !== mealId));
  };

  const handleCheckboxChange = (day) => {
    setDaysOfWeek((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveMealPlan = () => {
    const data = {
      planName,
      days: Object.keys(daysOfWeek)
        .filter((day) => daysOfWeek[day])
        .map((day) => ({
          day,
          meals: selectedMeals.map((meal, index) => ({
            mealId: meal.id,
            mealType: meal.mealType || "Lunch",
            name: meal.name,
            macros: meal.macros || { protein: 0, carbs: 0, fat: 0 },
            calories: meal.calories || 0,
            order: index,
          })),
        })),
      startDate,
      endDate,
      status: "in progress",
      note,
    };

    onSave(data);
    resetFields();
    setDialogOpen(false);
  };

  const resetFields = () => {
    setPlanName("");
    setSelectedMeals([]);
    setSearchTerm("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setDaysOfWeek({
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    });
    setNote("");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl w-full max-h-screen overflow-y-auto">
        <DialogTitle>
          {mealPlan ? "Edit Meal Plan" : "Create Meal Plan"}
        </DialogTitle>
        <div>
          <Label>Plan Name</Label>
          <Input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Label>Search Meals</Label>
          <Input
            placeholder="Search for a meal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-4">
          <div className="w-1/2">
            <Label>Filter by Category</Label>
            <select
              className="border p-2 rounded-md w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {Array.from(new Set(meals.map((meal) => meal.category))).map(
                (category, i) => (
                  <option key={`${category}-${i}`} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="w-1/2">
            <Label>Filter by Diet</Label>
            <select
              className="border p-2 rounded-md w-full"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              <option value="">All</option>
              {Array.from(
                new Set(meals.flatMap((meal) => meal.diet || []))
              ).map((diet, i) => (
                <option key={`${diet}-${i}`} value={diet}>
                  {diet}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <ScrollArea className="h-40 border rounded-md mt-2 p-3">
            {filteredMeals.map((meal, i) => (
              <div
                key={`${meal.id}-${i}`}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-md mb-2"
              >
                <div>
                  <p className="font-semibold">{meal.name}</p>
                  <p className="text-sm text-gray-600">
                    Calories: {meal.calories} kcal
                  </p>
                  <p className="text-sm text-gray-600">
                    Protein: {meal.macros?.protein || 0}g, Carbs:{" "}
                    {meal.macros?.carbs || 0}g, Fat: {meal.macros?.fat || 0}g
                  </p>
                </div>
                {selectedMeals.some(
                  (selectedMeal) => selectedMeal.id === meal.id
                ) ? (
                  <CheckCircleIcon
                    onClick={() => handleToggleMeal(meal)}
                    size={24}
                    className="cursor-pointer text-green-500"
                    aria-label="Selected Meal"
                  />
                ) : (
                  <PlusCircleIcon
                    onClick={() => handleToggleMeal(meal)}
                    size={24}
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    aria-label="Add Meal"
                  />
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="mt-4">
          <Label>Selected Meals</Label>
          <ScrollArea className="h-32 border rounded-md mt-2 p-3">
            {selectedMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-md mb-2"
              >
                <div>
                  <p className="font-semibold">{meal.name}</p>
                  <p className="text-sm text-gray-600">
                    Calories: {meal.calories} kcal
                  </p>
                  <p className="text-sm text-gray-600">
                    Protein: {meal.macros?.protein || 0}g, Carbs:{" "}
                    {meal.macros?.carbs || 0}g, Fat: {meal.macros?.fat || 0}g
                  </p>
                </div>
                <Trash2Icon
                  onClick={() => handleRemoveMeal(meal.id)}
                  size={20}
                  className="cursor-pointer text-red-500"
                  aria-label="Remove Meal"
                />
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="mt-4">
          <Label>Days of the Week</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.keys(daysOfWeek).map((day) => (
              <div key={day} className="flex items-center">
                <Checkbox
                  checked={daysOfWeek[day]}
                  onCheckedChange={() => handleCheckboxChange(day)}
                />
                <span className="ml-2">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
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
        <div>
          <Label>Note</Label>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <Button onClick={handleSaveMealPlan} className="mt-4">
          Save Meal Plan
        </Button>
      </DialogContent>
    </Dialog>
  );
}
