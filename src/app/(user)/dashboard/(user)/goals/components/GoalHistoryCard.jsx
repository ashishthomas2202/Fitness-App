import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GoalHistoryCard({ userId }) {
    const [goalHistory, setGoalHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today

    const fetchGoalHistory = async (date) => {
        if (!userId) {
            console.warn("No userId provided for fetching goal history.");
            return;
        }

        try {
            setIsLoading(true);
            console.log(`Fetching history for date: ${date.toISOString().split("T")[0]}`);
            const response = await axios.get("/api/goals/get-history", {
                params: {
                    userId,
                    from: date.toISOString().split("T")[0],
                    to: date.toISOString().split("T")[0],
                },
            });
            console.log("Fetched goal history:", response.data.data);
            setGoalHistory(response.data.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching goal history:", error);
            setError("Failed to load goal history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoalHistory(selectedDate);
    }, [selectedDate, userId]);

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setSelectedDate(newDate);
    };

    return (
        <div className="goal-history mt-12 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                Goal History
            </h2>

            {/* Date Picker */}
            <div className="mb-6">
                <label
                    htmlFor="history-date"
                    className="block text-lg font-medium text-gray-600 dark:text-gray-300 mb-2"
                >
                    Select Date
                </label>
                <input
                    type="date"
                    id="history-date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="p-3 w-full border rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <style>
                    {`
            #history-date::-webkit-calendar-picker-indicator {
              filter: invert(0); /* Light mode default */
            }

            .dark #history-date::-webkit-calendar-picker-indicator {
              filter: invert(1); /* Turn icon white in dark mode */
            }
          `}
                </style>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Loading goal history...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : goalHistory.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">
                    No goal history available for this date.
                </p>
            ) : (
                <div className="grid gap-6">
                    {goalHistory.map((entry, index) => (
                        <div
                            key={entry.id || index}
                            className="flex flex-col p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-md"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {entry.name}
                                </p>
                                <span
                                    className={`text-xs font-semibold px-3 py-1 rounded ${entry.isCompleted
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        }`}
                                >
                                    {entry.isCompleted ? "Completed" : "Incomplete"}
                                </span>
                            </div>
                            <div className="mt-3 text-gray-600 dark:text-gray-400">
                                <p>
                                    <strong>Progress:</strong> {entry.progress} / {entry.target}
                                </p>
                                <p>
                                    <strong>Completed On:</strong>{" "}
                                    {new Date(entry.completedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}