//import AddWorkoutForm from '../../../../../components/ui/AddWorkoutForm';
import WorkoutForm from '@/components/ui/WorkoutForm';

const AddWorkoutPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Workout</h1>
      {/* <AddWorkoutForm /> */}
      <WorkoutForm />
    </div>
  );
};

export default AddWorkoutPage;
