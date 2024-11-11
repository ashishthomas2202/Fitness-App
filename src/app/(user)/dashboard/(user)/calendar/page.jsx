"use client";
import { Page } from "@/components/dashboard/Page";
import { Calendar } from "@/components/ui/Calendar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";

export default function CalendarPage() {
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState({});
  const [workoutItems, setWorkoutItems] = useState([]);

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

  useEffect(() => {
    fetchActiveWorkoutPlan();
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

  return (
    <Page title="Calendar">
      <Calendar items={[...workoutItems]} />
    </Page>
  );
}

const transformWorkoutsToEvents = ({ workoutData, color, start, end }) => {
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
