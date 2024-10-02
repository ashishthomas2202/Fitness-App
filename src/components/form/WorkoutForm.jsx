"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Validation schema with Yup
const workoutSchema = Yup.object().shape({
  name: Yup.string().required("Workout name is required"),
  type: Yup.array().min(1, "At least one workout type is required").required(),
  category: Yup.array().min(1, "At least one category is required").required(),
  muscle_groups: Yup.array()
    .min(1, "At least one muscle group is required")
    .required(),
  difficulty_level: Yup.string().required("Difficulty level is required"),
  equipment: Yup.array()
    .min(1, "At least one equipment item is required")
    .required(),
  duration_min: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  calories_burned_per_min: Yup.number()
    .required("Calories burned per minute is required")
    .min(1, "Calories burned per minute must be at least 1"),
  sets: Yup.number()
    .required("Number of sets is required")
    .min(1, "Sets must be at least 1"),
  reps: Yup.number()
    .required("Number of reps is required")
    .min(1, "Reps must be at least 1"),
});

const WorkoutForm = ({ mode = "create", defaultValues }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(workoutSchema),
    defaultValues: defaultValues || {
      name: "",
      type: [],
      category: [],
      muscle_groups: [],
      difficulty_level: "",
      equipment: [],
      duration_min: 0,
      calories_burned_per_min: 0,
      sets: 0,
      reps: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onCheckboxChange = (event, name) => {
    const { value, checked } = event.target;
    const currentValues = watch(name) || [];

    if (checked) {
      setValue(name, [...currentValues, value]);
    } else {
      setValue(
        name,
        currentValues.filter((v) => v !== value)
      );
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/api/workouts/create", data);
      if (response.data.success) {
        toast.success("Workout created successfully!");
        router.push("/dashboard/workouts");
        reset();
      } else {
        toast.error("Failed to create workout");
      }
    } catch (error) {
      toast.error("Failed to create workout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-700 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add New Workout</h2>

      {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Workout Name */}
        <div className="mb-4">
          <label className="block mb-2">Workout Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Type (Multi-select) */}
        <div className="mb-4">
          <label className="block mb-2">Workout Type</label>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                value="Strength"
                checked={watch("type").includes("Strength")}
                onChange={(e) => onCheckboxChange(e, "type")}
              />
              Strength
            </label>
            <label>
              <input
                type="checkbox"
                value="Cardio"
                checked={watch("type").includes("Cardio")}
                onChange={(e) => onCheckboxChange(e, "type")}
              />
              Cardio
            </label>
            <label>
              <input
                type="checkbox"
                value="Flexibility"
                checked={watch("type").includes("Flexibility")}
                onChange={(e) => onCheckboxChange(e, "type")}
              />
              Flexibility
            </label>
          </div>
          {errors.type && <p className="text-red-500">{errors.type.message}</p>}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                value="Weight Training"
                checked={watch("category").includes("Weight Training")}
                onChange={(e) => onCheckboxChange(e, "category")}
              />
              Weight Training
            </label>
            <label>
              <input
                type="checkbox"
                value="Calisthenics"
                checked={watch("category").includes("Calisthenics")}
                onChange={(e) => onCheckboxChange(e, "category")}
              />
              Calisthenics
            </label>
            <label>
              <input
                type="checkbox"
                value="Yoga"
                checked={watch("category").includes("Yoga")}
                onChange={(e) => onCheckboxChange(e, "category")}
              />
              Yoga
            </label>
            <label>
              <input
                type="checkbox"
                value="HIIT"
                checked={watch("category").includes("HIIT")}
                onChange={(e) => onCheckboxChange(e, "category")}
              />
              HIIT
            </label>
          </div>
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* Muscle Groups */}
        <div className="mb-4">
          <label className="block mb-2">Muscle Groups</label>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                value="Chest"
                checked={watch("muscle_groups").includes("Chest")}
                onChange={(e) => onCheckboxChange(e, "muscle_groups")}
              />
              Chest
            </label>
            <label>
              <input
                type="checkbox"
                value="Legs"
                checked={watch("muscle_groups").includes("Legs")}
                onChange={(e) => onCheckboxChange(e, "muscle_groups")}
              />
              Legs
            </label>
            <label>
              <input
                type="checkbox"
                value="Arms"
                checked={watch("muscle_groups").includes("Arms")}
                onChange={(e) => onCheckboxChange(e, "muscle_groups")}
              />
              Arms
            </label>
            <label>
              <input
                type="checkbox"
                value="Shoulders"
                checked={watch("muscle_groups").includes("Shoulders")}
                onChange={(e) => onCheckboxChange(e, "muscle_groups")}
              />
              Shoulders
            </label>
            <label>
              <input
                type="checkbox"
                value="Abs"
                checked={watch("muscle_groups").includes("Abs")}
                onChange={(e) => onCheckboxChange(e, "muscle_groups")}
              />
              Abs
            </label>
            <label>
              <input
                type="checkbox"
                value="Full Body"
                checked={watch("muscle_groups").includes("Full Body")}
                onChange={(e) => onCheckboxChange(e, "muscle_groups")}
              />
              Full Body
            </label>
          </div>
          {errors.muscle_groups && (
            <p className="text-red-500">{errors.muscle_groups.message}</p>
          )}
        </div>

        {/* Difficulty Level */}
        <div className="mb-4">
          <label className="block mb-2">Difficulty Level</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
            {...register("difficulty_level")}
          >
            <option value="">Select Difficulty Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {errors.difficulty_level && (
            <p className="text-red-500">{errors.difficulty_level.message}</p>
          )}
        </div>

        {/* Equipment */}
        <div className="mb-4">
          <label className="block mb-2">Equipment</label>
          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                value="None"
                checked={watch("equipment").includes("None")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              None
            </label>
            <label>
              <input
                type="checkbox"
                value="Dumbbells"
                checked={watch("equipment").includes("Dumbbells")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Dumbbells
            </label>
            <label>
              <input
                type="checkbox"
                value="Barbell"
                checked={watch("equipment").includes("Barbell")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Barbell
            </label>
            <label>
              <input
                type="checkbox"
                value="Treadmill"
                checked={watch("equipment").includes("Treadmill")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Treadmill
            </label>
            <label>
              <input
                type="checkbox"
                value="Resistance Bands"
                checked={watch("equipment").includes("Resistance Bands")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Resistance Bands
            </label>
            <label>
              <input
                type="checkbox"
                value="Jump Rope"
                checked={watch("equipment").includes("Jump Rope")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Jump Rope
            </label>
            <label>
              <input
                type="checkbox"
                value="Bench"
                checked={watch("equipment").includes("Bench")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Bench
            </label>
            <label>
              <input
                type="checkbox"
                value="Yoga Mat"
                checked={watch("equipment").includes("Yoga Mat")}
                onChange={(e) => onCheckboxChange(e, "equipment")}
              />
              Yoga Mat
            </label>
          </div>
          {errors.equipment && (
            <p className="text-red-500">{errors.equipment.message}</p>
          )}
        </div>
        
        {/* Duration */}
        <div className="mb-4">
          <label className="block mb-2">Duration (in minutes)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
            {...register("duration_min")}
          />
          {errors.duration_min && (
            <p className="text-red-500">{errors.duration_min.message}</p>
          )}
        </div>

        {/* Calories Burned Per Minute */}
        <div className="mb-4">
          <label className="block mb-2">Calories Burned Per Minute</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
            {...register("calories_burned_per_min")}
          />
          {errors.calories_burned_per_min && (
            <p className="text-red-500">{errors.calories_burned_per_min.message}</p>
          )}
        </div>

        {/* Sets */}
        <div className="mb-4">
          <label className="block mb-2">Sets</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
            {...register("sets")}
          />
          {errors.sets && <p className="text-red-500">{errors.sets.message}</p>}
        </div>

        {/* Reps */}
        <div className="mb-4">
          <label className="block mb-2">Reps</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
            {...register("reps")}
          />
          {errors.reps && <p className="text-red-500">{errors.reps.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Workout"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;




// "use client";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// // Validation schema with Yup
// const workoutSchema = Yup.object().shape({
//   name: Yup.string().required("Workout name is required"),
//   type: Yup.array().min(1, "At least one workout type is required").required(),
//   category: Yup.array().min(1, "At least one category is required").required(),
//   muscle_groups: Yup.array()
//     .min(1, "At least one muscle group is required")
//     .required(),
//   difficulty_level: Yup.string().required("Difficulty level is required"),
//   equipment: Yup.array()
//     .min(1, "At least one equipment item is required")
//     .required(),
//   duration_min: Yup.number()
//     .required("Duration is required")
//     .min(1, "Duration must be at least 1 minute"),
//   //.transform((value, originalValue) => originalValue === "" ? null : value)
//   //.positive("Duration must be a positive number")
//   //.integer("Duration must be an integer")
//   calories_burned_per_min: Yup.number()
//     .required("Calories burned per minute is required")
//     .min(1, "Calories burned per minute must be at least 1"),
//   //.transform((value, originalValue) => originalValue === "" ? null : value)
//   //.positive("Calories burned must be a positive number")
//   //.integer("Calories burned must be an integer")
//   sets: Yup.number()
//     .required("Number of sets is required")
//     .min(1, "Sets must be at least 1"),
//   //.transform((value, originalValue) => originalValue === "" ? null : value)
//   //.positive("Number of sets must be a positive number")
//   //.integer("Number of sets must be an integer")
//   reps: Yup.number()
//     .required("Number of reps is required")
//     .min(1, "Reps must be at least 1"),
//   //.transform((value, originalValue) => originalValue === "" ? null : value)
//   //.positive("Number of reps must be a positive number")
//   //.integer("Number of reps must be an integer")
// });

// const WorkoutForm = ({
//   mode = "create",
//   defaultValues = {
//     name: "",
//     type: [],
//     category: [],
//     muscle_groups: [],
//     difficulty_level: "",
//     equipment: [],
//     duration_min: 0,
//     calories_burned_per_min: 0,
//     sets: 0,
//     reps: 0,
//   },
// }) => {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//     getValues,
//     reset,
//   } = useForm({
//     resolver: yupResolver(workoutSchema),
//     defaultValues: defaultValues,
//   });

//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const onCheckboxChange = (event, name) => {
//     const { value, checked } = event.target;
//     const currentValues = getValues(name);

//     if (checked) {
//       setValue(name, [...currentValues, value]);
//     } else {
//       setValue(
//         name,
//         currentValues.filter((v) => v !== value)
//       );
//     }
//   };

//   const onSubmit = async (data) => {
//     console.log("data", data); // Log form data
//     setLoading(true);
//     setServerError("");
//     setSuccessMessage("");
//     if (mode == "create") {
//       // try {
//       // const response = await fetch("/api/workouts/create", {
//       //   method: "POST",
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //   },
//       //   body: JSON.stringify(data),
//       // });

//       const response = await axios
//         .post("/api/workouts/create", data)
//         .then((response) => {
//           if (response?.data?.success) {
//             toast.success("Workout created successfully!");
//             router.push("/dashboard/workouts");
//             return response?.data?.data;
//           }
//           toast.error("Failed to create workout");
//           return null;
//         })
//         .catch((error) => {
//           // console.error("Error creating workout:", error);
//           toast.error("Failed to create workout");
//           return null;
//         });

//       //   const result = await response.json();
//       //   console.log(result); // Log the server response

//       //   if (response.ok) {
//       //     setSuccessMessage("Workout created successfully!");
//       //     reset(); // Clear form
//       //   } else {
//       //     setServerError(result.message || "Failed to create workout");
//       //   }
//       // } catch (error) {
//       //   console.error(error); // Log the error
//       //   setServerError("An error occurred, please try again.");
//       // } finally {
//       //   setLoading(false);
//       // }

//       setLoading(false);
//     }
//     //else {}
//   };

//   useEffect(() => {
//     if (defaultValues.type) {
//       setValue("type", defaultValues.type);
//     }
//     if (defaultValues.category) {
//       setValue("category", defaultValues.category);
//     }
//     if (defaultValues.category) {
//       setValue("muscle_groups", defaultValues.muscle_groups);
//     }
//     if (defaultValues.equipment) {
//       setValue("equipment", defaultValues.equipment);
//     }
//   }, []);

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-700 shadow-md rounded-md">
//       <h2 className="text-2xl font-bold mb-4">Add New Workout</h2>

//       {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
//       {successMessage && (
//         <p className="text-green-500 mb-4">{successMessage}</p>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="">
//         {/* Workout Name */}
//         <div className="mb-4">
//           <label className="block mb-2">Workout Name</label>
//           <input
//             type="text"
//             className="w-full p-2 border light:border-gray-300 rounded-md  dark:bg-slate-500"
//             {...register("name")}
//           />
//           {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//         </div>

//         {/* Type (Multi-select) */}
//         <div className="mb-4">
//           <label className="block mb-2">Workout Type</label>
//           <div className="flex gap-4">
//             <label>
//               <input
//                 type="checkbox"
//                 value="Strength"
//                 checked={watch("type").includes("Strength")}
//                 onChange={(e) => onCheckboxChange(e, "type")}
//               />
//               Strength
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 value="Cardio"
//                 checked={watch("type").includes("Cardio")}
//                 onChange={(e) => onCheckboxChange(e, "type")}
//               />
//               Cardio
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 value="Flexibility"
//                 checked={watch("type").includes("Flexibility")}
//                 onChange={(e) => onCheckboxChange(e, "type")}
//               />
//               Flexibility
//             </label>
//           </div>
//           {/* <div className="flex gap-4">
//                     <label>
//                         <input type="checkbox" value="Strength" onChange={(e) => onCheckboxChange(e, "type")} />
//                         Strength
//                     </label>
//                     <label>
//                         <input type="checkbox" value="Cardio" onChange={(e) => onCheckboxChange(e, "type")} />
//                         Cardio
//                     </label>
//                     <label>
//                         <input type="checkbox" value="Flexibility" onChange={(e) => onCheckboxChange(e, "type")} />
//                         Flexibility
//                     </label>
//                 </div> */}
//           {errors.type && <p className="text-red-500">{errors.type.message}</p>}
//         </div>

//         {/* Category */}
//         <div className="mb-4">
//           <label className="block mb-2">Category</label>
//           <div className="flex gap-4">
//             <label>
//               <input
//                 type="checkbox"
//                 value="Weight Training"
//                 checked={watch("category").includes("Weight Training")}
//                 onChange={(e) => onCheckboxChange(e, "category")}
//               />
//               Weight Training
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 value="Calisthenics"
//                 checked={watch("category").includes("Calisthenics")}
//                 onChange={(e) => onCheckboxChange(e, "category")}
//               />
//               Calisthenics
//             </label>
//           </div>
//           {errors.category && (
//             <p className="text-red-500">{errors.category.message}</p>
//           )}
//         </div>

//         {/* Muscle Groups */}
//         <div className="mb-4">
//           <label className="block mb-2">Muscle Groups</label>
//           <div className="flex gap-4">
//             <label>
//               <input
//                 type="checkbox"
//                 value="Chest"
//                 checked={watch("muscle_groups").includes("Chest")}
//                 onChange={(e) => onCheckboxChange(e, "muscle_groups")}
//               />
//               Chest
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 value="Legs"
//                 checked={watch("muscle_groups").includes("Legs")}
//                 onChange={(e) => onCheckboxChange(e, "muscle_groups")}
//               />
//               Legs
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 value="Arms"
//                 checked={watch("muscle_groups").includes("Arms")}
//                 onChange={(e) => onCheckboxChange(e, "muscle_groups")}
//               />
//               Arms
//             </label>
//           </div>
//           {errors.muscle_groups && (
//             <p className="text-red-500">{errors.muscle_groups.message}</p>
//           )}
//         </div>

//         {/* Difficulty Level */}
//         <div className="mb-4">
//           <label className="block mb-2">Difficulty Level</label>
//           <select
//             className="w-full p-2 border light:border-gray-300 rounded-md dark:bg-slate-500"
//             {...register("difficulty_level")}
//           >
//             <option value="">Select Difficulty Level</option>
//             <option value="Beginner">Beginner</option>
//             <option value="Intermediate">Intermediate</option>
//             <option value="Advanced">Advanced</option>
//           </select>
//           {errors.difficulty_level && (
//             <p className="text-red-500">{errors.difficulty_level.message}</p>
//           )}
//         </div>

//         {/* Equipment */}
//         <div className="mb-4">
//           <label className="block mb-2">Equipment</label>
//           <div className="flex gap-4">
//             <label>
//               <input
//                 type="checkbox"
//                 value="Dumbbells"
//                 checked={watch("equipment").includes("Dumbbells")}
//                 onChange={(e) => onCheckboxChange(e, "equipment")}
//               />
//               Dumbbells
//             </label>
//             <label>
//               <input
//                 type="checkbox"
//                 value="Barbell"
//                 checked={watch("equipment").includes("Barbell")}
//                 onChange={(e) => onCheckboxChange(e, "equipment")}
//               />
//               Barbell
//             </label>
//           </div>
//           {errors.equipment && (
//             <p className="text-red-500">{errors.equipment.message}</p>
//           )}
//         </div>

//         {/* Duration */}
//         <div className="mb-4">
//           <label className="block mb-2">Duration (Minutes)</label>
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
//             {...register("duration_min")}
//           />
//           {errors.duration_min && (
//             <p className="text-red-500">{errors.duration_min.message}</p>
//           )}
//         </div>

//         {/* Calories Burned */}
//         <div className="mb-4">
//           <label className="block mb-2">Calories Burned Per Minute</label>
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
//             {...register("calories_burned_per_min")}
//           />
//           {errors.calories_burned_per_min && (
//             <p className="text-red-500">
//               {errors.calories_burned_per_min.message}
//             </p>
//           )}
//         </div>

//         {/* Sets */}
//         <div className="mb-4">
//           <label className="block mb-2">Sets</label>
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
//             {...register("sets")}
//           />
//           {errors.sets && <p className="text-red-500">{errors.sets.message}</p>}
//         </div>

//         {/* Reps */}
//         <div className="mb-4">
//           <label className="block mb-2">Reps</label>
//           <input
//             type="number"
//             className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-500"
//             {...register("reps")}
//           />
//           {errors.reps && <p className="text-red-500">{errors.reps.message}</p>}
//         </div>

//         {/* Submit Button */}
//         {/* <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Add Workout"}
//         </button>
//          */}
//         <Button
//           type="submit"
//           variant="primary"
//           // className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Add Workout"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default WorkoutForm;
