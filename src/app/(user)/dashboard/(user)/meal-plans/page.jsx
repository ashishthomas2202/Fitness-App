"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { X, Loader } from "lucide-react";

export default function MealPlans() {
  const { data: session } = useSession();
  const [mealPlan, setMealPlan] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [mealType, setMealType] = useState("Dinner");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingMeal, setIsAddingMeal] = useState(false); // Track add meal loading state
  const [expandedMealIds, setExpandedMealIds] = useState([]);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null); // Track the deleting meal

  const goToPreviousDay = () => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  const goToNextDay = () => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));

  const fetchMealPlan = async () => {
    if (!session) {
      setError("User not authenticated.");
      return;
    }

    try {
      const response = await axios.get("/api/mealplan", {
        params: { date: selectedDate.toISOString() },
        headers: { Authorization: `Bearer ${session.token}` },
      });

      const mealPlanData = response.data?.data;
      if (mealPlanData && mealPlanData.days && mealPlanData.days.length > 0) {
        const selectedDateString = selectedDate.toISOString().split("T")[0];
        const selectedDayEntry = mealPlanData.days.find(day => day.day === selectedDateString);

        const mealsByType = selectedDayEntry ? organizeMealsByType([selectedDayEntry]) : {
          Breakfast: [], Lunch: [], Dinner: [], Snack: [], Dessert: []
        };

        const noMealDataFound = Object.values(mealsByType).every(meals => meals.length === 0);
        if (noMealDataFound) setError("No meal plan data found.");
        else setError(null);

        setMealPlan(prevMealPlan => ({
          ...prevMealPlan,
          [selectedDate.toDateString()]: mealsByType,
        }));
      } else {
        setMealPlan(prevMealPlan => ({
          ...prevMealPlan,
          [selectedDate.toDateString()]: { Breakfast: [], Lunch: [], Dinner: [], Snack: [], Dessert: [] },
        }));
        setError("No meal plan data found.");
      }
    } catch (error) {
      setError("Error fetching meal plan.");
      console.error("Error fetching meal plan:", error);
    }
  };

  const organizeMealsByType = (days) => {
    const organizedMeals = { Breakfast: [], Lunch: [], Dinner: [], Snack: [], Dessert: [] };
    const selectedDayEntry = days.find(day => day.day === selectedDate.toISOString().split("T")[0]);

    if (selectedDayEntry) {
      selectedDayEntry.meals.forEach(mealEntry => {
        if (organizedMeals.hasOwnProperty(mealEntry.mealType)) {
          organizedMeals[mealEntry.mealType].push(mealEntry);
        }
      });
    } else {
      console.warn("No meals found for the selected day.");
    }

    console.log("Organized meals by type:", organizedMeals);
    return organizedMeals;
  };

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

  const addToMealPlan = async () => {
    if (!selectedMeal) return;

    setIsAddingMeal(true);
    try {
      const mealIdString = typeof selectedMeal.id === "object" ? selectedMeal.id.toString() : selectedMeal.id;

      const response = await axios.post(
        "/api/mealplan/add",
        {
          mealId: mealIdString,
          date: selectedDate.toISOString(),
          mealType,
          userId: session?.user.id,
          planName: "My Meal Plan",
        },
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      if (!response.data.success) {
        setError("Error adding meal to the plan.");
      } else {
        await fetchMealPlan();
      }

      setSelectedMeal(null);
      setSearchTerm("");
      setFilteredMeals([]);
    } catch (error) {
      setError("Error adding meal to the plan.");
      console.error("Error adding meal to the plan:", error);
    } finally {
      setIsAddingMeal(false);
    }
  };

  const removeMealFromPlan = async (mealId, mealType) => {
    if (!mealId || !session?.user?.id) {
      setError("User is not authenticated or meal ID is missing.");
      return;
    }

    setLoadingDeleteId(mealId); // Set loading state for the specific meal
    try {
      const response = await axios.post(
        "/api/mealplan/delete",
        {
          mealId,
          date: selectedDate.toISOString().split("T")[0], // Send date in YYYY-MM-DD format
          userId: session.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!response.data.success) {
        setError("Error removing meal from the plan.");
      } else {
        fetchMealPlan();
      }
    } catch (error) {
      setError("Error removing meal from the plan.");
      console.error("Error removing meal from the plan:", error);
    } finally {
      setLoadingDeleteId(null); // Clear loading state after deletion
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

  const handleSearchBlur = () => setTimeout(() => setFilteredMeals([]), 200);

  const toggleExpand = (mealId) => {
    setExpandedMealIds((prev) =>
      prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  useEffect(() => {
    fetchMealPlan();
  }, [selectedDate, session]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Plan Your Meals</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousDay} className="px-4 py-2 bg-gray-500 text-white rounded">Previous Day</button>
        <div><span className="font-semibold">Meals for {selectedDate.toLocaleDateString()}</span></div>
        <button onClick={goToNextDay} className="px-4 py-2 bg-gray-500 text-white rounded">Next Day</button>
      </div>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-grow mb-4 md:mb-0 relative">
            <label htmlFor="searchMeal" className="block mb-2">Search for a Meal</label>
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
            <label htmlFor="filterCategory" className="block mb-2">Filter by Category</label>
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
        <label htmlFor="mealType" className="block mb-2">Meal Type</label>
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
          <option value="Dessert">Dessert</option>
        </select>
      </div>

      <button
        onClick={addToMealPlan}
        className="px-4 py-2 bg-purple-500 text-white rounded mb-6 flex items-center"
        disabled={isAddingMeal}
      >
        {isAddingMeal && <Loader className="animate-spin mr-2" />} Add to Meal Plan
      </button>

      {/* Meal type containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"].map((type) => (
          <div key={type} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h4 className="text-gray-500 font-semibold mb-2">{type}</h4>
            {mealPlan[selectedDate.toDateString()]?.[type]?.length > 0 ? (
              mealPlan[selectedDate.toDateString()][type].map((meal) => (
                <div
                  key={meal._id}
                  onClick={() => toggleExpand(meal._id)}
                  className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md cursor-pointer transition-all duration-300 ${expandedMealIds.includes(meal._id) ? 'max-h-full' : 'max-h-32 overflow-hidden'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div><span className="font-semibold">Name:</span> {meal.name}</div>
                      <div><span className="font-semibold">Calories:</span> {meal.calories} kcal</div>
                      <div><span className="font-semibold">Macros:</span> Protein: {meal.macros.protein}g, Carbs: {meal.macros.carbs}g, Fat: {meal.macros.fat}g</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMealFromPlan(meal._id, type); }}
                      className="text-red-500 hover:text-red-700 flex items-center"
                      disabled={loadingDeleteId === meal._id}
                    >
                      {loadingDeleteId === meal._id ? <Loader className="animate-spin mr-2" /> : <X size={24} strokeWidth={4} />}
                      {loadingDeleteId === meal._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  {expandedMealIds.includes(meal._id) && (
                    <div className="mt-4">
                      <div>
                        <h4 className="font-semibold">Ingredients:</h4>
                        <ul className="list-disc list-inside">
                          {meal.ingredients.map((ingredient, index) => (
                            <li key={index}>
                              {ingredient.name}: {ingredient.amount} {ingredient.unit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold">Preparation Steps:</h4>
                        <ol className="list-decimal list-inside">
                          {meal.steps.map((step, index) => (
                            <li key={index}>{step.description}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="mt-4">
                        <span className="font-semibold">Preparation Time:</span> {meal.preparation_time_min} minutes
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No {type.toLowerCase()} planned.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
