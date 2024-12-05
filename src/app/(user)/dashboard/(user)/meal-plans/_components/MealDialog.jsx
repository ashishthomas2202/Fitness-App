"use client";
import { useEffect, useState } from "react";
import { PenIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
// import moment from "moment-timezone";
import moment from "moment";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/Dropdown-menu";
import { cn } from "@/lib/utils";

// Function to parse backend data into user input format
const parseSelectedMeals = (data) => {
  console.log("Parsing Selected Meals:", data);
  const distinctMeals = [];

  data?.days.forEach((day) => {
    day?.meals.forEach((meal) => {
      const mealId = meal?.mealId;

      const existingMeal = distinctMeals.find(
        (m) => m.id === mealId && m.mealType === meal?.mealType
      );

      if (!existingMeal) {
        distinctMeals.push({
          id: mealId,
          name: meal?.name || meal?.mealId?.name || "Unnamed Meal",
          mealType: meal?.mealType || "Breakfast",
          macros: meal?.macros ||
            meal?.mealId?.macros || { protein: 0, carbs: 0, fat: 0 },
          calories: meal?.calories || meal?.mealId?.calories || 0,
          days: [day?.day],
        });
      } else {
        if (!existingMeal.days.includes(day?.day)) {
          existingMeal.days.push(day?.day);
        }
      }
    });
  });

  return distinctMeals;
};

// Function to format user input into backend format
const formatDataForBackend = (selectedMeals) => {
  const distinctDays = [
    ...new Set(selectedMeals.map((meal) => meal.days).flat()),
  ];

  return distinctDays.map((day) => {
    let order = 0;
    return {
      day,
      meals: selectedMeals
        .filter((meal) => meal.days.includes(day))
        .map((meal, i) => {
          const mealId =
            typeof meal.id === "string" ? meal.id : meal.id?._id || "";
          return {
            mealId,
            name: meal.name || "Unnamed Meal",
            calories: meal.calories || 0,
            macros: meal.macros || { protein: null, carbs: null, fat: null },
            mealType: meal.mealType || "Breakfast",
            order: order + i,
          };
        }),
    };
  });
};

export const MealDialog = ({
  children,
  onCreate = () => {},
  onUpdate = () => {},
  meals = [],
  data: updateData,
  mode = "create",
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planName, setPlanName] = useState(updateData?.planName || "");
  const [selectedMeals, setSelectedMeals] = useState(
    updateData ? parseSelectedMeals(updateData) : []
  );
  const [search, setSearch] = useState("");
  const [note, setNote] = useState(updateData?.note || "");
  const [startDate, setStartDate] = useState(
    moment(updateData?.startDate).format("yyyy-MM-DD")
  );

  console.log(meals);
  const [endDate, setEndDate] = useState(updateData?.endDate || null);

  const colors = [
    { name: "Indigo", code: "#4F46E5" },
    { name: "Periwinkle", code: "#818CF8" },
    { name: "Lavender", code: "#C4B5FD" },
    { name: "Blush", code: "#F9A8D4" },
    { name: "Coral", code: "#FB7185" },
    { name: "Crimson", code: "#F87171" },
    { name: "Topaz", code: "#FFD700" },
    { name: "Saffron", code: "#FBBF24" },
    { name: "Amber", code: "#F59E0B" },
    { name: "Mint", code: "#34D399" },
    { name: "Emerald", code: "#10B981" },
    { name: "Lime", code: "#84CC16" },
    { name: "Azure", code: "#60A5FA" },
    { name: "Cerulean", code: "#3B82F6" },
    { name: "Slate", code: "#64748B" },
  ];

  const [color, setColor] = useState(updateData?.color || colors[0].code);
  const [error, setError] = useState({});

  const toggleMealSelection = (meal) => {
    if (selectedMeals.some((m) => m.id === meal.id)) {
      setSelectedMeals((prev) => prev.filter((m) => m.id !== meal.id));
    } else {
      setSelectedMeals((prev) => [
        ...prev,
        {
          ...meal,
          days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          mealType: "Breakfast",
        },
      ]);
    }
  };

  const handleMealTypeChange = (id, value) => {
    setSelectedMeals((prev) =>
      prev.map((meal) =>
        meal.id === id
          ? {
              ...meal,
              mealType: value,
            }
          : meal
      )
    );
  };

  const handleMealDayChange = (id, value) => {
    setSelectedMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, days: value } : meal))
    );
  };

  const handleReorder = (newOrder) => {
    setSelectedMeals(
      newOrder.map((meal, index) => ({ ...meal, order: index + 1 }))
    );
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    let errors = {};
    if (!planName) {
      errors.planName = "Plan name is required";
    }
    if (!startDate || startDate === "Invalid date") {
      errors.startDate = "Start date is required";
    }
    if (selectedMeals.length === 0) {
      errors.meals = "At least one meal is required";
    }
    if (color === "") {
      errors.color = "Color is required";
    }
    setError(errors);
    return Object.keys(errors).length !== 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      return;
    }

    const formattedData = formatDataForBackend(selectedMeals);

    if (mode === "create") {
      onCreate({
        planName,
        days: formattedData,
        startDate,
        endDate,
        note,
        color,
      });
    } else {
      onUpdate(updateData.id, {
        planName,
        days: formattedData,
        startDate,
        endDate,
        note,
        color,
      });
    }

    resetFields();
    setDialogOpen(false);
  };

  const resetFields = () => {
    if (mode === "create") {
      setPlanName("");
      setSelectedMeals([]);
      setStartDate(moment().format("yyyy-MM-DD"));
      setEndDate(null);
      setNote("");
      setColor(colors[0].code);
      setError({});
    } else {
      setPlanName(updateData?.planName || "");
      setSelectedMeals(updateData ? parseSelectedMeals(updateData) : []);
      setStartDate(updateData?.startDate || moment().format("yyyy-MM-DD"));
      setEndDate(updateData?.endDate || null);
      setNote(updateData?.note || "");
      setColor(updateData?.color || colors[0].code);
      setError({});
    }
  };

  useEffect(() => {
    if (dialogOpen && mode === "create") {
      resetFields();
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      validate();
    }
  }, [selectedMeals, planName, startDate]);

  //   useEffect(() => {
  //     console.log("Meals prop passed to MealDialog:", meals);
  //   }, [meals]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="contents" onClick={() => setDialogOpen(true)}>
        {children}
      </div>
      <DialogContent className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-6">
        <DialogTitle>
          {mode === "create" ? "Create" : "Update"} Meal Plan
        </DialogTitle>
        <DialogDescription className="text-neutral-400 dark:text-neutral-500 font-light">
          Please add meals to your plan
        </DialogDescription>
        <div>
          <Label>
            Plan Name<sup className="text-red-500">*</sup>
          </Label>
          <Input
            type="text"
            placeholder="Enter plan name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
          {error?.planName && (
            <p className="text-red-500 text-sm mt-2">{error?.planName}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 p-2 border dark:border-neutral-900 rounded-xl">
          <Input
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ScrollArea className="h-40 p-2 border rounded-xl shadow-lg overflow-y-auto">
            {filteredMeals.length === 0 ? (
              <div className="h-full flex items-center justify-center py-2 px-4">
                <span>No meals found</span>
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between py-2 px-4 hover:bg-violet-100 rounded-lg cursor-pointer"
                  onClick={() => toggleMealSelection(meal)}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedMeals.some((m) => m.id === meal.id)}
                      onCheckedChange={() => toggleMealSelection(meal)}
                    />
                    <span>{meal.name}</span>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
        <div>
          <h3 className="text-lg font-light mb-2">Selected Meals</h3>
          <ScrollArea className="h-60 p-2 border rounded-xl shadow-lg overflow-y-auto">
            {selectedMeals.length === 0 ? (
              <div className="h-full flex justify-center items-center">
                <h4>No meals added</h4>
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={selectedMeals}
                onReorder={handleReorder}
                className="space-y-4"
              >
                {selectedMeals.map((meal) => (
                  <Reorder.Item
                    key={`${meal.mealId}-${meal.days.join("-")}`}
                    value={meal}
                    className="flex flex-col gap-2 py-2 px-4 bg-neutral-50 shadow-lg border rounded-lg mb-2"
                  >
                    <div className="flex justify-between items-center">
                      <p>{meal.name}</p>
                      <div className="flex items-center gap-4">
                        <Input
                          type="text"
                          placeholder="Meal Type"
                          value={meal.mealType}
                          onChange={(e) =>
                            handleMealTypeChange(meal.id, e.target.value)
                          }
                        />
                        <DaySelector
                          value={[...meal?.days]}
                          onChange={(value) =>
                            handleMealDayChange(meal.id, value)
                          }
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </ScrollArea>
          {error?.meals && (
            <p className="text-red-500 text-sm mt-2">{error?.meals}</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-light mb-2">Note</h3>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <fieldset>
            <Label>
              Start Date<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(moment(e.target.value).format("yyyy-MM-DD"))
              }
            />
            {error?.startDate && (
              <p className="text-red-500 text-sm mt-2">{error?.startDate}</p>
            )}
          </fieldset>
          <fieldset>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate ? moment(endDate).format("yyyy-MM-DD") : ""}
              onChange={(e) =>
                setEndDate(moment(e.target.value).format("yyyy-MM-DD"))
              }
            />
          </fieldset>
          <fieldset>
            <Label>
              Color<sup className="text-red-500">*</sup>
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="border rounded-lg p-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {colors.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setColor(c.code)}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.code }}
                    ></div>
                    <p>{c.name}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {error?.color && (
              <p className="text-red-500 text-sm mt-2">{error?.color}</p>
            )}
          </fieldset>
        </div>
        <Button variant="primary" onClick={handleSubmit}>
          {mode === "create" ? "Create" : "Update"} Meal Plan
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const DaySelector = ({ value = [], onChange = () => {} }) => {
  const days = [
    { Monday: "M" },
    { Tuesday: "T" },
    { Wednesday: "W" },
    { Thursday: "Th" },
    { Friday: "F" },
    { Saturday: "S" },
    { Sunday: "Su" },
  ];

  const handleChange = (day) => {
    const selected = value.includes(day);
    if (selected && value.length === 1) {
      return; // Prevent removing the last day
    }
    const newDays = selected ? value.filter((d) => d !== day) : [...value, day];
    onChange(newDays);
  };

  return (
    <div>
      <ul className="flex gap-2">
        {days.map((d) => {
          const day = Object.keys(d)[0];
          return (
            <li
              key={day}
              className={cn(
                "border rounded-full h-8 w-8 flex justify-center items-center",
                value.includes(day) && "bg-violet-500 text-white"
              )}
              onClick={() => handleChange(day)}
            >
              {d[day]}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// "use client";
// import { useEffect, useState } from "react";
// import { PenIcon, Trash2Icon } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
// } from "@/components/ui/Dialog";
// import { Input } from "@/components/ui/Input";
// import { Checkbox } from "@/components/ui/Checkbox";
// import { ScrollArea } from "@/components/ui/Scroll-area";
// import { Reorder } from "framer-motion";
// import { Button } from "@/components/ui/Button";
// import { Switch } from "@/components/ui/Switch";
// import { cn } from "@/lib/utils";
// import { Textarea } from "@/components/ui/Textarea";
// import { Label } from "@/components/ui/Label";
// import moment from "moment-timezone";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/Dropdown-menu";

// // const parseSelectedMeals = (data) => {
// //   let distinctMeals = [];

// //   data.days.forEach((day) => {
// //     day.meals.forEach((meal) => {
// //       const existingMeal = distinctMeals.find(
// //         (m) => m.id === meal.mealId && m.mealType === meal.mealType
// //       );

// //       if (!existingMeal) {
// //         distinctMeals.push({
// //           id: meal.mealId,
// //           name: meal.name,
// //           mealType: meal.mealType,
// //           macros: meal.macros,
// //           calories: meal.calories,
// //           days: [day.day], // Initialize with the current day
// //         });
// //       } else {
// //         // Add the current day to the list of days if it's not already there
// //         if (!existingMeal.days.includes(day.day)) {
// //           existingMeal.days.push(day.day);
// //         }
// //       }
// //     });
// //   });

// //   return distinctMeals;
// // };

// const parseSelectedMeals = (data) => {
//   const distinctMeals = [];

//   data?.days.forEach((day) => {
//     day?.meals.forEach((meal) => {
//       const mealId = meal?.mealId?._id || meal?.mealId || meal?.id || meal.id;

//       const existingMeal = distinctMeals.find(
//         (m) => m._id === mealId && m.mealType === meal?.mealType
//       );

//       if (!existingMeal) {
//         distinctMeals.push({
//           id: mealId,
//           name: meal?.mealId?.name || meal?.name || "Unnamed Meal",
//           mealType: meal?.mealType || "Breakfast",
//           macros: meal?.macros ||
//             meal?.mealId?.macros || { protein: 0, carbs: 0, fat: 0 },
//           calories: meal?.calories || meal?.mealId?.calories || 0,
//           days: [day?.day], // Initialize with the current day
//         });
//       } else {
//         // Add the current day to the list of days if it's not already there
//         if (!existingMeal.days.includes(day?.day)) {
//           existingMeal.days.push(day?.day);
//         }
//       }
//     });
//   });

//   console.log("Parsed Selected Meals:", distinctMeals);

//   return distinctMeals;
// };

// export const MealDialog = ({
//   children,
//   onCreate = () => {},
//   onUpdate = () => {},
//   meals = [],
//   data: updateData,
//   mode = "create",
// }) => {
//   console.log("MealDialog Component Rendered", updateData);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [planName, setPlanName] = useState(updateData?.planName || "");
//   const [selectedMeals, setSelectedMeals] = useState(
//     updateData ? parseSelectedMeals(updateData) : []
//   );
//   const [search, setSearch] = useState("");
//   const [note, setNote] = useState(updateData?.note || "");
//   const [startDate, setStartDate] = useState(
//     updateData?.startDate || moment().format("yyyy-MM-DD")
//   );
//   const [endDate, setEndDate] = useState(updateData?.endDate || null);

//   const colors = [
//     { name: "Indigo", code: "#4F46E5" },
//     { name: "Periwinkle", code: "#818CF8" },
//     { name: "Lavender", code: "#C4B5FD" },
//     { name: "Blush", code: "#F9A8D4" },
//     { name: "Coral", code: "#FB7185" },
//     { name: "Crimson", code: "#F87171" },
//     { name: "Topaz", code: "#FFD700" },
//     { name: "Saffron", code: "#FBBF24" },
//     { name: "Amber", code: "#F59E0B" },
//     { name: "Mint", code: "#34D399" },
//     { name: "Emerald", code: "#10B981" },
//     { name: "Lime", code: "#84CC16" },
//     { name: "Azure", code: "#60A5FA" },
//     { name: "Cerulean", code: "#3B82F6" },
//     { name: "Slate", code: "#64748B" },
//   ];

//   const [color, setColor] = useState(updateData?.color || colors[0].code);
//   const [error, setError] = useState({});

//   const toggleMealSelection = (meal) => {
//     console.log("Toggling meal selection for:", meal); // Log the incoming meal
//     if (selectedMeals.some((m) => m.id === meal.id)) {
//       // Remove the meal if already selected
//       setSelectedMeals((prev) => prev.filter((m) => m.id !== meal.id));
//     } else {
//       // Add the meal to the selection
//       setSelectedMeals((prev) => [
//         ...prev,
//         {
//           ...meal,
//           days: [
//             "Monday",
//             "Tuesday",
//             "Wednesday",
//             "Thursday",
//             "Friday",
//             "Saturday",
//             "Sunday",
//           ],
//           mealType: "Breakfast", // Default meal type
//         },
//       ]);
//     }
//     console.log("Updated Selected Meals:", selectedMeals);
//   };

//   const handleMealTypeChange = (id, value) => {
//     setSelectedMeals((prev) =>
//       prev.map((meal) =>
//         meal.id === id
//           ? {
//               ...meal,
//               mealType: value,
//             }
//           : meal
//       )
//     );
//   };

//   const handleMealDayChange = (id, value) => {
//     setSelectedMeals((prev) =>
//       prev.map((meal) => (meal.id === id ? { ...meal, days: value } : meal))
//     );
//   };

//   const handleReorder = (newOrder) => {
//     setSelectedMeals(
//       newOrder.map((meal, index) => ({ ...meal, order: index + 1 }))
//     );
//   };

//   const filteredMeals = meals.filter((meal) =>
//     meal.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const validate = () => {
//     let errors = {};
//     if (!planName) {
//       errors.planName = "Plan name is required";
//     }
//     if (!startDate || startDate === "Invalid date") {
//       errors.startDate = "Start date is required";
//     }
//     if (selectedMeals.length === 0) {
//       errors.meals = "At least one meal is required";
//     }
//     if (color === "") {
//       errors.color = "Color is required";
//     }
//     setError(errors);
//     return Object.keys(errors).length !== 0;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       return;
//     }
//     console.log("Selected Meals Before Payload Construction:", selectedMeals);

//     const distinctDays = [
//       ...new Set(selectedMeals.map((meal) => meal.days).flat()),
//     ];

//     const data = distinctDays.map((day) => {
//       let order = 0;

//       console.log(
//         `Meals for day ${day}:`,
//         selectedMeals.filter((meal) => meal.days.includes(day))
//       );

//       return {
//         day,
//         meals: selectedMeals
//           .filter((meal) => meal.days.includes(day))
//           .map((meal, i) => {
//             const mealId =
//               typeof meal.id === "string" ? meal.id : meal.id?._id || "";
//             return {
//               mealId,
//               name: meal.name || "Unnamed Meal",
//               calories: meal.calories || 0,
//               macros: meal.macros || { protein: null, carbs: null, fat: null },
//               mealType: meal.mealType || "Breakfast",
//               order: order + i,
//             };
//           }),
//       };
//     });

//     console.log("Payload Data Being Sent to Backend:", data);

//     if (mode === "create") {
//       onCreate({
//         planName,
//         days: data,
//         startDate,
//         endDate,
//         note,
//         color,
//       });
//     } else {
//       onUpdate(updateData.id, {
//         planName,
//         days: data,
//         startDate,
//         endDate,
//         note,
//         color,
//       });
//     }

//     resetFields();

//     setDialogOpen(false);
//   };

//   const resetFields = () => {
//     if (mode === "create") {
//       setPlanName("");
//       setSelectedMeals([]);
//       setStartDate(moment().format("yyyy-MM-DD"));
//       setEndDate(null);
//       setNote("");
//       setColor(colors[0].code);
//       setError({});
//     } else {
//       setPlanName(updateData?.planName || "");
//       setSelectedMeals(updateData ? parseSelectedMeals(updateData) : []);
//       setStartDate(updateData?.startDate || moment().format("yyyy-MM-DD"));
//       setEndDate(updateData?.endDate || null);
//       setNote(updateData?.note || "");
//       setColor(updateData?.color || colors[0].code);

//       setError({});
//     }
//   };

//   useEffect(() => {
//     if (dialogOpen) {
//       resetFields();
//     }
//   }, [dialogOpen]);

//   useEffect(() => {
//     if (Object.keys(error).length > 0) {
//       validate();
//     }
//   }, [selectedMeals, planName, startDate]);

//   useEffect(() => {
//     console.log("Meals prop passed to MealDialog:", meals);
//   }, [meals]);

//   return (
//     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//       <div className="contents" onClick={() => setDialogOpen(true)}>
//         {children}
//       </div>
//       <DialogContent className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-6">
//         <DialogTitle>
//           {mode === "create" ? "Create" : "Update"} Meal Plan
//         </DialogTitle>
//         <DialogDescription className="text-neutral-400 dark:text-neutral-500 font-light">
//           Please add meals to your plan
//         </DialogDescription>

//         {/* Plan Name Field */}
//         <div>
//           <Label>
//             Plan Name<sup className="text-red-500">*</sup>
//           </Label>
//           <Input
//             className="dark:border-none"
//             type="text"
//             placeholder="Enter plan name"
//             value={planName}
//             onChange={(e) => setPlanName(e.target.value)}
//           />
//           {error?.planName && (
//             <p className="text-red-500 text-sm mt-2">{error?.planName}</p>
//           )}
//         </div>

//         {/* Search Meals */}
//         <div className="flex flex-col gap-2 p-2 border dark:border-neutral-900 rounded-xl">
//           <Input
//             className="dark:border-none"
//             type="text"
//             placeholder="Search meals..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           {/* Meal Selection */}
//           <ScrollArea className="h-40 border dark:border-none p-2 dark:bg-neutral-900 rounded-xl shadow-lg overflow-y-visible pointer select-none">
//             {filteredMeals.length === 0 ? (
//               <div className="h-full flex items-center justify-center py-2 px-4">
//                 <span>No meals found</span>
//               </div>
//             ) : (
//               <>
//                 {" "}
//                 {filteredMeals.map((meal) => (
//                   <div
//                     key={meal.id}
//                     className="flex items-center justify-between py-2 px-4 hover:bg-violet-100 dark:hover:bg-neutral-950 rounded-lg cursor-pointer"
//                     onClick={() => toggleMealSelection(meal)}
//                   >
//                     <div className="flex items-center space-x-4 text-lg font-light">
//                       <Checkbox
//                         checked={selectedMeals.some((m) => m.id === meal.id)}
//                         onCheckedChange={() => toggleMealSelection(meal)}
//                       />
//                       <span>{meal.name}</span>
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//           </ScrollArea>
//         </div>

//         {/* Selected Meals */}
//         <div>
//           <h3 className="text-lg font-light dark:text-neutral-500 mb-2 select-none">
//             Selected Meals<sup className="text-red-500">*</sup>
//           </h3>
//           <ScrollArea className="h-60 p-2 border  dark:border-none dark:bg-neutral-900 rounded-xl shadow-lg overflow-y-visible pointer select-none">
//             {/* <ScrollArea className="min-h-40 max-h-[calc(100vh-800px)] shadow-lg p-2 rounded-xl border dark:border-none dark:bg-neutral-900"> */}
//             {selectedMeals?.length == 0 ? (
//               <div className="h-full flex justify-center items-center">
//                 <h4 className="dark:text-neutral-600">No workouts added</h4>
//               </div>
//             ) : (
//               <Reorder.Group
//                 axis="y"
//                 values={selectedMeals}
//                 onReorder={handleReorder}
//                 className="space-y-4"
//               >
//                 {selectedMeals.map((meal) => (
//                   <Reorder.Item
//                     key={`${meal.id}-${meal.days.join("-")}`} // Unique key based on mealId and days
//                     value={meal}
//                     className="flex flex-col gap-2 py-2 px-4 bg-neutral-50 shadow-lg border dark:border-neutral-800 hover:bg-violet-50 dark:bg-neutral-900 dark:hover:bg-neutral-950 rounded-lg mb-2"
//                   >
//                     <div className="flex justify-between items-center">
//                       <p className="font-base text-xl">{meal.name}</p>
//                       <div className="flex gap-6">
//                         <button
//                           className="text-rose-500"
//                           onClick={() => toggleMealSelection(meal)}
//                         >
//                           <Trash2Icon size={20} />
//                         </button>{" "}
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <Input
//                           type="text"
//                           placeholder="Meal Type (e.g., Breakfast)"
//                           value={meal.mealType}
//                           onChange={(e) =>
//                             handleMealTypeChange(meal.id, e.target.value)
//                           }
//                         />
//                         <DaySelector
//                           value={[...meal?.days]}
//                           onChange={(value) =>
//                             handleMealDayChange(meal.id, value)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </Reorder.Item>
//                 ))}
//               </Reorder.Group>
//             )}
//           </ScrollArea>
//           {error?.meals && (
//             <p className="text-red-500 text-sm mt-2">{error?.meals}</p>
//           )}
//         </div>

//         {/* Note Field */}
//         <div>
//           <h3 className="text-lg font-light mb-2">Note</h3>
//           <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
//         </div>

//         {/* Start Date, End Date, and Color Selection */}
//         <div className="flex flex-col gap-4 sm:flex-row mt-4">
//           <fieldset>
//             <Label>
//               Start Date<sup className="text-red-500">*</sup>
//             </Label>
//             <Input
//               type="date"
//               value={startDate}
//               onChange={(e) =>
//                 setStartDate(moment(e.target.value).format("yyyy-MM-DD"))
//               }
//             />
//             {error?.startDate && (
//               <p className="text-red-500 text-sm mt-2">{error?.startDate}</p>
//             )}
//           </fieldset>
//           <fieldset>
//             <Label>End Date</Label>
//             <Input
//               type="date"
//               value={endDate ? moment(endDate).format("yyyy-MM-DD") : ""}
//               onChange={(e) =>
//                 setEndDate(moment(e.target.value).format("yyyy-MM-DD"))
//               }
//             />
//           </fieldset>
//           <fieldset>
//             <Label>
//               Color<sup className="text-red-500">*</sup>
//             </Label>
//             <br />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className=" border dark:border-none dark:bg-neutral-900 rounded-lg p-2">
//                   <div
//                     className="w-8 h-8 rounded-full"
//                     style={{ backgroundColor: color }}
//                   ></div>
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white ">
//                 {colors.map((c) => (
//                   <DropdownMenuItem
//                     className="flex items-center gap-2 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
//                     key={`${c.code}-${updateData?.id || Date()}-color-picker`}
//                     onClick={() => setColor(c.code)}
//                   >
//                     <div
//                       className="w-4 h-4 rounded-full"
//                       style={{ backgroundColor: c.code }}
//                     ></div>
//                     <p>{c.name}</p>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {error?.color && (
//               <p className="text-red-500 text-sm mt-2">{error?.color}</p>
//             )}
//           </fieldset>
//         </div>

//         {/* Submit Button */}
//         <Button variant="primary" onClick={handleSubmit}>
//           {mode === "create" ? "Create" : "Update"} Meal Plan
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// };

// const DaySelector = ({ value = [], onChange = () => {} }) => {
//   const [error, setError] = useState(null);
//   let days = [
//     { Monday: "M" },
//     { Tuesday: "T" },
//     { Wednesday: "W" },
//     { Thursday: "Th" },
//     { Friday: "F" },
//     { Saturday: "S" },
//     { Sunday: "Su" },
//   ];

//   days = days.map((day) => {
//     let selected = value.includes(Object.keys(day)[0]);
//     return { ...day, selected };
//   });

//   const handleChange = (day) => {
//     let isSelected = days.find((d) => Object.keys(d)[0] === day).selected;
//     let newDays;
//     if (isSelected) {
//       if (value.length === 1) {
//         // toast.error("At least one day is required");
//         setError("At least one day is required");
//       } else {
//         newDays = days
//           .filter((d) => d.selected && Object.keys(d)[0] !== day)
//           .map((d) => Object.keys(d)[0]);
//         onChange(newDays);
//       }
//     } else {
//       newDays = [...value, day];
//       onChange(newDays);
//     }
//   };

//   useEffect(() => {
//     if (value.length >= 1) {
//       setError(null);
//     }
//   }, [value]);

//   return (
//     <div>
//       <ul className="flex gap-2">
//         {days.map((day) => (
//           <li
//             className={cn(
//               "border border-violet-500 text-violet-500 rounded-full text-sm font-light h-8 w-8 flex justify-center items-center",
//               day.selected && "bg-violet-500 text-white"
//             )}
//             key={`${Object.keys(day)}-selector`}
//             onClick={() => handleChange(Object.keys(day)[0])}
//           >
//             {day[Object.keys(day)[0]]}
//           </li>
//         ))}
//       </ul>
//       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//     </div>
//   );
// };
