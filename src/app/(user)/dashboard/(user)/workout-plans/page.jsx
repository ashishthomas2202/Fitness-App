"use client";

import React, { useState } from "react";
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
  const [workouts, setWorkouts] = useState(initialDays);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    categories: [],
    equipment: "",
    sets: "",
    reps: "",
    duration: "",
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
          color: workout.color.replace("bg-", ""),
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

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Handle slot selection
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const handleAddWorkout = () => {
    setError({}); // Reset the error state
    const newError = {}; // Object to track errors

    // Validate workout form fields
    if (!newWorkout.name) {
      newError.name = "Workout name is required.";
    }
    if (newWorkout.categories.length === 0) {
      newError.categories = "At least one workout type must be selected.";
    }
    if (!newWorkout.equipment) {
      newError.equipment = "Equipment is required.";
    }

    // Strength-specific validation
    if (newWorkout.categories.includes("Strength")) {
      if (newWorkout.sets < 1 || newWorkout.sets === "") {
        newError.sets = "Sets must be at least 1 and not negative.";
      }
      if (newWorkout.reps < 1 || newWorkout.reps === "") {
        newError.reps = "Reps must be at least 1 and not negative.";
      }
    }

    // Cardio and Flexibility-specific validation
    if (
      (newWorkout.categories.includes("Cardio") ||
        newWorkout.categories.includes("Flexibility")) &&
      newWorkout.duration < 1
    ) {
      newError.duration = "Duration must be at least 1 minute.";
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
    const workoutWithId = {
      ...newWorkout,
      id: uuidv4(),
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    // Helper function to add the workout to a specific date
    const addWorkoutToDate = (date) => {
      const dateKey = moment(date).format("YYYY-MM-DD");
      setWorkouts((prevWorkouts) => ({
        ...prevWorkouts,
        [dateKey]: prevWorkouts[dateKey]
          ? [...prevWorkouts[dateKey], workoutWithId]
          : [workoutWithId],
      }));
    };

    // Handle recurrence based on repeatOption
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
      equipment: "",
      sets: "",
      reps: "",
      duration: "",
      description: "",
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    setRepeatOption("None"); // Reset the repeat option
    setStartDate(null); // Reset start date
    setEndDate(null); // Reset end date
  };

  const handleDeleteWorkout = (dateKey, workoutId) => {
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
  };

  const handleUpdateWorkout = (dateKey, workoutId, updatedWorkout) => {
    setWorkouts((prevWorkouts) => {
      const updatedWorkoutsForDate = prevWorkouts[dateKey].map((workout) =>
        workout.id === workoutId ? { ...workout, ...updatedWorkout } : workout
      );
      return {
        ...prevWorkouts,
        [dateKey]: updatedWorkoutsForDate,
      };
    });
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
            style={{ height: 500 }}
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
              {["Strength", "Cardio", "Flexibility"].map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    value={category}
                    checked={newWorkout.categories.includes(category)}
                    onChange={() => {
                      setNewWorkout((prev) => {
                        const categories = prev.categories.includes(category)
                          ? prev.categories.filter((cat) => cat !== category)
                          : [...prev.categories, category];
                        return { ...prev, categories };
                      });
                    }}
                    className="mr-2"
                  />
                  <label>{category}</label>
                </div>
              ))}
            </div>
            {error.categories && (
              <p className="text-red-500 text-sm">{error.categories}</p>
            )}
            <Input
              label="Equipment"
              placeholder="Equipment"
              value={newWorkout.equipment}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, equipment: e.target.value })
              }
            />
            {error.equipment && (
              <p className="text-red-500 text-sm">{error.equipment}</p>
            )}
            {newWorkout.categories.includes("Cardio") ||
            newWorkout.categories.includes("Flexibility") ? (
              <>
                <Input
                  label="Duration (in minutes)"
                  placeholder="Duration"
                  type="number"
                  min={1}
                  value={newWorkout.duration}
                  onChange={(e) =>
                    setNewWorkout({
                      ...newWorkout,
                      duration: e.target.value,
                    })
                  }
                />
                {error.duration && (
                  <p className="text-red-500 text-sm">{error.duration}</p>
                )}
              </>
            ) : null}
            {newWorkout.categories.includes("Strength") && (
              <>
                <Input
                  label="Sets"
                  placeholder="Sets"
                  type="number"
                  min={1}
                  value={newWorkout.sets}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, sets: e.target.value })
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
                    setNewWorkout({ ...newWorkout, reps: e.target.value })
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
              <Button onClick={handleAddWorkout}>Add Workout</Button>
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
  const [dateRangeError, setDateRangeError] = useState("");

  const categories = ["Strength", "Cardio", "Flexibility"];
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
    setDateRangeError("");

    let hasError = false;

    // Validate fields
    if (!editedWorkout.name) {
      setNameError("Workout name is required.");
      hasError = true;
    }
    if (!editedWorkout.equipment) {
      setEquipmentError("Equipment is required.");
      hasError = true;
    }
    if (editedWorkout.categories.length === 0) {
      setCategoryError("At least one workout type must be selected.");
      hasError = true;
    }
    if (editedWorkout.categories.includes("Strength")) {
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
      (editedWorkout.categories.includes("Cardio") ||
        editedWorkout.categories.includes("Flexibility")) &&
      editedWorkout.duration < 1
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
  };

  // Handle checkbox change for categories
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
                  equipment: e.target.value,
                })
              }
              className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {equipmentError && (
              <p className="text-red-500 text-sm">{equipmentError}</p>
            )}
          </div>

          {/* Sets input */}
          {editedWorkout.categories.includes("Strength") && (
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
          {editedWorkout.categories.includes("Strength") && (
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
          {(editedWorkout.categories.includes("Cardio") ||
            editedWorkout.categories.includes("Flexibility")) && (
            <div>
              <label className="block text-gray-600 font-bold">
                Duration (minutes):
              </label>
              <input
                type="number"
                value={editedWorkout.duration || ""}
                onChange={(e) =>
                  setEditedWorkout({
                    ...editedWorkout,
                    duration: e.target.value,
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

          {/* Workout Categories */}
          <div>
            <label className="block text-gray-600 font-bold">
              Workout Type:
            </label>
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
            {categoryError && (
              <p className="text-red-500 text-sm">{categoryError}</p>
            )}
          </div>

          {/* Repeat Frequency */}
          <div>
            <label className="block text-gray-600 font-bold">
              Repeat Frequency:
            </label>
            <select
              value={repeatFrequency}
              onChange={(e) => setRepeatFrequency(e.target.value)}
              className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Every Other Day">Every Other Day</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Start and End Date Pickers with Date Range Validation */}
          {repeatFrequency !== "None" && (
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
              {dateRangeError && (
                <p className="text-red-500 text-sm mt-2">{dateRangeError}</p>
              )}
            </div>
          )}

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
          <p>Categories: {workout.categories.join(", ")}</p>
          <p>Equipment: {workout.equipment}</p>
          {workout.sets && workout.reps && (
            <p>
              Sets: {workout.sets}, Reps: {workout.reps}
            </p>
          )}
          {workout.duration && <p>Duration: {workout.duration} minutes</p>}
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
