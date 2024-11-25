"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/Scroll-area";
import axios from "axios";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import moment from "moment-timezone";
import { cn } from "@/lib/utils";


export const CreateMealPlanCard = ({ onCreate = () => { }, data }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [planName, setPlanName] = useState(data?.planName || "");
    const [meals, setMeals] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [search, setSearch] = useState("");
    const [note, setNote] = useState(data?.note || "");
    const [startDate, setStartDate] = useState(
        data?.startDate || moment().format("yyyy-MM-DD")
    );
    const [endDate, setEndDate] = useState(data?.endDate || null);
    const [error, setError] = useState({});

    const fetchMeals = async () => {
        return await axios
            .get("/api/meals")
            .then((response) => {
                if (response?.data?.success) {
                    setMeals(response?.data?.data || []);
                    return response?.data?.data || [];
                }
                return [];
            })
            .catch((error) => {
                return [];
            });
    };

    const toggleMealSelection = (meal) => {
        if (selectedMeals.some((m) => m.id === meal.id)) {
            // Remove the meal if already selected
            setSelectedMeals((prev) => prev.filter((m) => m.id !== meal.id));
        } else {
            // Add the meal to the selection
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
                    mealType: "Breakfast", // Default meal type
                },
            ]);
        }
    };

    const handleMealTypeChange = (id, value) => {
        setSelectedMeals((prev) =>
            prev.map((meal) => (meal.id === id ? { ...meal, mealType: value } : meal))
        );
    };

    const handleMealDayChange = (id, value) => {
        setSelectedMeals((prev) =>
            prev.map((meal) =>
                meal.id === id ? { ...meal, days: value } : meal
            )
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
        setError(errors);
        return Object.keys(errors).length !== 0;
    };

    const handleCreateMealPlan = () => {
        if (validate()) {
            return;
        }


        const distinctDays = [
            ...new Set(selectedMeals.map((meal) => meal.days).flat()),
        ];

        const data = distinctDays.map((day) => {
            let order = 0;
            return {
                day,
                meals: selectedMeals
                    .filter((meal) => meal.days.includes(day))
                    .map((meal, i) => {
                        const { days, id, mealType, ...rest } = meal;
                        return { mealId: id, order: order + i, mealType };
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
        setSelectedMeals([]);
        setStartDate(moment().format("yyyy-MM-DD"));
        setEndDate(null);
        setNote("");
        setError({});
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    useEffect(() => {
        if (Object.keys(error).length > 0) {
            validate();
        }
    }, [selectedMeals, planName, startDate]);

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
                        Create Meal Plan
                    </h3>
                </CardContent>
            </Card>
            {/* </DialogTrigger> */}

            <DialogContent className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg p-6">
                <DialogTitle>Create Meal Plan</DialogTitle>
                <DialogDescription className="text-neutral-400 dark:text-neutral-500 font-light">
                    Add meals to your plan
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
                    {error.planName && (
                        <p className="text-red-500 text-sm mt-2">{error.planName}</p>
                    )}
                </div>
                <Input
                    className="dark:border-none"
                    type="text"
                    placeholder="Search meals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <ScrollArea className="h-40 border dark:border-none p-2 dark:bg-neutral-900 rounded-xl shadow-lg overflow-y-visible pointer select-none">
                    {filteredMeals.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-2 px-4">
                            <span>No meals found</span>
                        </div>
                    ) : (
                        <>
                            {" "}
                            {filteredMeals.map((meal) => (
                                <div
                                    key={meal.id}
                                    className="flex items-center justify-between py-2 px-4 hover:bg-violet-100 dark:hover:bg-neutral-950 rounded-lg cursor-pointer"
                                    onClick={() => toggleMealSelection(meal)}
                                >
                                    <div className="flex items-center space-x-4 text-lg font-light">
                                        <Checkbox
                                            checked={selectedMeals.some(
                                                (m) => m.id === meal.id
                                            )}
                                            onCheckedChange={() => toggleMealSelection(meal)}
                                        />
                                        <span>{meal.name}</span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </ScrollArea>

                <div>
                    {/* Selected Meals */}
                    <h3 className="text-lg font-light dark:text-neutral-500 mb-2 select-none">
                        Selected Meals<sup className="text-red-500">*</sup>
                    </h3>
                    <ScrollArea className="h-60 p-2 border  dark:border-none dark:bg-neutral-900 rounded-xl shadow-lg overflow-y-visible pointer select-none">
                        {selectedMeals.length === 0 ? (
                            <div className="h-full flex justify-center items-center">
                                <h4 className="dark:text-neutral-600">No Meals added</h4>
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
                                        key={meal.id}
                                        value={meal}
                                        className="flex flex-col gap-2 py-2 px-4 bg-neutral-50 shadow-lg border dark:border-neutral-800 hover:bg-violet-50 dark:bg-neutral-900 dark:hover:bg-neutral-950 rounded-lg mb-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="font-base text-xl">{meal.name}</p>
                                            <div className="flex gap-6">
                                                <button
                                                    className="text-rose-500"
                                                    onClick={() => toggleMealSelection(meal)}
                                                >
                                                    <Trash2Icon size={20} />
                                                </button>
                                            </div>
                                            <div className="flex gap-4">
                                                <Input
                                                    type="text"
                                                    placeholder="Meal Type"
                                                    value={meal.mealType}
                                                    onChange={(e) =>
                                                        handleMealTypeChange(meal.id, e.target.value)
                                                    }
                                                />
                                                <DaySelector
                                                    value={meal.days}
                                                    onChange={(value) => handleMealDayChange(meal.id, value)}
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

                <Button variant="primary" onClick={handleCreateMealPlan}>
                    Create Meal Plan
                </Button>
            </DialogContent>
        </Dialog>
    );
};

const DaySelector = ({ value = [], onChange = () => { } }) => {
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