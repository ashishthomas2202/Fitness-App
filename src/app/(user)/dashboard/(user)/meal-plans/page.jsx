"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react"; // Import useSession from next-auth

export default function MealPlans() {
  const { data: session } = useSession(); // Get session data
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [mealType, setMealType] = useState("Breakfast");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await axios.get("/api/mealplan", {
          headers: {
            Authorization: `Bearer ${session?.token}`, // Pass the session token in the headers
          },
        });
        if (response.data.success) {
          setMealPlan(response.data.data.meals);
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
  }, [session]);

  const addToMealPlan = async () => {
    if (selectedMeal) {
      try {
        // Debugging: Log the data being sent
        console.log("Adding meal with data:", {
          mealId: selectedMeal.id,  // Make sure 'mealId' is correct
          date: new Date(),
          mealType,
        });

        const response = await axios.post(
          "/api/mealplan/add",
          {
            mealId: selectedMeal.id,  // Send the correct meal id
            date: new Date(),
            mealType,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            }
          }
        );

        if (response.data.success) {
          setMealPlan((prevMealPlan) => [
            ...(Array.isArray(prevMealPlan) ? prevMealPlan : []),
            response.data.data,
          ]);
        } else {
          setError("Error adding meal to the plan.");
        }
      } catch (error) {
        setError("Error adding meal to the plan.");
        console.error("Error adding meal to the plan:", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter meals based on search term and category
    const filtered = meals.filter((meal) => {
      const matchesSearch = meal.name.toLowerCase().includes(term.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || meal.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    setFilteredMeals(filtered);
  };

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    setSearchTerm(meal.name); // Show selected meal name in search bar
    setFilteredMeals([]); // Hide the suggestions after selection
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setFilteredMeals([]); // Clear suggestions when focus is lost
    }, 200);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Plan Your Meals</h1>
      {error && <p className="text-red-500">{error}</p>}

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

            {filteredMeals.length > 0 && (
              <ul className="absolute bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-full border border-gray-300 dark:border-gray-700 rounded-lg mt-1 shadow-lg">
                {filteredMeals.map((meal) => (
                  <li
                    key={meal._id}
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

      <button
        onClick={addToMealPlan}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Add to Meal Plan
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Meal Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlan && mealPlan.length > 0 ? (
            mealPlan.map((plan, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {plan.meal?.name || "Meal not found"}
                </h3>
                <p className="text-gray-500">
                  <span className="font-semibold">Meal Type:</span>{" "}
                  {plan.mealType || "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Calories:</span>{" "}
                  {plan.meal?.calories || "N/A"}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(plan.date).toLocaleDateString() || "No date"}
                </p>
              </div>
            ))
          ) : (
            <p>No meals in your plan yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
