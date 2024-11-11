"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { PenIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";
import axios from "axios";

import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/Label";
import moment from "moment-timezone";

export const CreateWorkoutPlanCard = ({ onCreate = () => {}, data }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [note, setNote] = useState(data?.note || "");
  const [startDate, setStartDate] = useState(
    data?.startDate || moment().format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(data?.endDate || null);
  const [error, setError] = useState({});

  const fetchWorkouts = async () => {
    return await axios
      .get("/api/workouts")
      .then((response) => {
        if (response?.data?.success) {
          setWorkouts(response?.data?.data || []);
          return response?.data?.data || [];
        }
        return [];
      })
      .catch((error) => {
        return [];
      });
  };

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
    setError(errors);
    return Object.keys(errors).length !== 0;
  };

  const handleCreateWorkoutPlan = () => {
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
    onCreate({
      planName,
      days: data,
      startDate,
      endDate,
      note,
    });

    resetFields();

    setDialogOpen(false);
  };

  const resetFields = () => {
    setPlanName("");
    setSelectedWorkouts([]);
    setStartDate(moment().format("yyyy-MM-DD"));
    setEndDate(null);
    setNote("");
    setError({});
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (Object.keys(error).length > 0) {
      validate();
    }
  }, [selectedWorkouts, planName, startDate]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* <DialogTrigger> */}
      <Card
        className="p-2 min-h-52 justify-center cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <CardContent className="flex flex-col gap-2 justify-center items-center py-0">
          <PlusCircleIcon size={60} />
          <h3 className="text-xl font-light select-none">
            Create Workout Plan
          </h3>
        </CardContent>
      </Card>
      {/* </DialogTrigger> */}

      <DialogContent className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-6">
        <DialogTitle>Create Workout Plan</DialogTitle>
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
              value={startDate}
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
        </div>

        <Button variant="primary" onClick={handleCreateWorkoutPlan}>
          Create Workout Plan
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
