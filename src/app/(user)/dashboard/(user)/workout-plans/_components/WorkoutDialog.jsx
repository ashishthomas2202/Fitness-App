"use client";
import { useEffect, useState } from "react";
import { PenIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import moment from "moment-timezone";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const parseSelectedWorkouts = (data) => {
  let distinctWorkouts = [];

  data.days.forEach((day) => {
    day.workouts.forEach((workout) => {
      const existingWorkout = distinctWorkouts.find(
        (w) => w.id === workout.workoutId._id
      );

      if (!existingWorkout) {
        distinctWorkouts.push({
          id: workout.workoutId._id,
          name: workout.workoutId.name,
          custom: {
            sets: workout.sets,
            reps: workout.reps,
            durationMin: workout.durationMin,
          },
          days: [day.day],
          isEditing: false,
          useDuration: workout.durationMin !== null,
        });
      } else {
        existingWorkout.days.push(day.day);
      }
    });
  });

  return distinctWorkouts;
};

export const WorkoutDialog = ({
  children,
  onCreate = () => {},
  onUpdate = () => {},
  workouts = [],
  data: updateData,
  mode = "create", // create or update
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planName, setPlanName] = useState(updateData?.planName || "");
  const [selectedWorkouts, setSelectedWorkouts] = useState(
    updateData ? parseSelectedWorkouts(updateData) : []
  );

  const [search, setSearch] = useState("");
  const [note, setNote] = useState(updateData?.note || "");
  const [startDate, setStartDate] = useState(
    updateData?.startDate || moment().format("yyyy-MM-DD")
  );
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

  const createNewWorkout = async () => {
    console.log("Create new workout");
  };

  const toggleWorkoutSelection = (workout) => {
    if (selectedWorkouts.some((w) => w.id === workout.id)) {
      setSelectedWorkouts((prev) => prev.filter((w) => w.id !== workout.id));
    } else {
      setSelectedWorkouts((prev) => [
        ...prev,
        {
          ...workout,
          custom: {
            sets: null,
            reps: null,
            durationMin: null,
          },
          days: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          isEditing: false,
        },
      ]);
    }
  };

  const toggleEditMode = (id) => {
    setSelectedWorkouts((prev) =>
      prev.map((workout) => {
        let isEditing = !workout.isEditing;
        let custom = isEditing
          ? { sets: 1, reps: 1, durationMin: null }
          : { sets: null, reps: null, durationMin: null };

        return workout.id === id
          ? { ...workout, isEditing: isEditing, custom: custom }
          : workout;
      })
    );
  };

  const handleToggleMode = (id) => {
    setSelectedWorkouts((prev) =>
      prev.map((workout) => {
        let useDuration = !workout.useDuration;
        let custom = useDuration
          ? { durationMin: 1, sets: null, reps: null }
          : { sets: 1, reps: 1, durationMin: null };
        return workout.id === id
          ? { ...workout, useDuration: useDuration, custom: custom }
          : workout;
      })
    );
  };

  const handleWorkoutChange = (id, field, value) => {
    setSelectedWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === id
          ? {
              ...workout,
              custom: { ...workout.custom, [field]: Number(value) },
            }
          : workout
      )
    );
  };

  const handleWorkoutDayChange = (id, value) => {
    setSelectedWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === id ? { ...workout, days: value } : workout
      )
    );
  };

  const handleReorder = (newOrder) => {
    setSelectedWorkouts(
      newOrder.map((workout, index) => ({ ...workout, order: index + 1 }))
    );
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    let errors = {};
    if (!planName) {
      errors.planName = "Plan name is required";
    }
    if (!startDate || startDate == "Invalid date") {
      errors.startDate = "Start date is required";
    }
    if (selectedWorkouts.length == 0) {
      errors.workouts = "At least one workout is required";
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

    const distinctDays = [
      ...new Set(selectedWorkouts.map((workout) => workout.days).flat()),
    ];

    const data = distinctDays.map((day) => {
      let order = 0;
      return {
        day,
        workouts: selectedWorkouts
          .filter((workout) => workout.days.includes(day))
          .map((workout, i) => {
            const { isEditing, days, custom, id, ...rest } = workout;
            return { workoutId: id, order: order + i, ...custom };
          }),
      };
    });

    if (mode === "create") {
      onCreate({
        planName,
        days: data,
        startDate,
        endDate,
        note,
        color,
      });
      // resetFields();
    } else {
      onUpdate(updateData.id, {
        planName,
        days: data,
        startDate,
        endDate,
        note,
        color,
      });
    }

    setDialogOpen(false);
  };

  const resetFields = () => {
    if (mode === "create") {
      setPlanName("");
      setSelectedWorkouts([]);
      setStartDate(moment().format("yyyy-MM-DD"));
      setEndDate(null);
      setNote("");
      setColor(colors[0].code);
      setError({});
    } else {
      setPlanName(updateData?.planName || "");
      setSelectedWorkouts(updateData ? parseSelectedWorkouts(updateData) : []);
      setStartDate(updateData?.startDate || moment().format("yyyy-MM-DD"));
      setEndDate(updateData?.endDate || null);
      setNote(updateData?.note || "");
      setColor(updateData?.color || colors[0].code);

      setError({});
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      resetFields();
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      validate();
    }
  }, [selectedWorkouts, planName, startDate]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="contents" onClick={() => setDialogOpen(true)}>
        {children}
      </div>
      <DialogContent className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-6">
        <DialogTitle>
          {mode == "create" ? "Create" : "Update"} Workout Plan
        </DialogTitle>
        <DialogDescription className="text-neutral-400 dark:text-neutral-500 font-light">
          Please add workout to your plan
        </DialogDescription>

        <div>
          <Label>
            Plan Name<sup className="text-red-500">*</sup>
          </Label>
          <Input
            className="dark:border-none"
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
            className="dark:border-none"
            type="text"
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ScrollArea className="h-40 border dark:border-none p-2 dark:bg-neutral-900 rounded-xl shadow-lg overflow-y-visible pointer select-none">
            {filteredWorkouts.length == 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-2 px-4">
                <span>No workout found</span>
                <span
                  className="mt-2 text-violet-500 cursor-pointer"
                  onClick={createNewWorkout}
                >
                  Create your own Workout
                </span>
              </div>
            ) : (
              <>
                {" "}
                {filteredWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between py-2 px-4 hover:bg-violet-100 dark:hover:bg-neutral-950 rounded-lg cursor-pointer"
                    onClick={() => toggleWorkoutSelection(workout)}
                  >
                    <div className="flex items-center space-x-4 text-lg font-light">
                      <Checkbox
                        checked={selectedWorkouts.some(
                          (w) => w.id === workout.id
                        )}
                        onCheckedChange={() => toggleWorkoutSelection(workout)}
                      />
                      <span>{workout.name}</span>
                    </div>
                  </div>
                ))}
                <div
                  className="flex items-center justify-between py-2 px-4 text-violet-500 hover:bg-violet-100 dark:hover:bg-neutral-950 cursor-pointer"
                  onClick={createNewWorkout}
                >
                  <div className="flex items-center space-x-4 text-lg font-light">
                    <span>Create your own workout</span>
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </div>

        <div>
          {/* Selected Workouts */}
          <h3 className="text-lg font-light dark:text-neutral-500 mb-2 select-none">
            Selected Workouts<sup className="text-red-500">*</sup>
          </h3>
          <ScrollArea className="h-60 p-2 border  dark:border-none dark:bg-neutral-900 rounded-xl shadow-lg overflow-y-visible pointer select-none">
            {/* <ScrollArea className="min-h-40 max-h-[calc(100vh-800px)] shadow-lg p-2 rounded-xl border dark:border-none dark:bg-neutral-900"> */}
            {selectedWorkouts?.length == 0 ? (
              <div className="h-full flex justify-center items-center">
                <h4 className="dark:text-neutral-600">No workouts added</h4>
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={selectedWorkouts}
                onReorder={handleReorder}
                className="space-y-4"
              >
                {selectedWorkouts.map((workout) => (
                  <Reorder.Item
                    key={workout.id}
                    value={workout}
                    className="flex flex-col gap-2 py-2 px-4 bg-neutral-50 shadow-lg border dark:border-neutral-800 hover:bg-violet-50 dark:bg-neutral-900 dark:hover:bg-neutral-950 rounded-lg mb-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-base text-xl">{workout.name}</p>
                      <div className="flex gap-6">
                        <button
                          className="text-violet-400"
                          onClick={() => toggleEditMode(workout.id)}
                          aria-label="Customize workout"
                        >
                          <PenIcon size={20} />
                        </button>
                        <button
                          className="text-rose-500"
                          onClick={() => toggleWorkoutSelection(workout)}
                        >
                          <Trash2Icon size={20} />
                        </button>
                      </div>
                    </div>
                    <DaySelector
                      value={[...workout?.days]}
                      onChange={(value) =>
                        handleWorkoutDayChange(workout.id, value)
                      }
                    />

                    {workout.isEditing && (
                      <div className="space-x-4 mt-2">
                        <div className="flex justify-center items-center gap-2">
                          <h4>Sets/Reps</h4>
                          <Switch
                            checked={workout.useDuration}
                            onCheckedChange={() => handleToggleMode(workout.id)}
                          />
                          <h4>Duration</h4>
                        </div>
                        {workout.useDuration ? (
                          <div>
                            <label>Duration (min):</label>
                            <Input
                              className="bg-white"
                              type="number"
                              min={1}
                              value={workout.custom.durationMin || 1}
                              onChange={(e) =>
                                handleWorkoutChange(
                                  workout.id,
                                  "durationMin",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ) : (
                          <>
                            <div>
                              <label>Sets:</label>
                              <Input
                                className="bg-white"
                                type="number"
                                min={1}
                                value={workout.custom.sets || 1}
                                onChange={(e) =>
                                  handleWorkoutChange(
                                    workout.id,
                                    "sets",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label>Reps:</label>
                              <Input
                                className="bg-white"
                                type="number"
                                min={1}
                                value={workout.custom.reps || 1}
                                onChange={(e) =>
                                  handleWorkoutChange(
                                    workout.id,
                                    "reps",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </ScrollArea>
          {error?.workouts && (
            <p className="text-red-500 text-sm mt-2">{error?.workouts}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-light dark:text-neutral-500 mb-2 select-none">
            Note
          </h3>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row ">
          <fieldset>
            <Label>
              Start Date<sup className="text-red-500">*</sup>
            </Label>
            <Input
              type="date"
              value={moment(startDate).format("yyyy-MM-DD")}
              onChange={(e) =>
                setStartDate(moment(e.target.value).format("yyyy-MM-DD"))
              }
              required
            />
            {error?.startDate && (
              <p className="text-red-500 text-sm mt-2">{error?.startDate}</p>
            )}
          </fieldset>
          <fieldset>
            <Label>End Date</Label>
            <Input
              type="date"
              value={moment(endDate).format("yyyy-MM-DD") || ""}
              onChange={(e) =>
                setEndDate(moment(e.target.value).format("yyyy-MM-DD"))
              }
            />
          </fieldset>

          <fieldset>
            <Label>
              Color<sup className="text-red-500">*</sup>
            </Label>
            <br />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className=" border dark:border-none dark:bg-neutral-900 rounded-lg p-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white ">
                {colors.map((c) => (
                  <DropdownMenuItem
                    className="flex items-center gap-2 dark:hover:bg-neutral-900 dark:hover:text-white cursor-pointer"
                    key={`${c.code}-${updateData?.id || Date()}-color-picker`}
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
          {mode == "create" ? "Create" : "Update"} Workout Plan
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const DaySelector = ({ value = [], onChange = () => {} }) => {
  const [error, setError] = useState(null);
  let days = [
    { Monday: "M" },
    { Tuesday: "T" },
    { Wednesday: "W" },
    { Thursday: "Th" },
    { Friday: "F" },
    { Saturday: "S" },
    { Sunday: "Su" },
  ];

  days = days.map((day) => {
    let selected = value.includes(Object.keys(day)[0]);
    return { ...day, selected };
  });

  const handleChange = (day) => {
    let isSelected = days.find((d) => Object.keys(d)[0] === day).selected;
    let newDays;
    if (isSelected) {
      if (value.length === 1) {
        // toast.error("At least one day is required");
        setError("At least one day is required");
      } else {
        newDays = days
          .filter((d) => d.selected && Object.keys(d)[0] !== day)
          .map((d) => Object.keys(d)[0]);
        onChange(newDays);
      }
    } else {
      newDays = [...value, day];
      onChange(newDays);
    }
  };

  useEffect(() => {
    if (value.length >= 1) {
      setError(null);
    }
  }, [value]);

  return (
    <div>
      <ul className="flex gap-2">
        {days.map((day) => (
          <li
            className={cn(
              "border border-violet-500 text-violet-500 rounded-full text-sm font-light h-8 w-8 flex justify-center items-center",
              day.selected && "bg-violet-500 text-white"
            )}
            key={`${Object.keys(day)}-selector`}
            onClick={() => handleChange(Object.keys(day)[0])}
          >
            {day[Object.keys(day)[0]]}
          </li>
        ))}
      </ul>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
