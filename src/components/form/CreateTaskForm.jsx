"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";

// Validation schema
const taskSchema = Yup.object().shape({
  name: Yup.string().required("Task name is required."),
  date: Yup.date().required("Date is required."),
  time: Yup.string().required("Time is required."),
  color: Yup.string()
    .nullable()
    .matches(/^#[0-9A-F]{6}$/i, "Invalid color code."),
});

const CreateTaskForm = ({ onTaskCreated }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      name: "",
      date: "",
      time: "",
      color: "#8b5cf6",
    },
  });

  const submitTask = async (data) => {
    try {
      const response = await axios.post("/api/events/create", {
        ...data,
        type: "task",
      });
      if (response.data.success) {
        onTaskCreated(response.data.data);
        reset();
        toast.success("Task created successfully.");
      }
    } catch (error) {
      toast.error("Error creating task.");
      console.error("Error creating task:", error.response?.data || error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitTask)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <label>Name</label>
            <Input {...field} placeholder="Task Name" />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <div>
            <label>Date</label>
            <Input {...field} type="date" />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <div>
            <label>Time</label>
            <Input {...field} type="time" />
            {errors.time && (
              <p className="text-red-500">{errors.time.message}</p>
            )}
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
      <Button type="submit">Create Task</Button>
    </form>
  );
};

export default CreateTaskForm;
