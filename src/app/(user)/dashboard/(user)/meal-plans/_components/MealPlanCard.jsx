"use client";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { cn } from "@/lib/utils";
import { Pen, Trash2 } from "lucide-react";
import moment from "moment-timezone";
import { useLayoutEffect, useState } from "react";
import { MealDialog } from "@/app/(user)/dashboard/(user)/meal-plans/_components/MealDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

export const MealPlanCard = ({
  meals = [],
  mealPlan,
  onUpdate = () => { },
  updateStatus = () => { },
  updateColor = () => { },
  onDelete = () => { },
}) => {
  const [mealStats, setMealStats] = useState({
    totalCalories: 0,
    totalMeals: 0,
    totalUniqueMeals: 0,
    mostFrequentMealType: "",
    uniqueMeals: new Set(),
  });
  const [disableDelete, setDisableDelete] = useState(false);

  const colors = [
    { name: "Indigo", code: "#4F46E5" },
    { name: "Periwinkle", code: "#818CF8" },
    { name: "Lavender", code: "#C4B5FD" },
    { name: "Blush", code: "#F9A8D4" },
    { name: "Coral", code: "#FB7185" },
    { name: "Crimson", code: "#F87171" },
    { name: "Topaz", code: "#FFD700" },
    { name: "Saffron", code: "#FBBF24" },
    { name: "Amber", code: "#F59E0B" },
    { name: "Mint", code: "#34D399" },
    { name: "Emerald", code: "#10B981" },
    { name: "Lime", code: "#84CC16" },
    { name: "Azure", code: "#60A5FA" },
    { name: "Cerulean", code: "#3B82F6" },
    { name: "Slate", code: "#64748B" },
  ];

  const calculateMealStats = (plan) => {
    let totalCalories = 0;
    const uniqueMeals = new Set();
    const mealTypeFrequency = {};

    // Calculate stats for all meals in the plan
    plan.days.forEach((day) => {
      day.meals.forEach((meal) => {
        const mealData = meal.mealId;

        totalCalories += meal.calories || mealData.calories || 0; // Sum up calories

        uniqueMeals.add(mealData.id); // Track unique meal IDs

        // Count meal type frequency
        mealTypeFrequency[meal.mealType] =
          (mealTypeFrequency[meal.mealType] || 0) + 1;
      });
    });

    // Find the most frequent meal type
    let mostFrequentMealType = null;
    let maxFrequency = 0;

    for (const type in mealTypeFrequency) {
      if (mealTypeFrequency[type] > maxFrequency) {
        maxFrequency = mealTypeFrequency[type];
        mostFrequentMealType = type;
      }
    }

    // Prepare the final mealStats object
    const mealStats = {
      totalCalories, // Total calories for the meal plan
      totalUniqueMeals: uniqueMeals.size, // Total unique meals in the plan
      totalMeals: plan.days.reduce((sum, day) => sum + day.meals.length, 0), // Total number of meals
      mostFrequentMealType, // Most frequently selected meal type
      uniqueMeals, // Set of unique meal IDs
    };

    // Use this to set state or return the stats as needed
    setMealStats(mealStats);

    return mealStats;
  };

  useLayoutEffect(() => {
    calculateMealStats(mealPlan);
  }, [mealPlan]);

  return (
    <Card className="select-none">
      <CardHeader className="flex-row justify-between items-center p-4">
        <h3 className="text-xl font-semibold">{mealPlan.planName}</h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "text-sm font-light text-gray-600 p-1 rounded-xl border focus-visible:outline-none select-none",
                mealPlan?.status === "in progress"
                  ? "border-violet-500 text-violet-500 dark:bg-violet-500 dark:text-white"
                  : "border-gray-500 text-gray-500 dark:bg-gray-500 dark:text-white"
              )}
            >
              {mealPlan.status}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              value="in progress"
              onClick={() => {
                updateStatus(mealPlan.id, "in progress");
              }}
            >
              <p>In Progress</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              value="complete"
              onClick={() => {
                updateStatus(mealPlan.id, "complete");
              }}
            >
              <p>Complete</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Meal Days:
          </p>
          <DaysList days={mealPlan.days} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600">
            Total Meals:{" "}
            <span className="text-violet-500 font-bold text-base">
              {mealStats?.totalMeals}
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-600">
            Total Calories:{" "}
            <span className="text-violet-500 font-bold text-base">
              ~ {mealStats?.totalCalories} kCal
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-600">
            Most Frequent Meal Type:{" "}
            <span className="text-violet-500 font-bold text-base">
              {mealStats?.mostFrequentMealType}
            </span>
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-semibold text-gray-600">Color:</p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className=" border dark:border-none dark:bg-neutral-900 rounded-full p-1">
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{
                      backgroundColor: mealPlan.color,
                    }}
                  ></div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
                {colors.map((c) => (
                  <DropdownMenuItem
                    className="flex items-center gap-2 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
                    key={`${c.code}-${Date()}-color-picker`}
                    onClick={() => updateColor(mealPlan.id, c.code)}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.code }}
                    ></div>
                    <p>{c.name}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Start Date:</span>{" "}
            <span className="text-violet-500">
              {moment(mealPlan.startDate).format("MMM DD, YYYY")}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">End Date:</span>{" "}
            <span className="text-violet-500">
              {mealPlan?.endDate
                ? moment(mealPlan.endDate).format("MMM DD, YYYY")
                : "-"}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <MealDialog
          meals={meals}
          data={mealPlan}
          mode="update"
          onUpdate={onUpdate}
        >
          <Button
            className="h-10 w-10 p-2 text-primary border-primary bg-transparent hover:bg-primary hover:text-white"
            variant="outline"
          >
            <Pen />
          </Button>
        </MealDialog>
        <MealViewDialog meals={mealStats?.uniqueMeals}
          listOfMeals={meals}
        />
        <Button
          className="h-10 w-10 p-2 text-rose-500 border-rose-500 bg-transparent hover:bg-rose-500 hover:text-white"
          variant="outline"
          disabled={disableDelete}
          onClick={() => {
            setDisableDelete(true);
            onDelete(mealPlan.id);
          }}
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
};

