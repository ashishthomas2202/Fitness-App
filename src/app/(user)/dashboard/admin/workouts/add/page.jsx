"use client";
import WorkoutForm from "@/components/form/WorkoutForm";
import { useRouter } from "next/navigation";

const AddWorkoutPage = () => {
  const router = useRouter();
  const handleCreated = (data) => {
    router.push("/dashboard/admin/workouts");
  };

  return (
    <div className="container mx-auto p-4 dark:bg-neutral-800 rounded-xl my-10">
      <h1 className="text-2xl font-bold mb-4">Add a New Workout</h1>
      {/* <AddWorkoutForm /> */}
      <WorkoutForm onCreated={handleCreated} />
    </div>
  );
};

export default AddWorkoutPage;
