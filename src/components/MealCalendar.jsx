import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const MealCalendar = ({ mealPlan }) => {
    const events = mealPlan.flatMap((plan) => {
        if (!plan.meals || plan.meals.length === 0) {
            console.error("No meals found for plan:", plan);
            return [];
        }

        return plan.meals.map((meal) => {
            const mealDate = new Date(meal.date); // Now, it should be a valid ISO string

            if (isNaN(mealDate.getTime())) {
                console.error("Invalid date for meal:", meal);
                return null;
            }

            return {
                title: `${meal.name} (${meal.mealType})`,
                start: mealDate,
                end: mealDate,
                allDay: true,
            };
        }).filter(event => event !== null);
    });

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
