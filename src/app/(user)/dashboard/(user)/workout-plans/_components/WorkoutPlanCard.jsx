"use client";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Pen, Trash2 } from "lucide-react";
import moment from "moment-timezone";
import { useLayoutEffect, useState } from "react";

export const WorkoutPlanCard = ({
  workoutPlan,
  updateStatus = () => {},
  onDelete = () => {},
}) => {
  const [workoutStats, setWorkoutStats] = useState({
    totalTime: 0,
    totalCalories: 0,
    totalUniqueWorkouts: 0,
    mostTargetedMuscleGroup: "",
  });
  const [disableDelete, setDisableDelete] = useState(false);
  function calculateWorkoutStats(plan) {
    let totalTime = 0;
    let totalCalories = 0;
    const uniqueWorkouts = new Set(); // Track unique workout names
    const muscleGroupFrequency = {}; // Track muscle group frequency

    plan.days.forEach((day) => {
      day.workouts.forEach((workout) => {
        const workoutData = workout.workoutId;
        const duration = workout.durationMin || workoutData.duration_min;
        const caloriesPerMin = workoutData.calories_burned_per_min;

        totalTime += duration;
        totalCalories += duration * caloriesPerMin;

        // Track unique workout names
        uniqueWorkouts.add(workoutData.name);

        // Track muscle group frequency
        workoutData.muscle_groups.forEach((group) => {
          muscleGroupFrequency[group] = (muscleGroupFrequency[group] || 0) + 1;
        });
      });
    });

    // Calculate most targeted muscle group
    let mostTargetedMuscleGroup = null;
    let maxFrequency = 0;

    for (const group in muscleGroupFrequency) {
      if (muscleGroupFrequency[group] > maxFrequency) {
        maxFrequency = muscleGroupFrequency[group];
        mostTargetedMuscleGroup = group;
      }
    }

    const totalUniqueWorkouts = uniqueWorkouts.size;

    const workoutStats = {
      totalTime, // Total time in minutes
      totalCalories, // Total calories burned
      totalUniqueWorkouts, // Total unique workouts in the plan
      mostTargetedMuscleGroup, // Most frequently targeted muscle group
    };

    // Use this to set state or return the stats as needed
    setWorkoutStats(workoutStats);

    return workoutStats;
  }

  useLayoutEffect(() => {
    calculateWorkoutStats(workoutPlan);
  }, [workoutPlan]);

  return (
    <Card className="select-none">
      <CardHeader className="flex-row justify-between items-center p-4">
        <h3 className="text-xl  font-semibold">{workoutPlan.planName}</h3>

        {/* <Select>
          <SelectTrigger>
            <p
              className={cn(
                "text-sm font-light text-gray-600 p-1 rounded-xl border",
                workoutPlan?.status === "active"
                  ? "border-violet-500 text-violet-500 dark:bg-violet-500 dark:text-white"
                  : "border-gray-500 text-gray-500 dark:bg-gray-500 dark:text-white"
              )}
            >
              {workoutPlan.status}
            </p>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <p>Active</p>
            </SelectItem>
            <SelectItem value="inactive">In-Active</SelectItem>
          </SelectContent>
        </Select> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "text-sm font-light text-gray-600 p-1 rounded-xl border focus-visible:outline-none select-none",
                workoutPlan?.status === "active"
                  ? "border-violet-500 text-violet-500 dark:bg-violet-500 dark:text-white"
                  : "border-gray-500 text-gray-500 dark:bg-gray-500 dark:text-white"
              )}
            >
              {workoutPlan.status}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              value="active"
              onClick={() => {
                updateStatus(workoutPlan.id, "active");
              }}
            >
              <p>Active</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              value="inactive"
              onClick={() => {
                updateStatus(workoutPlan.id, "inactive");
              }}
            >
              <p>In-Active</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Workout Days:
          </p>
          <DaysList days={workoutPlan.days} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600">
            Total Workouts:{" "}
            <span className="text-violet-500 font-bold text-base">
              {workoutStats?.totalUniqueWorkouts}
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-600">
            Total Time:{" "}
            <span className="text-violet-500 font-bold text-base">
              {/* {workoutStats?.totalTime} mins */}
              {workoutStats?.totalTime > 60 ? (
                <>
                  {console.log(workoutStats?.totalTime)}
                  {Math.floor(workoutStats?.totalTime / 60)} hr{" "}
                  {workoutStats?.totalTime % 60} mins
                </>
              ) : (
                `${workoutStats?.totalTime} mins`
              )}{" "}
            </span>
            <span className="text-sm text-violet-500">/ week</span>
          </p>
          <p className="text-sm font-semibold text-gray-600">
            Caloried Burn:{" "}
            <span className="text-violet-500 font-bold text-base">
              ~ {workoutStats?.totalCalories} kCal
            </span>
          </p>
          <p className="text-sm font-semibold text-gray-600">
            Most Targeted Muscle Group:{" "}
            <span className="text-violet-500 font-bold text-base">
              {workoutStats?.mostTargetedMuscleGroup}
            </span>
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Start Date:</span>{" "}
            {moment(workoutPlan.startDate).format("MMM DD, YYYY")}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">End Date:</span>{" "}
            {workoutPlan?.endDate
              ? moment(workoutPlan.endDate).format("MMM DD, YYYY")
              : "-"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <Button
          className="h-10 w-10  p-2 text-primary border-primary bg-transparent hover:bg-primary hover:text-white"
          variant="outline"
        >
          <Pen />
        </Button>
        <Button
          className="h-10 w-10 p-2  text-rose-500 border-rose-500 bg-transparent hover:bg-rose-500 hover:text-white"
          variant="outline"
          disabled={disableDelete}
          onClick={() => {
            setDisableDelete(true);
            onDelete(workoutPlan.id);
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
            "w-8 h-8 flex justify-center items-center border rounded-full text-sm font-light text-primary border-primary",
            daysList[d].selected ? "bg-primary text-white" : "bg-transparent"
          )}
        >
          {daysList[d].symbol}
        </li>
      ))}
    </ul>
  );
};
