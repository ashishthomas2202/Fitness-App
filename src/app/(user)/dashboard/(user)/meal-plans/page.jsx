"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import MealCalendar from "@/components/MealCalendar";
import { X } from "lucide-react";

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
  const [calendarEvents, setCalendarEvents] = useState([]); // For calendar data

  const handleDateSelect = (date) => setSelectedDate(date);
  const goToPreviousDay = () => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  const goToNextDay = () => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));

  // Extract all meals for the calendar
  const extractMealsForCalendar = (days) => {
    return days.map(day => ({
      title: `Meals for ${day.day}`, // You can customize this title to show meal names, etc.
      start: new Date(day.date), // Assuming 'date' is stored as a Date object or in ISO format
      end: new Date(day.date), // Use the same date for start and end for a single-day event
      meals: day.meals.map(meal => ({
        name: meal.name,
        mealType: meal.mealType,
        calories: meal.calories,
        macros: meal.macros,
        date: new Date(meal.date),
      })),
    }));
  };

  // Fetch the meal plan for the selected date
  const fetchMealPlan = async () => {
    if (!session) {
      setError("User not authenticated.");
      return;
    }

    try {
      const response = await axios.get("/api/mealplan", {
        params: { date: selectedDate.toISOString() },
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      console.log("Fetched meal plan data:", response.data);

      const mealPlanData = response.data?.data;

      if (mealPlanData && mealPlanData.days && mealPlanData.days.length > 0) {
        const mealsByType = organizeMealsByType(mealPlanData.days);
        const calendarMeals = extractMealsForCalendar(mealPlanData.days); // Format for calendar

        console.log("Meals organized by type:", mealsByType);
        console.log("Calendar meals:", calendarMeals);

        setMealPlan((prevMealPlan) => ({
          ...prevMealPlan,
          [selectedDate.toDateString()]: mealsByType,
        }));

        setCalendarEvents(calendarMeals); // Set events for the calendar
      } else {
        console.log("No meal plan data found.");
        setError("Failed to fetch meal plan data.");
      }
    } catch (error) {
      setError("Error fetching meal plan.");
      console.error("Error fetching meal plan:", error);
    }
  };

  const organizeMealsByType = (days) => {
    const organizedMeals = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: [],
    };

    const selectedDay = days.find(day => day.day === selectedDate.toLocaleString('en-us', { weekday: 'long' }));
    if (selectedDay) {
      selectedDay.meals.forEach((mealEntry) => {
        if (organizedMeals.hasOwnProperty(mealEntry.mealType)) {
          organizedMeals[mealEntry.mealType].push(mealEntry);
        }
      });
    }

    return organizedMeals;
  };

  // Fetch all meals for the search dropdown
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

  // Add a selected meal to the user's meal plan
  const addToMealPlan = async () => {
    if (selectedMeal) {
      try {
        const response = await axios.post(
          "/api/mealplan/add",
          {
            mealId: selectedMeal.id,
            date: selectedDate,
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
          await fetchMealPlan(); // Refresh the meal plan view after adding
        }

        setSelectedMeal(null);
        setSearchTerm("");
        setFilteredMeals([]);
      } catch (error) {
        setError("Error adding meal to the plan.");
        console.error("Error adding meal to the plan:", error);
      }
    }
  };

  const removeMealFromPlan = async (mealId, mealType) => {
    if (!mealId) return;

    try {
      const response = await axios.post(
        "/api/mealplan/delete",
        {
          mealId,
          date: selectedDate,
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
        fetchMealPlan(); // Refresh meal plan after removal
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

  const handleSearchBlur = () => setTimeout(() => setFilteredMeals([]), 200);

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
        </select>
      </div>

      <button onClick={addToMealPlan} className="px-4 py-2 bg-purple-500 text-white rounded mb-6">Add to Meal Plan</button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Meal Plan for {selectedDate.toLocaleDateString()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
            <div key={type} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 transition-all duration-300">
              <h4 className="text-gray-500 font-semibold mb-2">{type}</h4>
              {mealPlan[selectedDate.toDateString()]?.[type]?.length > 0 ? (
                <div className="space-y-4">
                  {mealPlan[selectedDate.toDateString()][type].map((plan, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md">
                      <div><span className="font-semibold">Name:</span> {plan.name}</div>
                      <div><span className="font-semibold">Calories:</span> {plan.calories} kcal</div>
                      <div><span className="font-semibold">Macros:</span> Protein: {plan.macros.protein}g, Carbs: {plan.macros.carbs}g, Fat: {plan.macros.fat}g</div>
                      <div><span className="font-semibold">Preparation Time:</span> {plan.preparation_time_min} minutes</div>
                      <button onClick={() => removeMealFromPlan(plan.id, type)} className="text-red-500 hover:text-red-700 mt-2">
                        <X size={24} strokeWidth={4} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No {type.toLowerCase()} planned.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Meal Calendar</h2>
        <MealCalendar mealPlan={calendarEvents} onSelect={handleDateSelect} />
      </div>
    </div>
  );
}
