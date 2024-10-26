/**
 * ## Calendar Items Array Documentation
 *
 * The `items` array contains events with different types such as one-time and recurring events.
 * Each event must follow this structure:
 *
 * @typedef {Object} CalendarItem
 * @property {string} name - The name or title of the event. (Required)
 * @property {string} color - The hex color code of the event. (Required)
 * @property {string} [date] - The exact date for one-time events in the format "YYYY-MM-DD".
 * @property {string} [repeat] - Specifies the recurrence type: "daily", "weekly", "monthly".
 * @property {Array<string>} [days] - Days of the week for weekly events (e.g., ["Monday", "Wednesday"]).
 * @property {number} [day] - The specific day of the month for monthly events (e.g., 15).
 * @property {string} [start] - The start date for the recurring event in the format "YYYY-MM-DD".
 * @property {string} [end] - The end date for the recurring event in the format "YYYY-MM-DD".
 *
 * ## Examples
 *
 * ### One-Time Event:
 * { date: "2024-12-25", name: "Christmas", color: "#ef4444" }
 *
 * ### Daily Recurring Event:
 * { repeat: "daily", name: "Daily Exercise", color: "#34d399", start: "2024-10-01" }
 *
 * ### Weekly Recurring Event on Specific Days:
 * {
 *   repeat: "weekly",
 *   days: ["Tuesday", "Thursday"],
 *   name: "Yoga Class",
 *   color: "#10b981",
 *   start: "2024-09-10",
 *   end: "2024-10-20"
 * }
 *
 * ### Monthly Recurring Event:
 * { repeat: "monthly", day: 15, name: "Salary", color: "#3b82f6" }
 *
 * ### Custom Weekly Event with Range:
 * {
 *   repeat: "weekly",
 *   days: ["Friday", "Saturday"],
 *   name: "Weekend Fun",
 *   color: "#f87171",
 *   start: "2024-09-20",
 *   end: "2024-12-31"
 * }
 */

