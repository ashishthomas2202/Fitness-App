import MealForm from "@/components/form/MealForm";

const AddMealPage = () => {
  return (
    <div className="container mx-auto p-4 dark:bg-neutral-900 rounded-xl my-10">
      <h1 className="text-2xl font-bold mb-4">Add a New Meal</h1>
      <MealForm />
    </div>
  );
};

export default AddMealPage;
