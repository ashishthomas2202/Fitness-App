import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const MealCalendar = ({ mealPlan }) => {
    console.log("Meal plan received:", mealPlan); // Check if future dates are correct here

    return (
        <div style={{ height: 500 }}>
            <Calendar
                localizer={localizer}
                events={mealPlan}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                views={["month", "week", "day"]}
                popup={true}
            />
        </div>
    );
};

export default MealCalendar;