"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
export const Calendar = ({
  value = new Date(),
  onChange = () => {},
  items = [
    // One-time event
    { date: "2024-10-05", name: "One-time Event", color: "#8b5cf6" },
    // Daily recurring event starting today
    {
      repeat: "daily",
      name: "Daily Event",
      color: "#f59e0b",
      start: "2024-10-01",
    },
    // Weekly recurring event on Monday and Wednesday starting from a specific date
    {
      repeat: "weekly",
      days: ["Monday", "Wednesday"],
      name: "Weekly Event",
      color: "#10b981",
      start: "2024-09-15",
    },
    // Weekly event with a start and end date (limited occurrence)
    {
      repeat: "weekly",
      days: ["Tuesday", "Thursday"],
      name: "Limited Weekly Event",
      color: "#f87171",
      start: "2024-09-10",
      end: "2024-10-20",
    },
    // Monthly recurring event on the 15th of every month
    {
      repeat: "monthly",
      day: 15,
      name: "Monthly Event",
      color: "#3b82f6",
    },
    // Monthly event starting from October 1st, ending on December 15th
    {
      repeat: "monthly",
      day: 1,
      name: "Limited Monthly Event",
      color: "#34d399",
      start: "2024-10-01",
      end: "2024-12-15",
    },
    // One-time event in the future
    { date: "2024-12-25", name: "Christmas Event", color: "#ef4444" },
    // Event repeating only on custom days
    {
      repeat: "weekly",
      days: ["Friday", "Saturday"],
      name: "Weekend Event",
      color: "#8b5cf6",
      start: "2024-09-20",
    },
  ],
  selection = false,
}) => {
  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const Days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [year, setYear] = useState(value.getFullYear());
  const [month, setMonth] = useState(value.getMonth());
  const [date, setDate] = useState(value.getDate());

  const [mode, setMode] = useState("month");
  const [preDays, setPreDays] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [postDays, setPostDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { xs, sm, md, lg, xl, xxl } = useScreenSize();

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const calculatePreDays = () => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInPrevMonth = getDaysInMonth(year, month - 1); // Handle previous month days correctly
    const preDaysCount = firstDayOfMonth;

    const calculatedPreDays = Array.from(
      { length: preDaysCount },
      (_, i) => daysInPrevMonth - preDaysCount + i + 1
    );

    setPreDays(calculatedPreDays);
  };

  const calculateDaysInMonth = () => {
    const totalDays = getDaysInMonth(year, month);
    const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1);
    setDaysInMonth(monthDays);
  };

  const calculatePostDays = () => {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDay(); // Day index of the last day
    const postDaysCount = lastDayOfMonth < 6 ? 6 - lastDayOfMonth : 0; // Fill up to Saturday

    const calculatedPostDays = Array.from(
      { length: postDaysCount },
      (_, i) => i + 1
    );

    setPostDays(calculatedPostDays);
  };

  const getEventsForDay = ({ day, isPre = false, isPost = false }) => {
    let eventYear = year;
    let eventMonth = month;

    // Adjust the year and month for pre and post days
    if (isPre) {
      eventMonth = month === 0 ? 11 : month - 1;
      eventYear = month === 0 ? year - 1 : year;
    } else if (isPost) {
      eventMonth = month === 11 ? 0 : month + 1;
      eventYear = month === 11 ? year + 1 : year;
    }

    const formattedDate = new Date(eventYear, eventMonth, day)
      .toISOString()
      .split("T")[0];
    const dayOfWeek = Days[new Date(eventYear, eventMonth, day).getDay()];

    return items.filter((item) => {
      // Handle one-time events
      if (item.date === formattedDate) return true;

      const itemStartDate = new Date(item.start);
      const itemEndDate = item.end ? new Date(item.end) : null;
      const currentDate = new Date(eventYear, eventMonth, day);

      // Check if current date is within the start and end date range
      const isWithinRange =
        (!item.start || currentDate >= itemStartDate) &&
        (!item.end || currentDate <= itemEndDate);

      // Handle daily events within the specified range
      if (item.repeat === "daily" && isWithinRange) return true;

      // Handle weekly events on specific days within the range
      if (
        item.repeat === "weekly" &&
        item.days.includes(dayOfWeek) &&
        isWithinRange
      )
        return true;

      // Handle monthly events on a specific day of the month within the range
      if (
        item.repeat === "monthly" &&
        day === parseInt(item?.day) &&
        isWithinRange
      )
        return true;

      return false;
    });
  };

  const handleEventClick = ({ day, event }) => {
    console.log("Day clicked:", month, day, "-", year);
    console.log("Event clicked:", event);
  };
  useEffect(() => {
    calculatePreDays();
    calculateDaysInMonth();
    calculatePostDays();
  }, [year, month]);

  return (
    <section>
      <div className="flex flex-col gap-2 mb-2 justify-between lg:flex-row lg:items-center">
        <h2 className="hidden lg:block text-3xl font-semibold min-w-1/2">
          {Months[month]}, {year}
        </h2>
        <ModeSelector mode={mode} setMode={setMode} />
        <div className="sm:flex justify-between gap-2 mb-8 lg:mb-0">
          <h2 className="text-center font-bold text-[8vw] mb-4 sm:mb-0 sm:text-4xl lg:hidden">
            {Months[month]}, {year}
          </h2>
          <Navigator
            date={{
              year,
              month,
              date,
            }}
            set={{
              year: setYear,
              month: setMonth,
              date: setDate,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2 sm:gap-2">
        {Days.map((day) => (
          <DayBlock
            key={`days-${day}`}
            day={xs ? day.slice(0, 1) : sm || md ? day.slice(0, 3) : day}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 sm:gap-2">
        {preDays.map((day) => (
          <DateBlock
            key={`pre-day-${day}`}
            day={day}
            fade
            onClick={() => {
              const preYear = month === 0 ? year - 1 : year;
              const preMonth = month === 0 ? 11 : month - 1;
              const selectedDate = new Date(year, preMonth, day);

              setYear(preYear);
              setMonth(preMonth);
              setDate(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            {getEventsForDay({ day, isPre: true }).map((event, index) => (
              <Event
                key={`event-${index}`}
                event={event}
                onClick={() => {
                  handleEventClick({ day, event });
                }}
              />
            ))}
          </DateBlock>
        ))}
        {daysInMonth.map((day) => (
          <DateBlock
            key={`day-${day}`}
            day={day}
            highlight={
              day === currentDate.getDate() &&
              month === currentDate.getMonth() &&
              year === currentDate.getFullYear()
            }
            highlightText="Today"
            // tr={console.log(day)}
            selected={selection && day == date}
            onClick={() => {
              const selectedDate = new Date(year, month, day);
              setDate(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            {getEventsForDay({ day }).map((event, index) => (
              <Event
                key={`event-${index}`}
                event={event}
                onClick={() => {
                  handleEventClick({ day, event });
                }}
              />
            ))}
          </DateBlock>
        ))}

        {postDays.map((day) => (
          <DateBlock
            key={`post-day-${day}`}
            day={day}
            fade
            onClick={() => {
              const postYear = month === 11 ? year + 1 : year;
              const postMonth = month === 11 ? 0 : month + 1;
              const selectedDate = new Date(year, postMonth, day);
              setYear(postYear);
              setMonth(postMonth);
              setDate(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            {getEventsForDay({ day, isPost: true }).map((event, index) => (
              <Event
                key={`event-${index}`}
                event={event}
                onClick={() => {
                  handleEventClick({ day, event });
                }}
              />
            ))}
          </DateBlock>
        ))}
      </div>
    </section>
  );
};

const ModeSelector = ({ mode, setMode }) => {
  const modes = ["month", "week", "day"];
  return (
    <div className="px-1 py-1 bg-gray-100 dark:bg-neutral-700 rounded-lg shadow-sm w-fit mx-auto mb-5 sm:mr-0 lg:w-auto lg:mr-auto lg:mb-0">
      <ul className="flex">
        {modes.map((m) => (
          <li
            className={cn(
              " px-4 py-2 capitalize cursor-pointer antialiased rounded-md",
              m === mode
                ? "bg-white dark:bg-neutral-950 font-semibold text-black dark:text-white shadow-sm"
                : "hover:bg-gray-50 dark:hover:bg-neutral-900 dark:hover:text-neutral-400 font-base text-gray-600 dark:text-black"
            )}
            key={`mode-${m}`}
            onClick={() => setMode(m)}
          >
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navigator = ({ date, set }) => {
  const getNextMonth = () => {
    if (date?.month === 11) {
      set?.year(date?.year + 1);
      set?.month(0);
    } else {
      set?.month(date?.month + 1);
    }
  };

  const getPrevMonth = () => {
    if (date?.month === 0) {
      set?.year(date?.year - 1);
      set?.month(11);
    } else {
      set?.month(date?.month - 1);
    }
  };

  const getToday = () => {
    set?.year(new Date().getFullYear());
    set?.month(new Date().getMonth());
    set?.date(new Date().getDate());
  };

  return (
    <div className="flex justify-between gap-2">
      <button
        className="h-10 w-10 flex justify-center items-center p-0 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg shadow"
        onClick={getPrevMonth}
      >
        <span className="text-xl">
          <LuChevronLeft />
        </span>
      </button>
      <button
        className="h-10 flex justify-center items-center py-0 px-6 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg shadow"
        onClick={getToday}
      >
        <span>Today</span>
      </button>
      <button
        className="h-10 w-10 flex justify-center items-center p-0 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg shadow"
        onClick={getNextMonth}
      >
        <span className="text-xl">
          <LuChevronRight />
        </span>
      </button>
    </div>
  );
};

const DayBlock = ({ day }) => {
  return (
    <div className="p-0 sm:p-2 sm:bg-gray-100 dark:sm:bg-neutral-800 rounded-lg">
      <div className="text-center antialiased text-black text-sm sm:text-base dark:text-white font-bold truncate">
        {day}
      </div>
    </div>
  );
};
const DateBlock = ({
  day,
  fade = false,
  highlight = false,
  highlightText,
  selected = false,
  onClick = () => {},
  children,
}) => {
  return (
    <div className={cn("aspect-square")} onClick={onClick}>
      <div
        className={cn(
          "h-full  sm:bg-gray-50 dark:sm:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 dark:hover:shadow-inner rounded-lg flex justify-center items-center text-sm sm:text-base select-none  md:flex-col md:items-stretch md:p-1 lg:p-2 md:font-semibold transition-all duration-75",
          fade && "text-gray-300 dark:text-neutral-700",
          highlight &&
            !selected &&
            "bg-gradient-to-tr from-rose-400   hover:from-rose-500 text-white ",
          selected &&
            "[&&]:bg-violet-500 [&&]:hover:bg-violet-600 text-white md:text-violet-500"
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "h-full w-full md:bg-white dark:md:bg-neutral-900 md:h-7 md:w-7 lg:w-8 lg:h-8 flex justify-center items-center md:rounded-full cursor-pointer",
              highlight && !selected && "sm:text-rose-500 dark:text-white"
            )}
          >
            {day}
          </span>
          {highlight && highlightText && (
            <>
              <span className="hidden lg:block text-sm text-black dark:text-rose-400 text-center">
                {highlightText}
              </span>
              <span className="hidden lg:block lg:w-8"></span>
            </>
          )}
        </div>
        <div className="hidden md:block flex-1">{children}</div>
      </div>
    </div>
  );
};

const Event = ({ event, onClick = () => {} }) => (
  <div
    className="px-1 rounded text-black dark:text-white text-[10px] lg:text-sm font-light  flex items-center gap-2 cursor-pointer transition-all duration-75"
    // style={{ backgroundColor: event.color }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = event.color; // Darken on hover
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent"; // Revert on mouse leave
    }}
    onClick={onClick}
  >
    <div
      className="h-3 w-3 rounded-full"
      style={{ backgroundColor: event.color }}
    ></div>{" "}
    <span className="truncate flex-1 leading-5">{event.name}</span>
  </div>
);
