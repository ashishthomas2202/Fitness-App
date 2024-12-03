"use client";
import { Page } from "@/components/dashboard/Page";
import { Calendar } from "@/components/ui/Calendar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";

export default function CalendarPage() {
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState({});
  const [workoutItems, setWorkoutItems] = useState([]);
  const [activeMealPlan, setActiveMealPlan] = useState({});
  const [mealItems, setMealItems] = useState([]);
  const fetchActiveWorkoutPlan = async () => {
    return await axios
      .get("/api/workout-plan/active")
      .then((response) => {
        if (response?.data?.success) {
          setActiveWorkoutPlan(response?.data?.data || null);
          // console.log("Active workout plan:", response?.data?.data);

          return response?.data?.data || null;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  const fetchActiveMealPlan = async () => {
    return await axios
      .get("/api/mealplan/active")
      .then((response) => {
        if (response?.data?.success) {
          setActiveMealPlan(response?.data?.data || null);
          console.log("Active meal plan:", response?.data?.data);
          return response?.data?.data || null;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  useEffect(() => {
    fetchActiveWorkoutPlan();
    fetchActiveMealPlan();
  }, []);

  useEffect(() => {
    setWorkoutItems(
      transformWorkoutsToEvents({
        workoutData: activeWorkoutPlan?.days || [],
        color: activeWorkoutPlan?.color,
        start: activeWorkoutPlan?.startDate,
        end: activeWorkoutPlan?.endDate,
      })
    );
  }, [activeWorkoutPlan]);

  useEffect(() => {
    setMealItems(
      transformMealsToEvents({
        mealsData: activeMealPlan?.days || [],
        color: activeMealPlan?.color,
        start: activeMealPlan?.startDate,
        end: activeMealPlan?.endDate,
      })
    );
  }, [activeMealPlan]);

  return (
    <Page title="Calendar">
      <Calendar
      //  items={[...workoutItems, ...mealItems]}
      />
    </Page>
  );
}

const transformWorkoutsToEvents = ({
  workoutData,
  color = "#000000",
  start,
  end,
}) => {
  const events = [];

  workoutData.forEach((dayEntry) => {
    const { day, workouts } = dayEntry;

    workouts.forEach((workout) => {
      const workoutDetails = workout.workoutId;

      // Create an event object for each workout
      const event = {
        repeat: "weekly",
        days: [day], // Weekly event on the specified day
        name: workoutDetails.name,
        color: color,
        durationMin: workoutDetails.duration_min, // Optional additional detail
      };

      if (start) {
        event.start = moment(start).format("YYYY-MM-DD");
      }
      if (end) {
        event.end = moment(end).format("YYYY-MM-DD");
      }

      // Add optional time or other data if needed (e.g., startTime, endTime)
      if (workout.durationMin) {
        event.duration = `${workoutDetails.duration_min} mins`;
      }

      events.push(event);
    });
  });

  return events;
};

const transformMealsToEvents = ({
  mealsData,
  color = "#000000",
  start,
  end,
}) => {
  const events = [];

  mealsData.forEach((dayEntry) => {
    const { day, meals } = dayEntry;

    meals.forEach((meal) => {
      const { name, calories, macros, mealType } = meal;
      const event = {
        repeat: "weekly",
        days: [day],
        name: `${name}`, // e.g., "Lunch: Breakfast Burrito"
        color: color,
      };

      if (start) {
        event.start = moment(start).format("YYYY-MM-DD");
      }
      if (end) {
        event.end = moment(end).format("YYYY-MM-DD");
      }

      events.push(event);
    });
  });

  return events;
};
