//src/app/(user)/dashboard/(user)/goals/components/GoalHistoryCard.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Filters Component
function GoalHistoryFilters({ onFilterChange }) {
    const [filters, setFilters] = useState({
        dateRange: { from: "", to: "" },
        goalType: "",
        status: "",
    });

    const handleFilterChange = () => {
        onFilterChange({
            ...filters,
            dateRange: {
                from: filters.dateRange.from || null,
                to: filters.dateRange.to || null,
            },
        });
    };

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, from: e.target.value },
                    })
                }
                className="border rounded p-2 w-full"
                placeholder="From Date"
            />
            <input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        dateRange: { ...filters.dateRange, to: e.target.value },
                    })
                }
                className="border rounded p-2 w-full"
                placeholder="To Date"
            />
            <select
                value={filters.goalType}
                onChange={(e) => setFilters({ ...filters, goalType: e.target.value })}
                className="border rounded p-2 w-full"
            >
                <option value="">All Goals</option>
                <option value="Calorie Intake">Calorie Intake</option>
                <option value="Steps">Steps</option>
                <option value="Water Intake">Water Intake</option>
            </select>
            <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded p-2 w-full"
            >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Not Completed">Not Completed</option>
            </select>
            <button
                onClick={handleFilterChange}
                className="bg-indigo-600 text-white px-4 py-2 rounded sm:col-span-1 md:col-span-4"
            >
                Apply Filters
            </button>
        </div>
    );
}

// Goal Details Modal
function GoalDetailsModal({ entry, onClose, onSaveNotes }) {
    const [notes, setNotes] = useState(entry?.notes || "");

    const handleSaveNotes = () => {
        if (!entry?.id) {
            console.error("Entry ID is undefined");
            return;
        }
        onSaveNotes(entry.id, notes); // Save notes for the entry
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Daily Goal Summary</h2>
                <p>
                    <strong>Date:</strong> {entry.date ? formatDate(entry.date) : "Invalid Date"}
                </p>
                <p className="mb-4">
                    <strong>Status:</strong>{" "}
                    {entry.goals.every((goal) => goal.isCompleted) ? (
                        <span className="text-green-600">All Goals Completed ✅</span>
                    ) : (
                        <span className="text-red-600">Some Goals Incomplete ❌</span>
                    )}
                </p>
                <textarea
                    placeholder="Add notes for this day..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded p-2"
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveNotes}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Save Notes
                    </button>
                </div>
            </div>
        </div>
    );
}

const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const localDate = new Date(dateString);
    if (isNaN(localDate)) return "Invalid Date";
    return localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

// Main Goal History Component
export default function GoalHistory({ userId, onRefreshHistory }) {
    const [goalHistory, setGoalHistory] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const fetchGoalHistory = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get("/api/goals/get-history", {
                params: {
                    userId,
                    from: filters.dateRange?.from,
                    to: filters.dateRange?.to,
                },
            });

            console.log("Fetched goal history:", response.data.data); // Debugging statement
            setGoalHistory(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch goal history:", error);
        }
    }, [userId]);


    const handleSaveNotes = async (entryId, notes) => {
        if (!entryId) {
            console.error("Entry ID is undefined");
            return;
        }

        try {
            console.log("Sending to API:", { entryId, notes });
            const response = await axios.put("/api/goals/add-history", { entryId, notes });
            console.log("API response:", response.data);

            fetchGoalHistory(); // Refresh history
        } catch (error) {
            console.error("Failed to save notes:", error);
        }
    };



    const handleEntryClick = (entry) => {
        if (!entry || !entry.id) {
            console.error("Invalid entry clicked", entry);
            return;
        }
        setSelectedEntry(entry);
    };

    const handleFilterChange = (filters) => {
        fetchGoalHistory(filters);
    };

    useEffect(() => {
        if (onRefreshHistory) {
            onRefreshHistory(fetchGoalHistory);
        }
    }, [fetchGoalHistory, onRefreshHistory]);

    useEffect(() => {
        if (userId) fetchGoalHistory();
    }, [userId]);

    return (
        <div className="mt-8 px-6 py-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Goal History</h2>
            <GoalHistoryFilters onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 gap-4">
                {goalHistory.length === 0 ? (
                    <p className="text-center text-gray-500">No goal history recorded yet.</p>
                ) : (
                    goalHistory.map((entry) => (
                        <div
                            key={entry.id}
                            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                            onClick={() => handleEntryClick(entry)}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">
                                {entry.date ? formatDate(entry.date) : "Invalid Date"}
                            </h3>
                            <ul className="mt-2">
                                {entry.goals.map((goal) => (
                                    <li
                                        key={goal._id}
                                        className="flex justify-between items-center text-sm text-gray-600"
                                    >
                                        <span>
                                            {goal.name}: {goal.progress}/{goal.target}
                                        </span>
                                        <span>
                                            {goal.isCompleted ? (
                                                <i className="text-green-500 fas fa-check-circle"></i>
                                            ) : (
                                                <i className="text-red-500 fas fa-times-circle"></i>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
            {selectedEntry && (
                <GoalDetailsModal
                    entry={selectedEntry}
                    onSaveNotes={handleSaveNotes}
                    onClose={() => setSelectedEntry(null)}
                />
            )}
        </div>
    );
}
