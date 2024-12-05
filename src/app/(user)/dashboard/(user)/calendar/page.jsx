"use client";
import { Page } from "@/components/dashboard/Page";
import { Calendar } from "@/components/ui/Calendar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
// import CreateEventDialog from "@/components/form/CreateTaskEventDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import CreateTaskForm from "@/components/form/CreateTaskForm";
import CreateEventForm from "@/components/form/CreateEventForm";

export default function CalendarPage() {
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState({});
  const [workoutItems, setWorkoutItems] = useState([]);
  const [activeMealPlan, setActiveMealPlan] = useState({});
  const [mealItems, setMealItems] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]); // For all calendar items (workouts, meals, events)

  // Fetch user-created events
  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events");
      if (response?.data?.success) {
        console.log("Fetched events:", response?.data?.data);
        return response?.data?.data || [];
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    return [];
  };

  // Fetch active workout plan
  const fetchActiveWorkoutPlan = async () => {
    return await axios
      .get("/api/workout-plan/active")
      .then((response) => {
        if (response?.data?.success) {
          setActiveWorkoutPlan(response?.data?.data || null);
          return response?.data?.data || null;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  // Fetch active meal plan
  const fetchActiveMealPlan = async () => {
    return await axios
      .get("/api/mealplan/active")
      .then((response) => {
        if (response?.data?.success) {
          setActiveMealPlan(response?.data?.data || null);
          return response?.data?.data || null;
        }
        return null;
      })
      .catch((error) => {
        return null;
      });
  };

  // Fetch all data on mount
  const fetchAllData = async () => {
    const [events, workoutPlan, mealPlan] = await Promise.all([
      fetchEvents(),
      fetchActiveWorkoutPlan(),
      fetchActiveMealPlan(),
    ]);

    // Transform and combine items
    const transformedWorkoutItems = transformWorkoutsToEvents({
      workoutData: workoutPlan?.days || [],
      color: workoutPlan?.color,
      start: workoutPlan?.startDate,
      end: workoutPlan?.endDate,
    });

    const transformedMealItems = transformMealsToEvents({
      mealsData: mealPlan?.days || [],
      color: mealPlan?.color,
      start: mealPlan?.startDate,
      end: mealPlan?.endDate,
    });

    setWorkoutItems(transformedWorkoutItems);
    setMealItems(transformedMealItems);

    // Combine all items for the calendar
    setCalendarItems([
      ...events,
      ...transformedWorkoutItems,
      ...transformedMealItems,
    ]);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleTaskCreated = (task) => {
    // setCalendarItems([...calendarItems, task]);
    fetchAllData();
  };
  const handleEventCreated = (event) => {
    setCalendarItems([...calendarItems, event]);
  };
  return (
    <Page title="Calendar">
      {/* <CreateEventDialog
        // onEventCreated={handleEventCreated}
        onCreated={fetchAllData}
      /> */}
      <CreateTaskEventDialog
        onTaskCreated={handleTaskCreated}
        onEventCreated={handleEventCreated}
      />
      <Calendar items={calendarItems} />
    </Page>
  );
}

const transformWorkoutsToEvents = ({
  workoutData,
  color = "#000000",
  start,
  end,
}) => {
  const events = [];

  workoutData.forEach((dayEntry) => {
    const { day, workouts } = dayEntry;

    workouts.forEach((workout) => {
      const workoutDetails = workout.workoutId;

      const event = {
        repeat: "weekly",
        days: [day], // Weekly event on the specified day
        name: workoutDetails.name,
        color: color,
      };

      if (start) {
        event.start = moment(start).format("YYYY-MM-DD");
      }
      if (end) {
        event.end = moment(end).format("YYYY-MM-DD");
      }

      events.push(event);
    });
  });

  return events;
};

const transformMealsToEvents = ({
  mealsData,
  color = "#000000",
  start,
  end,
}) => {
  const events = [];

  mealsData.forEach((dayEntry) => {
    const { day, meals } = dayEntry;

    meals.forEach((meal) => {
      const { name } = meal;
      const event = {
        repeat: "weekly",
        days: [day],
        name: `${name}`,
        color: color,
      };

      if (start) {
        event.start = moment(start).format("YYYY-MM-DD");
      }
      if (end) {
        event.end = moment(end).format("YYYY-MM-DD");
      }

      events.push(event);
    });
  });

  return events;
};

const CreateTaskEventDialog = ({ onTaskCreated, onEventCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [activeTab, setActiveTab] = useState("task");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-2" onClick={() => setIsOpen(true)}>
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="task">Task</TabsTrigger>
            <TabsTrigger value="event">Event</TabsTrigger>
          </TabsList>

          <TabsContent value="task"> */}
        <CreateTaskForm
          onTaskCreated={(task) => {
            onTaskCreated(task);
            setIsOpen(false);
          }}
        />
        {/* </TabsContent>

          <TabsContent value="event">
            <CreateEventForm
              onEventCreated={(event) => {
                onEventCreated(event);
                setIsOpen(false);
              }}
            />
          </TabsContent>
        </Tabs> */}
      </DialogContent>
    </Dialog>
  );
};

// "use client";
// import { Page } from "@/components/dashboard/Page";
// import { Calendar } from "@/components/ui/Calendar";
// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import moment from "moment-timezone";

// export default function CalendarPage() {
//   const [activeWorkoutPlan, setActiveWorkoutPlan] = useState({});
//   const [workoutItems, setWorkoutItems] = useState([]);
//   const [activeMealPlan, setActiveMealPlan] = useState({});
//   const [mealItems, setMealItems] = useState([]);
//   const fetchActiveWorkoutPlan = async () => {
//     return await axios
//       .get("/api/workout-plan/active")
//       .then((response) => {
//         if (response?.data?.success) {
//           setActiveWorkoutPlan(response?.data?.data || null);
//           // console.log("Active workout plan:", response?.data?.data);

//           return response?.data?.data || null;
//         }
//         return null;
//       })
//       .catch((error) => {
//         return null;
//       });
//   };

//   const fetchActiveMealPlan = async () => {
//     return await axios
//       .get("/api/mealplan/active")
//       .then((response) => {
//         if (response?.data?.success) {
//           setActiveMealPlan(response?.data?.data || null);
//           console.log("Active meal plan:", response?.data?.data);
//           return response?.data?.data || null;
//         }
//         return null;
//       })
//       .catch((error) => {
//         return null;
//       });
//   };

//   useEffect(() => {
//     fetchActiveWorkoutPlan();
//     fetchActiveMealPlan();
//   }, []);

//   useEffect(() => {
//     setWorkoutItems(
//       transformWorkoutsToEvents({
//         workoutData: activeWorkoutPlan?.days || [],
//         color: activeWorkoutPlan?.color,
//         start: activeWorkoutPlan?.startDate,
//         end: activeWorkoutPlan?.endDate,
//       })
//     );
//   }, [activeWorkoutPlan]);

//   useEffect(() => {
//     setMealItems(
//       transformMealsToEvents({
//         mealsData: activeMealPlan?.days || [],
//         color: activeMealPlan?.color,
//         start: activeMealPlan?.startDate,
//         end: activeMealPlan?.endDate,
//       })
//     );
//   }, [activeMealPlan]);

//   return (
//     <Page title="Calendar">
//       <Calendar
//       //  items={[...workoutItems, ...mealItems]}
//        />
//     </Page>
//   );
// }

// const transformWorkoutsToEvents = ({
//   workoutData,
//   color = "#000000",
//   start,
//   end,
// }) => {
//   const events = [];

//   workoutData.forEach((dayEntry) => {
//     const { day, workouts } = dayEntry;

//     workouts.forEach((workout) => {
//       const workoutDetails = workout.workoutId;

//       // Create an event object for each workout
//       const event = {
//         repeat: "weekly",
//         days: [day], // Weekly event on the specified day
//         name: workoutDetails.name,
//         color: color,
//         durationMin: workoutDetails.duration_min, // Optional additional detail
//       };

//       if (start) {
//         event.start = moment(start).format("YYYY-MM-DD");
//       }
//       if (end) {
//         event.end = moment(end).format("YYYY-MM-DD");
//       }

//       // Add optional time or other data if needed (e.g., startTime, endTime)
//       if (workout.durationMin) {
//         event.duration = `${workoutDetails.duration_min} mins`;
//       }

//       events.push(event);
//     });
//   });

//   return events;
// };

// const transformMealsToEvents = ({
//   mealsData,
//   color = "#000000",
//   start,
//   end,
// }) => {
//   const events = [];

//   mealsData.forEach((dayEntry) => {
//     const { day, meals } = dayEntry;

//     meals.forEach((meal) => {
//       const { name, calories, macros, mealType } = meal;
//       const event = {
//         repeat: "weekly",
//         days: [day],
//         name: `${name}`, // e.g., "Lunch: Breakfast Burrito"
//         color: color,
//       };

//       if (start) {
//         event.start = moment(start).format("YYYY-MM-DD");
//       }
//       if (end) {
//         event.end = moment(end).format("YYYY-MM-DD");
//       }

//       events.push(event);
//     });
//   });

//   return events;
// };
