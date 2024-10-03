//import AddWorkoutForm from '../../../../../components/ui/AddWorkoutForm';
import WorkoutForm from "@/components/form/WorkoutForm";

const AddWorkoutPage = () => {
  return (
    <div className="container mx-auto p-4 dark:bg-slate-800 rounded-xl my-10">
      <h1 className="text-2xl font-bold mb-4">Add a New Workout</h1>
      {/* <AddWorkoutForm /> */}
      <WorkoutForm />
    </div>
  );
};

export default AddWorkoutPage;
