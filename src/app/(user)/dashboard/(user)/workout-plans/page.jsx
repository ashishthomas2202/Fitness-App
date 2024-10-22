"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "tailwindcss/tailwind.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { v4 as uuidv4 } from "uuid";
import { FiEdit } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const initialDays = {};

const colors = [
  "bg-red-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-purple-300",
  "bg-orange-300",
];

const ItemType = {
  WORKOUT: "WORKOUT",
};

export default function WorkoutPlanner() {
  const workoutTypeOptions = ["Strength", "Cardio", "Flexibility"];
  const categoriesOptions = [
    { value: "Weight Training", label: "Weight Training" },
    { value: "Calisthenics", label: "Calisthenics" },
    { value: "Yoga", label: "Yoga" },
    { value: "HIIT", label: "HIIT" },
    { value: "Full Body", label: "Full Body" },
  ];
  const [workouts, setWorkouts] = useState(initialDays);
  const [allWorkouts, setAllWorkouts] = useState({});
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    workoutTypes: [],
    categories: [],
    muscle_groups: [],
    difficulty_level: "",
    equipment: [],
    sets: "",
    reps: "",
    duration_min: "",
    calories_burned_per_min: "",
    description: "",
    color: colors[Math.floor(Math.random() * colors.length)],
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState({});
  const [repeatOption, setRepeatOption] = useState("None");
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [dbLoading, setDbLoading] = useState(false);

  useEffect(() => {
    const getAllWorkouts = async () => {
      try {
        const { data } = await axios.get("/api/workouts");
        if (data?.success) {
          for (const w of data.data) {
            w.workoutTypes = w.type || "";
            w.categories = w.category || [];
            const dateKey = w?.dateKey;
            // setWorkouts(data.data);
            setAllWorkouts((prevWorkouts) => {
              return {
                ...prevWorkouts,
                [dateKey]: prevWorkouts[dateKey]
                  ? [...prevWorkouts[dateKey], w]
                  : [w],
                // [dateKey]: [w],
              };
            });
          }
        }
      } catch (error) {}
    };

    getAllWorkouts();
  }, []);

  useEffect(() => {
    const getWorkout = async () => {
      try {
        const { data } = await axios.get("/api/workouts/user");
        if (data?.success) {
          for (const w of data.data) {
            w.workoutTypes = w.type || "";
            w.categories = w.category || [];
            const dateKey = w?.dateKey;
            // setWorkouts(data.data);
            setWorkouts((prevWorkouts) => {
              return {
                ...prevWorkouts,
                [dateKey]: prevWorkouts[dateKey]
                  ? [...prevWorkouts[dateKey], w]
                  : [w],
                // [dateKey]: [w],
              };
            });
          }
        }
      } catch (error) {}
    };

    getWorkout();
  }, []);

  const getEvents = () => {
    const events = [];
    Object.entries(workouts).forEach(([dateKey, dayWorkouts]) => {
      dayWorkouts.forEach((workout) => {
        events.push({
          id: workout.id,
          title: workout.name,
          allDay: true,
          start: new Date(`${dateKey}T00:00:00`),
          end: new Date(`${dateKey}T23:59:59`),
          workout: workout,
          color:
            workout?.color?.replace("bg-", "") || colors[0].replace("bg-", ""),
        });
      });
    });
    return events;
  };

  const dayPropGetter = (date) => {
    if (
      date.toISOString().split("T")[0] ===
      selectedDate.toISOString().split("T")[0]
    ) {
      return {
        style: {
          backgroundColor: "#fef9c3",
        },
      };
    }
    return {};
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: `var(--${event.color})`,
      borderRadius: "5px",
      opacity: 0.8,
      color: "black",
      border: "none",
      display: "block",
    };
    return {
      style,
    };
  };

  // Handle calendar navigation and view changes
  const handleNavigate = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
  };

  const handleCategoryChange = (selectedOptions) => {
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setNewWorkout((prevWorkout) => ({
      ...prevWorkout,
      categories: selectedCategories,
    }));
  };

  const handleWorkoutTypeChange = (event) => {
    const selectedType = event.target.value;
    setNewWorkout((prevWorkout) => {
      const workoutTypes = prevWorkout.workoutTypes.includes(selectedType)
        ? prevWorkout.workoutTypes.filter((type) => type !== selectedType)
        : [...prevWorkout.workoutTypes, selectedType];
  
      // Create new workout object
      let updatedWorkout = {
        ...prevWorkout,
        workoutTypes,
      };
  
      // If switching to strength, add sets and reps fields
      if (workoutTypes.includes("Strength")) {
        updatedWorkout.sets = "";
        updatedWorkout.reps = "";
      } else {
        // If no strength workout, remove sets and reps
        delete updatedWorkout.sets;
        delete updatedWorkout.reps;
      }
  
      return updatedWorkout;
    });
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Handle slot selection
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const handleAddWorkout = () => {
    setError({}); 
    const newError = {};

    // Validate workout form fields
    if (!newWorkout.name) {
      newError.name = "Workout name is required.";
    }
    if (!newWorkout.workoutTypes || newWorkout.workoutTypes.length === 0) {
      newError.workoutTypes = "At least one workout type must be selected."; // Changed from categories to workoutTypes
    }
    if (!newWorkout.equipment) {
      newError.equipment = "Equipment is required.";
    }
    if (!newWorkout.categories || newWorkout.categories.length === 0) {
      newError.categories = "Please select at least one category";
    }

    // Strength-specific validation
    if (newWorkout.workoutTypes?.includes("Strength")) {
      if (newWorkout.sets < 1 || newWorkout.sets === "") {
        newError.sets = "Sets must be at least 1 and not negative.";
      }
      if (newWorkout.reps < 1 || newWorkout.reps === "") {
        newError.reps = "Reps must be at least 1 and not negative.";
      }
    }

    // Cardio and Flexibility-specific validation
    if (
      (newWorkout.workoutTypes.includes("Cardio") ||
        newWorkout.workoutTypes.includes("Flexibility")) &&
      newWorkout.duration_min < 1
    ) {
      newError.duration_min = "Duration must be at least 1 minute.";
    }

    // Date range validation
    if (repeatOption !== "None") {
      if (!startDate) {
        newError.dateRange = "Start date is required.";
      } else if (endDate && endDate < startDate) {
        newError.dateRange = "End date cannot be before the start date.";
      }
    } else if (!selectedDate) {
      newError.dateRange = "Please select a date for the workout.";
    }

    // If any errors are found, update the error state and stop the function
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    // If validation passes, proceed with adding the workout
    const workoutData = {
      ...newWorkout,
      id: uuidv4(),
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    // Helper function to add the workout to a specific date
    const addWorkoutToDate = async (date) => {
    const dateKey = moment(date).format("YYYY-MM-DD");
    setDbLoading(true);
    workoutData.dateKey = dateKey;
    try {
      const { data } = await axios.post("/api/workouts/create", workoutData);
      if (data?.success) {
        const w = data.data;
        w.workoutTypes = w.type || "";
        w.categories = w.category || [];
        setWorkouts((prevWorkouts) => ({
          ...prevWorkouts,
          [dateKey]: prevWorkouts[dateKey]
            ? [...prevWorkouts[dateKey], w]
            : [w],
        }));
      }
    } catch (error) {
      console.log(error);
    }
    setDbLoading(false);
  };

    if (repeatOption === "None") {
      const dateKey = moment(selectedDate).format("YYYY-MM-DD");
      addWorkoutToDate(selectedDate);
    }

    if (repeatOption === "Daily") {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        addWorkoutToDate(currentDate);
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    }

    if (repeatOption === "Every Other Day") {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        addWorkoutToDate(currentDate);
        currentDate.setDate(currentDate.getDate() + 2);
      }
    }

    if (repeatOption === "Weekly") {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        addWorkoutToDate(currentDate);
        currentDate.setDate(currentDate.getDate() + 7); // Move by 1 week
      }
    }

    if (repeatOption === "Monthly") {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        addWorkoutToDate(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1); // Move by 1 month
      }
    }

    // Reset workout form fields after adding the workout
    setNewWorkout({
      name: "",
      categories: [],
      equipment: [],
      sets: "",
      reps: "",
      duration_min: "",
      muscle_groups: [],
      difficulty_level: "",
      calories_burned_per_min: "",
      description: "",
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    setRepeatOption("None"); // Reset the repeat option
    setStartDate(null); // Reset start date
    setEndDate(null); // Reset end date
  };

  const handleDeleteWorkout = async (dateKey, workoutId) => {
    try {
      const { data } = await axios.delete("/api/workouts/delete/" + workoutId);
      if (data.success) {
        setWorkouts((prevWorkouts) => {
          const updatedWorkouts = {
            ...prevWorkouts,
            [dateKey]: prevWorkouts[dateKey].filter(
              (workout) => workout.id !== workoutId
            ),
          };

          if (updatedWorkouts[dateKey].length === 0) {
            delete updatedWorkouts[dateKey];
          }

          return updatedWorkouts;
        });
      }
    } catch (error) {}
  };

  const handleUpdateWorkout = async (dateKey, workoutId, updatedWorkout) => {
    try {
      const { data } = await axios.put(
        "/api/workouts/update/" + workoutId,
        updatedWorkout
      );
      if (data?.success) {
        updatedWorkout.type = updatedWorkout.workoutTypes;
        updatedWorkout.category = updatedWorkout.categories;
        setWorkouts((prevWorkouts) => {
          const updatedWorkoutsForDate = prevWorkouts[dateKey].map((workout) =>
            workout.id === workoutId
              ? { ...workout, ...updatedWorkout }
              : workout
          );
          return {
            ...prevWorkouts,
            [dateKey]: updatedWorkoutsForDate,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveWorkout = (fromIndex, toIndex, dateKey) => {
    setWorkouts((prevWorkouts) => {
      const workoutsForDate = prevWorkouts[dateKey];
      const workoutToMove = workoutsForDate[fromIndex];
      const updatedWorkouts = [...workoutsForDate];

      updatedWorkouts.splice(fromIndex, 1);
      updatedWorkouts.splice(toIndex, 0, workoutToMove);

      return {
        ...prevWorkouts,
        [dateKey]: updatedWorkouts,
      };
    });
  };

  const handleColorChange = (dateKey, workoutId, newColor) => {
    setWorkouts((prevWorkouts) => {
      const updatedWorkouts = prevWorkouts[dateKey].map((workout) =>
        workout.id === workoutId ? { ...workout, color: newColor } : workout
      );
      return {
        ...prevWorkouts,
        [dateKey]: updatedWorkouts,
      };
    });
  };

  const handleMuscleGroupChange = (event, name) => {
    const { value, checked } = event.target;
    const currentValues = newWorkout.muscle_groups || [];

    if (checked) {
      setNewWorkout({
        ...newWorkout,
        muscle_groups: [...currentValues, value],
      });
    } else {
      setNewWorkout({
        ...newWorkout,
        muscle_groups: currentValues.filter((v) => v !== value),
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 text-black">
        <h1 className="text-2xl font-semibold mb-6">Workout Planner</h1>

        <div className="mb-6 bg-white border border-gray-300 rounded-lg">
          <Calendar
            localizer={localizer}
            events={getEvents()}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: "100%" }}
            onSelectSlot={handleSelectSlot}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            view={view}
            date={date}
            selectable={true}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            popup
            views={["month", "week", "day"]}
            defaultView="month"
            tooltipAccessor={null}
            formats={{
              timeGutterFormat: () => "", // Hide time gutter labels
              dayFormat: "ddd M/D", // Simplified day format
            }}
            components={{
              timeSlotWrapper: () => null, // Remove time slots
              timeGutterHeader: () => null, // Remove time gutter header
            }}
            min={new Date(0, 0, 0, 0, 0)} // Start of day
            max={new Date(0, 0, 0, 23, 59)} // End of day
            timeslots={1} // Show only one slot per hour
            step={1440} // One day steps (in minutes)
          />
        </div>

        <div className="border rounded-lg shadow-md p-4 bg-white">
          <h2 className="font-semibold text-lg mb-2">
            Workouts for {selectedDate.toDateString()}
          </h2>
          <div>
            {workouts[selectedDate.toISOString().split("T")[0]] ? (
              workouts[selectedDate.toISOString().split("T")[0]].map(
                (workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    handleDeleteWorkout={handleDeleteWorkout}
                    handleUpdateWorkout={handleUpdateWorkout}
                    index={index}
                    moveWorkout={moveWorkout}
                    dateKey={selectedDate.toISOString().split("T")[0]}
                    handleColorChange={handleColorChange}
                  />
                )
              )
            ) : (
              <p>No workouts scheduled for this day.</p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-4">Add New Workout</h3>
          <div>
            <label htmlFor="">Select from Existing Workouts</label>
            <select
              className="w-full p-4 border border-gray-300 rounded-md"
              onChange={(e) => {
                const [dateKey, id] = e.target.value.split("-");
                setNewWorkout(allWorkouts[dateKey].find((e) => e.id === id));
              }}
            >
              <option disabled selected>
                Select from Template
              </option>
              {Object.entries(allWorkouts).map(([key, e]) => {
                return e.map((v) => (
                  <option key={v.id} value={key + "-" + v.id}>
                    {v.name}
                  </option>
                ));
                return (
                  <option key={e[0].id} value={key}>
                    {e[0].name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="text-center my-4">OR</div>
          <div className="space-y-4">
            <Input
              label="Workout Name"
              placeholder="Workout name"
              value={newWorkout.name}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, name: e.target.value })
              }
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
            <div className="flex flex-col">
              <label className="font-semibold">Workout Types:</label>
              {["Strength", "Cardio", "Flexibility"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    checked={newWorkout.workoutTypes?.includes(type) || false}
                    onChange={(e) => {
                      setNewWorkout((prev) => {
                        const workoutTypes = prev.workoutTypes?.includes(type)
                          ? prev.workoutTypes.filter((t) => t !== type)
                          : [...(prev.workoutTypes || []), type];
                        return { ...prev, workoutTypes };
                      });
                    }}
                    className="mr-2"
                  />
                  <label>{type}</label>
                </div>
              ))}
              {error.workoutTypes && (
                <p className="text-red-500 text-sm mt-1">
                  {error.workoutTypes}
                </p>
              )}
            </div>
            {/* New Multi-Select Dropdown for Additional Categories */}
            <div className="flex flex-col mt-4">
              <label className="font-semibold">Categories:</label>
              <Select
                isMulti
                options={categoriesOptions}
                onChange={handleCategoryChange}
                value={categoriesOptions.filter((option) =>
                  newWorkout.categories.includes(option.value)
                )}
                placeholder="Select categories"
                className={`mt-2 ${error.categories ? "border-red-500" : ""}`}
              />
              {error.categories && (
                <p className="text-red-500 text-sm mt-1">{error.categories}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Muscle Groups</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="checkbox"
                    value="Chest"
                    checked={newWorkout.muscle_groups.includes("Chest")}
                    onChange={(e) =>
                      handleMuscleGroupChange(e, "muscle_groups")
                    }
                  />
                  Chest
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Legs"
                    checked={newWorkout.muscle_groups.includes("Legs")}
                    onChange={(e) =>
                      handleMuscleGroupChange(e, "muscle_groups")
                    }
                  />
                  Legs
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Arms"
                    checked={newWorkout.muscle_groups.includes("Arms")}
                    onChange={(e) =>
                      handleMuscleGroupChange(e, "muscle_groups")
                    }
                  />
                  Arms
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Shoulders"
                    checked={newWorkout.muscle_groups.includes("Shoulders")}
                    onChange={(e) =>
                      handleMuscleGroupChange(e, "muscle_groups")
                    }
                  />
                  Shoulders
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Abs"
                    checked={newWorkout.muscle_groups.includes("Abs")}
                    onChange={(e) =>
                      handleMuscleGroupChange(e, "muscle_groups")
                    }
                  />
                  Abs
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Full Body"
                    checked={newWorkout.muscle_groups.includes("Full Body")}
                    onChange={(e) =>
                      handleMuscleGroupChange(e, "muscle_groups")
                    }
                  />
                  Full Body
                </label>
              </div>
              {error.muscle_groups && (
                <p className="text-red-500">{error.muscle_groups.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Difficulty Level</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newWorkout.difficulty_level}
                onChange={(e) =>
                  setNewWorkout({
                    ...newWorkout,
                    difficulty_level: e.target.value,
                  })
                }
              >
                <option value="">Select Difficulty Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {error.difficulty_level && (
                <p className="text-red-500">{error.difficulty_level.message}</p>
              )}
            </div>
            <Input
              label="Equipment"
              placeholder="Equipment"
              value={newWorkout.equipment}
              onChange={(e) =>
                setNewWorkout({
                  ...newWorkout,
                  equipment: e.target.value?.split(",").map((e) => e.trim()),
                })
              }
            />
            <Input
              label="Calories Burned per minute"
              placeholder="Calories Burned per minute"
              value={newWorkout.calories_burned_per_min}
              onChange={(e) =>
                setNewWorkout({
                  ...newWorkout,
                  calories_burned_per_min: parseInt(e.target.value),
                })
              }
            />
            {error.calories_burned_per_min && (
              <p className="text-red-500 text-sm">
                {error.calories_burned_per_min}
              </p>
            )}
            {/* Duration field - always show it */}
<Input
  label="Duration (in minutes)"
  placeholder="Duration"
  type="number"
  min={1}
  value={newWorkout.duration_min}
  onChange={(e) =>
    setNewWorkout({
      ...newWorkout,
      duration_min: parseInt(e.target.value),
    })
  }
/>
{error.duration_min && (
  <p className="text-red-500 text-sm">{error.duration_min}</p>
)}

{/* Sets and Reps - only show for Strength workouts */}
{newWorkout.workoutTypes?.includes("Strength") && (
  <>
    <Input
      label="Sets"
      placeholder="Sets"
      type="number"
      min={1}
      value={newWorkout.sets}
      onChange={(e) =>
        setNewWorkout({ ...newWorkout, sets: parseInt(e.target.value) })
      }
    />
    {error.sets && (
      <p className="text-red-500 text-sm">{error.sets}</p>
    )}
    <Input
      label="Reps"
      placeholder="Reps"
      type="number"
      min={1}
      value={newWorkout.reps}
      onChange={(e) =>
        setNewWorkout({ ...newWorkout, reps: parseInt(e.target.value) })
      }
    />
    {error.reps && (
      <p className="text-red-500 text-sm">{error.reps}</p>
    )}
  </>
)}
            <Input
              label="Description"
              placeholder="Description"
              value={newWorkout.description}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, description: e.target.value })
              }
            />
            <label>Color:</label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer ${color} ${
                    newWorkout.color === color ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setNewWorkout({ ...newWorkout, color: color })}
                />
              ))}
            </div>
            <label>Repeat Workout: </label>
            <select
              value={repeatOption}
              onChange={(e) => setRepeatOption(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Every Other Day">Every Other Day</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            {/* Date Pickers for Repeat Workouts */}
            {repeatOption !== "None" && (
              <div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-gray-600 font-bold">
                      Start Date:
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold">
                      End Date:
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      isClearable
                      placeholderText="Optional"
                    />
                  </div>
                </div>

                {/* Display Date Range Error */}
                {error.dateRange && (
                  <p className="text-red-500 text-sm mt-2">{error.dateRange}</p>
                )}
              </div>
            )}

            <div className="mt-4">
              <Button onClick={handleAddWorkout} disabled={dbLoading}>
                Add Workout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

function WorkoutCard({
  workout,
  handleDeleteWorkout,
  handleUpdateWorkout,
  index,
  moveWorkout,
  dateKey,
  handleColorChange,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.WORKOUT,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: ItemType.WORKOUT,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveWorkout(draggedItem.index, index, dateKey);
        draggedItem.index = index;
      }
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState(workout);

  // Error handling
  const [nameError, setNameError] = useState("");
  const [equipmentError, setEquipmentError] = useState("");
  const [setsError, setSetsError] = useState("");
  const [repsError, setRepsError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [dateRangeError, setDateRangeError] = useState("");

  const workoutTypes = ["Strength", "Cardio", "Flexibility"];
  const categories = [
    "Weight Training",
    "Calisthenics",
    "Yoga",
    "HIIT",
    "Full Body",
  ];
  const colors = [
    "bg-red-300",
    "bg-blue-300",
    "bg-yellow-300",
    "bg-green-300",
    "bg-orange-300",
    "bg-purple-300",
  ];

  // State for repeat frequency and dates
  const [repeatFrequency, setRepeatFrequency] = useState(
    workout.repeatFrequency || "None"
  );
  const [startDate, setStartDate] = useState(
    workout.startDate ? new Date(workout.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    workout.endDate ? new Date(workout.endDate) : null
  );

  // Save changes and update the workout
  const handleSaveClick = () => {
    setNameError("");
    setEquipmentError("");
    setSetsError("");
    setRepsError("");
    setDurationError("");
    setCategoryError("");
    setCategoriesError("");
    setDateRangeError("");

    let hasError = false;

    // Validate fields
    if (!editedWorkout.name) {
      setNameError("Workout name is required.");
      hasError = true;
    }
    if (!editedWorkout.categories || editedWorkout.categories.length === 0) {
      setCategoriesError("Please select at least one category");
      hasError = true;
    }
    if (!editedWorkout.equipment) {
      setEquipmentError("Equipment is required.");
      hasError = true;
    }
    if (editedWorkout.type.length === 0) {
      setCategoryError("At least one workout type must be selected.");
      hasError = true;
    }
    if (editedWorkout.type.includes("Strength")) {
      if (editedWorkout.sets < 1 || editedWorkout.sets === "") {
        setSetsError("Sets must be at least 1.");
        hasError = true;
      }
      if (editedWorkout.reps < 1 || editedWorkout.reps === "") {
        setRepsError("Reps must be at least 1.");
        hasError = true;
      }
    }
    if (
      (editedWorkout.type.includes("Cardio") ||
        editedWorkout.type.includes("Flexibility")) &&
      editedWorkout.duration_min < 1
    ) {
      setDurationError("Duration must be at least 1 minute.");
      hasError = true;
    }
    if (repeatFrequency !== "None") {
      if (!startDate) {
        setDateRangeError("Start date is required for a repeating workout.");
        hasError = true;
      } else if (endDate && startDate > endDate) {
        setDateRangeError("End date cannot be earlier than start date.");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    // Include repeat frequency, start, and end dates in the updated workout
    const updatedWorkout = {
      ...editedWorkout,
      repeatFrequency,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    handleUpdateWorkout(dateKey, workout.id, updatedWorkout);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditedWorkout({ ...workout });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditedWorkout(workout);
    setIsEditing(false);
    setNameError("");
    setEquipmentError("");
    setSetsError("");
    setRepsError("");
    setDurationError("");
    setCategoryError("");
    setCategoriesError("");
  };

  // Handle checkbox change for workout types
  const handleWorkoutTypeChange = (type) => {
    const currentIndex = editedWorkout.workoutTypes.indexOf(type);
    const newTypes = [...editedWorkout.workoutTypes];

    if (currentIndex === -1) {
      newTypes.push(type);
    } else {
      newTypes.splice(currentIndex, 1);
    }

    setEditedWorkout({ ...editedWorkout, workoutTypes: newTypes });
  };

  const handleCategoryChange = (category) => {
    const currentIndex = editedWorkout.categories.indexOf(category);
    const newCategories = [...editedWorkout.categories];

    if (currentIndex === -1) {
      newCategories.push(category);
    } else {
      newCategories.splice(currentIndex, 1);
    }

    setEditedWorkout({ ...editedWorkout, categories: newCategories });
  };

  // Handle immediate color change (without entering edit mode)
  const handleColorUpdate = (newColor) => {
    const updatedWorkout = { ...workout, color: newColor };
    handleUpdateWorkout(dateKey, workout.id, updatedWorkout);
  };

  // Helper function to format dates correctly
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  const handleMuscleGroupChange = (value) => {
    const currentValues = editedWorkout.muscle_groups || [];
    const checked = currentValues.includes(value);

    if (!checked) {
      setEditedWorkout({
        ...editedWorkout,
        muscle_groups: [...currentValues, value],
      });
    } else {
      setEditedWorkout({
        ...editedWorkout,
        muscle_groups: currentValues.filter((v) => v !== value),
      });
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-4 rounded-lg shadow-md mb-2 ${workout.color} ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          {/* Name input */}
          <div>
            <label className="block text-gray-600 font-bold">
              Workout Name:
            </label>
            <input
              type="text"
              value={editedWorkout.name}
              onChange={(e) =>
                setEditedWorkout({ ...editedWorkout, name: e.target.value })
              }
              className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          {/* Equipment input */}
          <div>
            <label className="block text-gray-600 font-bold">Equipment:</label>
            <input
              type="text"
              value={editedWorkout.equipment}
              onChange={(e) =>
                setEditedWorkout({
                  ...editedWorkout,
                  equipment: e.target.value?.split(",").map((e) => e.trim()),
                })
              }
              className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {equipmentError && (
              <p className="text-red-500 text-sm">{equipmentError}</p>
            )}
          </div>
          {/* Sets input */}
          {editedWorkout.workoutTypes.includes("Strength") && (
            <div>
              <label className="block text-gray-600 font-bold">Sets:</label>
              <input
                type="number"
                value={editedWorkout.sets || ""}
                onChange={(e) =>
                  setEditedWorkout({ ...editedWorkout, sets: e.target.value })
                }
                className="w-20 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {setsError && <p className="text-red-500 text-sm">{setsError}</p>}
            </div>
          )}
          {/* Reps input */}
          {editedWorkout.workoutTypes.includes("Strength") && (
            <div>
              <label className="block text-gray-600 font-bold">Reps:</label>
              <input
                type="number"
                value={editedWorkout.reps || ""}
                onChange={(e) =>
                  setEditedWorkout({ ...editedWorkout, reps: e.target.value })
                }
                className="w-20 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {repsError && <p className="text-red-500 text-sm">{repsError}</p>}
            </div>
          )}
          {/* Duration input */}
          {(editedWorkout.workoutTypes.includes("Cardio") ||
            editedWorkout.workoutTypes.includes("Flexibility")) && (
            <div>
              <label className="block text-gray-600 font-bold">
                Duration (minutes):
              </label>
              <input
                type="number"
                value={editedWorkout.duration_min || ""}
                onChange={(e) =>
                  setEditedWorkout({
                    ...editedWorkout,
                    duration_min: e.target.value,
                  })
                }
                className="w-20 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {durationError && (
                <p className="text-red-500 text-sm">{durationError}</p>
              )}
            </div>
          )}
          {/* Description input */}
          <div>
            <label className="block text-gray-600 font-bold">
              Description:
            </label>
            <input
              type="text"
              value={editedWorkout.description}
              onChange={(e) =>
                setEditedWorkout({
                  ...editedWorkout,
                  description: e.target.value,
                })
              }
              className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          {/* Workout Types */}
          <div>
            <label className="block text-gray-600 font-bold">
              Workout Type:
            </label>
            <div className="flex flex-col space-y-2">
              {workoutTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedWorkout.workoutTypes.includes(type)}
                    onChange={() => handleWorkoutTypeChange(type)}
                    className="mr-2"
                  />
                  <label className="text-gray-600">{type}</label>
                </div>
              ))}
            </div>
            {categoryError && (
              <p className="text-red-500 text-sm">{categoryError}</p>
            )}
          </div>
          {/* Categories Types */}
          <div>
            <label className="block text-gray-600 font-bold">Categories:</label>
            <div className="flex flex-col space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editedWorkout.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  <label className="text-gray-600">{category}</label>
                </div>
              ))}
            </div>
            {categoriesError && (
              <p className="text-red-500 text-sm">{categoriesError}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 font-bold">
              Muscle Groups:
            </label>
            <div className="flex flex-col space-y-2">
              {["Chest", "Legs", "Arms", "Shoulders", "Abs", "Full Body"].map(
                (group) => (
                  <div key={group} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedWorkout.muscle_groups.includes(group)}
                      onChange={() => handleMuscleGroupChange(group)}
                      className="mr-2"
                    />
                    <label className="text-gray-600">{group}</label>
                  </div>
                )
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Difficulty Level</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editedWorkout.difficulty_level}
                onChange={(e) =>
                  setEditedWorkout({
                    ...editedWorkout,
                    difficulty_level: e.target.value,
                  })
                }
              >
                <option value="">Select Difficulty Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          {/* Color picker for workout */}
          <div className="flex items-center space-x-2">
            <label>Change Color:</label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer ${color} ${
                    editedWorkout.color === color ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setEditedWorkout({ ...editedWorkout, color })}
                />
              ))}
            </div>
          </div>
          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleSaveClick}
              className="bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-red-500 text-white font-bold py-1 px-4 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{workout.name}</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEditClick}
                className="text-blue-500 text-lg"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => handleDeleteWorkout(dateKey, workout.id)}
                className="text-red-500 text-lg font-bold"
              >
                &times;
              </button>
            </div>
          </div>
          <p>Workout Type(s): {workout.type.join(", ")}</p>
          <p>Category(-ies): {workout.category.join(", ")}</p>
          <p>Muscle Group(s): {workout.muscle_groups.join(", ")}</p>
          <p>Difficulty Level: {workout.difficulty_level}</p>
          <p>Equipment: {workout.equipment}</p>
          {workout.sets && workout.reps && (
            <p>
              Sets: {workout.sets}, Reps: {workout.reps}
            </p>
          )}
          {workout.duration_min && (
            <p>Duration: {workout.duration_min} minutes</p>
          )}
          <p>{workout.description}</p>

          {/* Display Repeat Information */}
          {workout.repeatFrequency !== "None" && (
            <p>
              Repeats: {workout.repeatFrequency} from{" "}
              {formatDate(workout.startDate)}{" "}
              {workout.endDate
                ? `to ${formatDate(workout.endDate)}`
                : "ongoing"}
            </p>
          )}

          {/* Color picker for workout (Normal Mode) */}
          <div className="flex items-center space-x-2">
            <label>Color:</label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer ${color} ${
                    workout.color === color ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => handleColorUpdate(color)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
