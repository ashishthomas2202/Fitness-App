"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";

// Validation schema
const eventSchema = Yup.object().shape({
  name: Yup.string().required("Event name is required."),
  start: Yup.date().required("Start date is required."),
  end: Yup.date().nullable(),
  startTime: Yup.string().nullable(),
  repeat: Yup.string()
    .oneOf(["daily", "weekly", "monthly", null], "Invalid repeat option.")
    .nullable(),
  days: Yup.array().when("repeat", {
    is: "weekly",
    then: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one day for weekly repeat.")
      .nullable(),
  }),
  day: Yup.number().when("repeat", {
    is: "monthly",
    then: Yup.number()
      .min(1, "Day must be at least 1.")
      .max(31, "Day must be at most 31.")
      .required("Specify a day for monthly repeat."),
  }),
  color: Yup.string()
    .nullable()
    .matches(/^#[0-9A-F]{6}$/i, "Invalid color code."),
});

const CreateEventForm = ({ onEventCreated }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      name: "",
      start: "",
      end: "",
      startTime: "",
      repeat: null,
      days: [],
      day: null,
      color: "#8b5cf6",
    },
  });

  const eventRepeat = watch("repeat");

  const submitEvent = async (data) => {
    try {
      const response = await axios.post("/api/events/create", {
        ...data,
        type: "event",
      });
      if (response.data.success) {
        onEventCreated(response.data.data);
        reset();
      }
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitEvent)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <label>Name</label>
            <Input {...field} placeholder="Event Name" />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="start"
        control={control}
        render={({ field }) => (
          <div>
            <label>Start Date</label>
            <Input {...field} type="date" />
            {errors.start && (
              <p className="text-red-500">{errors.start.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="end"
        control={control}
        render={({ field }) => (
          <div>
            <label>End Date</label>
            <Input {...field} type="date" />
            {errors.end && <p className="text-red-500">{errors.end.message}</p>}
          </div>
        )}
      />
      <Controller
        name="repeat"
        control={control}
        render={({ field }) => (
          <div>
            <label>Repeat</label>
            <select {...field} className="w-full border rounded px-3 py-2">
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.repeat && (
              <p className="text-red-500">{errors.repeat.message}</p>
            )}
          </div>
        )}
      />
      {eventRepeat === "weekly" && (
        <Controller
          name="days"
          control={control}
          render={({ field }) => (
            <div>
              <label>Days</label>
              <Input
                {...field}
                placeholder="Comma-separated days (e.g., Monday, Tuesday)"
              />
              {errors.days && (
                <p className="text-red-500">{errors.days.message}</p>
              )}
            </div>
          )}
        />
      )}
      {eventRepeat === "monthly" && (
        <Controller
          name="day"
          control={control}
          render={({ field }) => (
            <div>
              <label>Day</label>
              <Input {...field} type="number" placeholder="Day (1-31)" />
              {errors.day && (
                <p className="text-red-500">{errors.day.message}</p>
              )}
            </div>
          )}
        />
      )}
      <Controller
        name="startTime"
        control={control}
        render={({ field }) => (
          <div>
            <label>Start Time</label>
            <Input {...field} type="time" />
          </div>
        )}
      />
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div>
            <label>Color</label>
            <Input {...field} type="color" />
          </div>
        )}
      />
      <Button type="submit">Create Event</Button>
    </form>
  );
};

export default CreateEventForm;
