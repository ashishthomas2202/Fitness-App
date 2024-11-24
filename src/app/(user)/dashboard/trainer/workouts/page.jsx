// "use client";

// import React, { useEffect, useLayoutEffect, useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/Button";
// import Link from "next/link";
// import { toast } from "react-toastify";
// import { PencilIcon, PencilLineIcon, Trash2 } from "lucide-react";
// import { Pencil2Icon } from "@radix-ui/react-icons";
// import { useRouter } from "next/navigation";

// export default function WorkoutsPage() {
//   const router = useRouter();
//   const [workouts, setWorkouts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch workouts from the server
//   const fetchWorkouts = async () => {
//     // try {
//     setLoading(true);
//     await axios
//       .get("/api/workouts")
//       .then((response) => {
//         if (response?.data?.success) {
//           setWorkouts(response.data.data);
//           return response.data.data;
//         }
//         return null;
//       })
//       .catch((error) => {
//         return null;
//       });
//     setLoading(false);
//   };

//   // Delete a workout
//   const deleteWorkout = async (id) => {
//     try {
//       await axios.delete(`/api/workouts/delete/${id}`);
//       toast.success("Workout deleted successfully.");
//       //   setWorkouts(workouts.filter((workout) => workout._id !== id));
//       fetchWorkouts();
//     } catch (error) {
//       toast.error("Failed to delete workout.");
//     }
//   };

//   useLayoutEffect(() => {
//     fetchWorkouts();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">Workouts</h1>

//       {/* Add Workout Card */}
//       <div className="mb-6 max-w-sm mx-auto">
//         <Button
//           variant="primary"
//           className="w-full py-6 "
//           asChild
//           //   className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
//         >
//           <Link href="/dashboard/trainer/workouts/add">Add New Workout</Link>
//         </Button>
//       </div>

//       {/* Workout Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {workouts.length === 0 ? (
//           <p className="col-span-3 text-center text-gray-600">
//             No workouts available.
//           </p>
//         ) : (
//           workouts.map((workout) => (
//             <WorkoutCard
//               key={workout.id}
//               workout={workout}
//               onUpdate={() =>
//                 router.push(`/dashboard/trainer/workouts/update/${workout.id}`)
//               }
//               onDelete={() => deleteWorkout(workout.id)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// // Card component for workout
// const WorkoutCard = ({ workout, onUpdate = () => {}, onDelete = () => {} }) => {
//   return (
//     <div className="bg-neutral-50 dark:bg-neutral-800 shadow-md rounded-lg p-6 flex flex-col justify-between">
//       <h3 className="text-2xl font-semibold mb-2">{workout.name}</h3>
//       <p className="text-gray-600 dark:text-white mb-4">
//         Difficulty: {workout.difficulty_level}
//       </p>
//       <p className="text-gray-600 dark:text-white mb-4">
//         Duration: {workout.duration_min} mins
//       </p>
//       <p className="text-gray-600 dark:text-white mb-4">
//         Sets: {workout.sets} | Reps: {workout.reps}
//       </p>
//       {/* New Description Paragraph */}
//       <p className="text-gray-600 dark:text-white mb-4">
//         Description: {workout.description}
//       </p>
//       <div className="flex justify-between">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onUpdate}
//           className="w-10 h-10 p-0 flex items-center justify-center dark:bg-neutral-950 dark:hover:bg-neutral-900"
//         >
//           <PencilIcon size={20} />
//         </Button>
//         <Button
//           type="button"
//           variant="destructive"
//           onClick={() => onDelete(workout.id)}
//           className="w-10 h-10 p-0 flex items-center justify-center"
//         >
//           <Trash2 size={20} />
//         </Button>
//       </div>
//     </div>
//   );
// };
"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "react-toastify";
import { PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState("");

  // Fetch workouts from the server
  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/workouts");
      if (response?.data?.success) {
        setWorkouts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a workout
  const deleteWorkout = async (id) => {
    try {
      await axios.delete(`/api/workouts/delete/${id}`);
      toast.success("Workout deleted successfully.");
      fetchWorkouts();
    } catch (error) {
      toast.error("Failed to delete workout.");
    }
  };

  // Publish a workout
  const publishWorkout = async () => {
    if (!selectedWorkoutID) {
      toast.error("Please select a workout to publish.");
      return;
    }

    setPublishLoading(true);
    try {
      const response = await axios.post(`/api/workouts/${selectedWorkoutID}/publish`);
      if (response?.data?.success) {
        toast.success("Workout published successfully!");
      } else {
        toast.error("Failed to publish workout. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while publishing the workout.");
    } finally {
      setPublishLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchWorkouts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Workouts</h1>

      {/* Add Workout Card */}
      <div className="mb-6 max-w-sm mx-auto">
        <Button variant="primary" className="w-full py-6">
          <Link href="/dashboard/trainer/workouts/add">Add New Workout</Link>
        </Button>
      </div>

      {/* Publish Workout Section */}
      <div className="mb-6 max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4">Publish a Workout</h2>
        <div className="space-y-4">
          <select
            value={selectedWorkoutID}
            onChange={(e) => setSelectedWorkoutID(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-purple-400"
          >
            <option value="" disabled>
              Select a workout to publish
            </option>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.name} (ID: {workout.id})
              </option>
            ))}
          </select>
          <Button
            onClick={publishWorkout}
            disabled={publishLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-lg"
          >
            {publishLoading ? "Publishing..." : "Publish Workout"}
          </Button>
        </div>
      </div>

      {/* Workout Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.length === 0 ? (
          <p className="col-span-3 text-center text-gray-600">
            No workouts available.
          </p>
        ) : (
          workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onUpdate={() =>
                router.push(`/dashboard/trainer/workouts/update/${workout.id}`)
              }
              onDelete={() => deleteWorkout(workout.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Card component for workout
const WorkoutCard = ({ workout, onUpdate = () => {}, onDelete = () => {} }) => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 shadow-md rounded-lg p-6 flex flex-col justify-between">
      <h3 className="text-2xl font-semibold mb-2">{workout.name}</h3>
      <p className="text-gray-600 dark:text-white mb-4">
        Difficulty: {workout.difficulty_level}
      </p>
      <p className="text-gray-600 dark:text-white mb-4">
        Duration: {workout.duration_min} mins
      </p>
      <p className="text-gray-600 dark:text-white mb-4">
        Sets: {workout.sets} | Reps: {workout.reps}
      </p>
      <p className="text-gray-600 dark:text-white mb-4">
        Description: {workout.description}
      </p>
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onUpdate}
          className="w-10 h-10 p-0 flex items-center justify-center dark:bg-neutral-950 dark:hover:bg-neutral-900"
        >
          <PencilIcon size={20} />
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onDelete(workout.id)}
          className="w-10 h-10 p-0 flex items-center justify-center"
        >
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
};
