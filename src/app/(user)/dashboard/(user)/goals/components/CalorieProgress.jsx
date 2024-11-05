// src/components/CalorieProgress.jsx
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CalorieProgress = ({ currentCalories, calorieGoal }) => {
    const percentage = (currentCalories / calorieGoal) * 100;

    return (
        <div style={{ width: "200px", textAlign: "center" }}>
            <h3>Calorie Goal</h3>
            <CircularProgressbar
                value={percentage}
                text={`${currentCalories} / ${calorieGoal} kCal`}
                styles={buildStyles({
                    pathColor: "#ff6f00",
                    textColor: "#333",
                    trailColor: "#eee",
                })}
            />
        </div>
    );
};

export default CalorieProgress;
