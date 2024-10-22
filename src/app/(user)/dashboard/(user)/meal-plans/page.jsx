"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import MealCalendar from "@/components/MealCalendar";
import { X } from "lucide-react";

export default function MealPlans() {
  const { data: session } = useSession();
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [mealType, setMealType] = useState("Dinner");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track the selected date

  // Function to navigate to the previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Function to navigate to the next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Fetch all meals 
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("/api/meals");
        if (response.data.success) {
          setMeals(response.data.data);
        } else {
          setError("Error fetching meals.");
        }
      } catch (error) {
        setError("Error fetching meals.");
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  // Fetch the user's meal plan for the selected date
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await axios.get("/api/mealplan", {
          params: {
            date: selectedDate.toISOString(),
          },
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });

        if (response.data.success) {
          setMealPlan(response.data.data[0]?.meals || []);
        } else {
          setError("Error fetching meal plan.");
        }
      } catch (error) {
        setError("Error fetching meal plan.");
        console.error("Error fetching meal plan:", error);
      }
    };

    if (session) {
      fetchMealPlan();
    }
  }, [session, selectedDate]);

  // Add a selected meal to the user's meal plan
  const addToMealPlan = async () => {
    if (selectedMeal) {
      try {
        const newMealEntry = {
          meal: {
            name: selectedMeal.name,
            category: selectedMeal.category,
            diet: selectedMeal.diet,
            calories: selectedMeal.calories,
            macros: selectedMeal.macros,
            ingredients: selectedMeal.ingredients,
            preparation_time_min: selectedMeal.preparation_time_min,
          },
          mealType,
          date: selectedDate,
        };

        setMealPlan((prevMealPlan) => [...prevMealPlan, newMealEntry]);

        const response = await axios.post(
          "/api/mealplan/add",
          {
            mealId: selectedMeal.id,
            date: selectedDate,
            mealType,
            userId: session?.user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        );

        if (!response.data.success) {
          setError("Error adding meal to the plan.");
          setMealPlan((prevMealPlan) => prevMealPlan.filter((meal) => meal !== newMealEntry));
        }

        setSelectedMeal(null);
        setSearchTerm("");
        setFilteredMeals([]);
      } catch (error) {
        setError("Error adding meal to the plan.");
        console.error("Error adding meal to the plan:", error);
        setMealPlan((prevMealPlan) => prevMealPlan.filter((meal) => meal !== newMealEntry));
      }
    }
  };

  const removeMealFromPlan = async (mealId) => {
    if (!mealId) return;

    try {
      setMealPlan((prevMealPlan) => prevMealPlan.filter((meal) => meal.meal.id !== mealId));

      const response = await axios.post(
        "/api/mealplan/delete",
        {
          mealId,
          date: selectedDate,
          userId: session?.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      if (!response.data.success) {
        setError("Error removing meal from the plan.");
      }
    } catch (error) {
      setError("Error removing meal from the plan.");
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = meals.filter((meal) => {
      const matchesSearch = meal.name.toLowerCase().includes(term.toLowerCase());
      const matchesCategory = categoryFilter === "All" || meal.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    setFilteredMeals(filtered);
  };

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    setSearchTerm(meal.name);
    setFilteredMeals([]);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setFilteredMeals([]);
    }, 200);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Plan Your Meals</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Day Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousDay} className="px-4 py-2 bg-gray-500 text-white rounded">
          Previous Day
        </button>
        <div>
          <span className="font-semibold">Meals for {selectedDate.toLocaleDateString()}</span>
        </div>
        <button onClick={goToNextDay} className="px-4 py-2 bg-gray-500 text-white rounded">
          Next Day
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-grow mb-4 md:mb-0 relative">
            <label htmlFor="searchMeal" className="block mb-2">
              Search for a Meal
            </label>
            <input
              id="searchMeal"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              placeholder="Type meal name..."
              className="p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded w-full"
            />

            {/* Display filtered meal results below the search box */}
            {filteredMeals.length > 0 && (
              <ul className="absolute bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 rounded-lg mt-1 shadow-lg">
                {filteredMeals.map((meal) => (
                  <li
                    key={meal.id}
                    className="p-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 px-4 py-2"
                    onMouseDown={() => handleMealSelect(meal)}
                  >
                    {meal.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-grow">
            <label htmlFor="filterCategory" className="block mb-2">
              Filter by Category
            </label>
            <select
              id="filterCategory"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded"
            >
              <option value="All">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="mealType" className="block mb-2">
          Meal Type
        </label>
        <select
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded"
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </div>

      <button onClick={addToMealPlan} className="px-4 py-2 bg-purple-500 text-white rounded">
        Add to Meal Plan
      </button>

      {/* Meal Plan Display */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Meal Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlan && mealPlan.length > 0 ? (
            mealPlan.map((plan, index) => (
              <div key={index} className="relative bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h3 className="text-gray-500 font-semibold mb-2">
                  {plan.meal?.name || "Meal not found"}
                </h3>
                <p className="text-gray-500">
                  <span className="font-semibold">Category:</span> {plan.meal?.category || "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Diet:</span> {Array.isArray(plan.meal?.diet) ? plan.meal.diet.join(", ") : "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Calories:</span> {plan.meal?.calories || "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Macros:</span>
                  Protein: {plan.meal?.macros?.protein || "N/A"}, Carbs: {plan.meal?.macros?.carbs || "N/A"}, Fat: {plan.meal?.macros?.fat || "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Ingredients:</span>
                </p>
                <ul className="text-gray-500">
                  {plan.meal?.ingredients?.map((ingredient, idx) => (
                    <li key={idx}>
                      {ingredient.amount} {ingredient.unit} of {ingredient.name}
                    </li>
                  )) || "N/A"}
                </ul>
                <p className="text-gray-500">
                  <span className="font-semibold">Preparation Time:</span> {plan.meal?.preparation_time_min || "N/A"} minutes
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Date:</span> {new Date(plan.date).toLocaleDateString() || "No date"}
                </p>

                {/* X icon for removing the meal */}
                <button
                  onClick={() => removeMealFromPlan(plan.meal.id)}
                  className="absolute bottom-4 right-4 text-red-500 hover:text-red-700"
                >
                  <X size={24} strokeWidth={4} />
                </button>
              </div>
            ))
          ) : (
            <p>No meals in your plan yet.</p>
          )}
        </div>
      </div>
      {/* Calendar View */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Meal Calendar</h2>
        <MealCalendar mealPlan={mealPlan} />
      </div>
    </div>
  );
}