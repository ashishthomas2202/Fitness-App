import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Calendar component to show meal plan events
const MealCalendar = ({ mealPlan }) => {
    // Map mealPlan data to calendar events
    const events = mealPlan.map((plan) => ({
        title: `${plan.meal?.name || "Meal"} (${plan.mealType})`,
        start: new Date(plan.date),
        end: new Date(plan.date),
    }));

    return (
        <div style={{ height: 500 }}>
            <Calendar
                localizer={localizer}
                events={events}
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