const DaysList = ({ days = [] }) => {
  let daysList = {
    Monday: {
      symbol: "M",
      selected: false,
    },
    Tuesday: {
      symbol: "T",
      selected: false,
    },

    Wednesday: {
      symbol: "W",
      selected: false,
    },
    Thursday: {
      symbol: "Th",
      selected: false,
    },
    Friday: {
      symbol: "F",
      selected: false,
    },
    Saturday: {
      symbol: "S",
      selected: false,
    },
    Sunday: {
      symbol: "Su",
      selected: false,
    },
  };

  days.map((d) => {
    daysList[d.day].selected = true;
  });

  return (
    <ul className="flex gap-2">
      {Object.keys(daysList).map((d, index) => (
        <li
          key={index}
          className={cn(
            "w-8 h-8 flex justify-center items-center border rounded-full text-sm font-light text-violet-500 border-violet-500",
            daysList[d].selected ? "bg-violet-500 text-white" : "bg-transparent"
          )}
        >
          {daysList[d].symbol}
        </li>
      ))}
    </ul>
  );
};

const MealViewDialog = ({ meals = [], listOfMeals }) => {
  const mapMeals = () => {
    return [...meals].map((meal) => {
      const currentMeal = listOfMeals.find((m) => m.id === meal);
      return {
        ...currentMeal
      };
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-violet-400 hover:bg-violet-500 text-white">
          View Meals
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Meals</DialogTitle>
        <DialogDescription>
          List of meals in the meal plan
        </DialogDescription>
        <ul className="grid grid-cols-2 gap-2">
          {mapMeals().map((meal) => (
            <li
              key={meal.id}
              className="border dark:border-neutral-700 p-2 rounded-lg shadow-sm space-y-2"
            >
              <p className="text-sm font-semibold">{meal?.name}</p>
              <p className="text-xs text-gray-500">
                Calories: {meal?.calories} kCal
              </p>
              <p className="text-xs text-gray-500">
                Protein: {meal?.macros?.protein}g, Carbs: {meal?.macros?.carbs}g, Fat:{" "}
                {meal?.macros?.fat}g
              </p>
              <p className="text-xs text-gray-500">Meal Type: {meal?.mealType}</p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
