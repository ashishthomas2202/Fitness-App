"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-toastify";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function WeightTracker() {
    const [weightHistory, setWeightHistory] = useState([]);
    const [dailyWeight, setDailyWeight] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date

    // Fetch weight history data
    const fetchWeightHistory = async () => {
        try {
            const response = await axios.get("/api/goals/weight-history");
            setWeightHistory(response.data.weightHistory || []);
        } catch (error) {
            toast.error("Failed to fetch weight history.");
        }
    };

    // Fetch weight for a specific date
    const fetchWeightForDate = async (date) => {
        try {
            const response = await axios.get("/api/goals/weight-history", {
                params: { date },
            });
            setDailyWeight(response.data.weight || "");
        } catch (error) {
            setDailyWeight("");
            toast.info("No weight logged for this date.");
        }
    };

    // Submit daily weight
    const handleAddWeight = async () => {
        if (!dailyWeight || isNaN(dailyWeight)) {
            toast.error("Please enter a valid weight.");
            return;
        }

        try {
            const response = await axios.post("/api/goals/add-weight", {
                weight: parseFloat(dailyWeight),
                date: selectedDate,
            });
            setDailyWeight("");
            setWeightHistory(response.data.weightHistory); // Update the weight history
            toast.success("Weight added successfully!");
        } catch (error) {
            toast.error("Failed to add weight.");
        }
    };

    // Update weight when date changes
    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchWeightForDate(date);
    };

    useEffect(() => {
        fetchWeightHistory();
    }, []);

    // Prepare data for the chart
    const chartData = {
        labels: weightHistory.map((entry) =>
            new Date(entry.date).toLocaleDateString()
        ),
        datasets: [
            {
                label: "Weight (lbs)",
                data: weightHistory.map((entry) => entry.weight),
                borderColor: "#4CAF50",
                backgroundColor: "#A5D6A7",
                fill: true,
            },
        ],
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Weight Tracker</h2>
            <div className="flex items-center mb-4 space-x-2">
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <Input
                    type="number"
                    placeholder="Enter weight"
                    value={dailyWeight}
                    onChange={(e) => setDailyWeight(e.target.value)}
                />
                <Button onClick={handleAddWeight}>Add Weight</Button>
            </div>
            <Line data={chartData} />
        </div>
    );
}
