// src/components/ui/EditWorkoutForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Workout name is required"),
    type: Yup.array().min(1, "At least one workout type is required").required(),
    category: Yup.array().min(1, "At least one category is required").required(),
    muscle_groups: Yup.array().min(1, "At least one muscle group is required").required(),
    difficulty_level: Yup.string().required("Difficulty level is required"),
    equipment: Yup.array().min(1, "At least one equipment item is required").required(),
    duration_min: Yup.number()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .positive("Duration must be a positive number")
      .integer("Duration must be an integer")
      .required("Duration is required"),
    calories_burned_per_min: Yup.number()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .positive("Calories burned must be a positive number")
      .integer("Calories burned must be an integer")
      .required("Calories burned per minute is required"),
    Sets: Yup.number()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .positive("Number of sets must be a positive number")
      .integer("Number of sets must be an integer")
      .required("Number of sets is required"),
    Reps: Yup.number()
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .positive("Number of reps must be a positive number")
      .integer("Number of reps must be an integer")
      .required("Number of reps is required"),
  });

const EditWorkoutForm = ({ workoutId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    // Fetch the existing workout data and populate the form
    const fetchWorkoutData = async () => {
      try {
        const response = await axios.get(`/api/workouts/${workoutId}`);
        const workoutData = response.data.data;
        reset(workoutData); // Pre-populate form with fetched workout data
      } catch (error) {
        console.error("Failed to fetch workout data:", error);
      }
    };
    fetchWorkoutData();
  }, [workoutId, reset]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/workouts/update/${workoutId}`, data);
      alert("Workout updated successfully!");
    } catch (error) {
      console.error("Failed to update workout:", error);
      alert("Failed to update workout. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Workout Name */}
      <div>
        <label className="block text-gray-700">Workout Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Type (checkboxes for multiple types) */}
      <div>
        <label className="block text-gray-700">Type</label>
        <div className="space-x-4">
          <label>
            <input
              type="checkbox"
              value="Strength"
              {...register("type")}
              className="mr-2"
            />
            Strength
          </label>
          <label>
            <input
              type="checkbox"
              value="Cardio"
              {...register("type")}
              className="mr-2"
            />
            Cardio
          </label>
          <label>
            <input
              type="checkbox"
              value="Flexibility"
              {...register("type")}
              className="mr-2"
            />
            Flexibility
          </label>
        </div>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>

      {/* Category (dropdown) */}
      <div>
        <label className="block text-gray-700">Category</label>
        <select
          {...register("category")}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Weight Training">Weight Training</option>
          <option value="Calisthenics">Calisthenics</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Muscle Groups */}
      <div>
        <label className="block text-gray-700">Muscle Groups</label>
        <div className="space-x-4">
          <label>
            <input
              type="checkbox"
              value="Chest"
              {...register("muscle_groups")}
              className="mr-2"
            />
            Chest
          </label>
          <label>
            <input
              type="checkbox"
              value="Legs"
              {...register("muscle_groups")}
              className="mr-2"
            />
            Legs
          </label>
          <label>
            <input
              type="checkbox"
              value="Arms"
              {...register("muscle_groups")}
              className="mr-2"
            />
            Arms
          </label>
        </div>
        {errors.muscle_groups && (
          <p className="text-red-500 text-sm">{errors.muscle_groups.message}</p>
        )}
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-gray-700">Difficulty Level</label>
        <select
          {...register("difficulty_level")}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        {errors.difficulty_level && (
          <p className="text-red-500 text-sm">
            {errors.difficulty_level.message}
          </p>
        )}
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-gray-700">Equipment</label>
        <div className="space-x-4">
          <label>
            <input
              type="checkbox"
              value="Dumbbells"
              {...register("equipment")}
              className="mr-2"
            />
            Dumbbells
          </label>
          <label>
            <input
              type="checkbox"
              value="Barbell"
              {...register("equipment")}
              className="mr-2"
            />
            Barbell
          </label>
        </div>
        {errors.equipment && (
          <p className="text-red-500 text-sm">{errors.equipment.message}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-gray-700">Duration (Minutes)</label>
        <input
          type="number"
          {...register("duration_min")}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.duration_min && (
          <p className="text-red-500 text-sm">{errors.duration_min.message}</p>
        )}
      </div>

      {/* Calories Burned Per Minute */}
      <div>
        <label className="block text-gray-700">Calories Burned Per Minute</label>
        <input
          type="number"
          {...register("calories_burned_per_min")}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.calories_burned_per_min && (
          <p className="text-red-500 text-sm">
            {errors.calories_burned_per_min.message}
          </p>
        )}
      </div>

      {/* Submit and Cancel buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={() => window.history.back()} // Cancel action
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditWorkoutForm;
