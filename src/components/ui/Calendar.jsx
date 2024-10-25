"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
export const Calendar = ({
  value = new Date(),
  onChange = () => {},
  items = [
    {
      date: new Date().toISOString().split("T")[0],
      name: "Event 1",
      color: "#8b5cf6",
    },
    {
      date: new Date().toISOString().split("T")[0],
      name: "Event 2",
      color: "#f59e0b",
    },
    {
      date: new Date().toISOString().split("T")[0],
      name: "Event 3",
      color: "#10b981",
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      name: "Event 4",
      color: "#3b82f6",
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 2))
        .toISOString()
        .split("T")[0],
      name: "Event 5",
      color: "#ef4444",
    },
    {
      startDate: "2024-10-02",
      endDate: "2024-10-05",
repeat: "daily",//custom, daily, weekly, monthly, yearly
customDays: [1, 3, 5],//for custom repeat
      name: "Event 1",
      color: "#8b5cf6",
    },
  ],
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

  const modes = ["month", "week", "day"];

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

  const getNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const getPrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const getToday = () => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth());
    setDate(new Date().getDate());
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

  useEffect(() => {
    calculatePreDays();
    calculateDaysInMonth();
    calculatePostDays();
  }, [year, month]);

  useEffect(() => {
    console.log("Date changed:", date);
  }, [date]);

  return (
    <section>
      <div className="flex flex-col gap-2 mb-2 justify-between lg:flex-row lg:items-center">
        <h2 className="hidden lg:block text-3xl font-semibold">
          {Months[month]}, {year}
        </h2>

        <div className="px-1 py-1 bg-gray-100 rounded-lg shadow-sm w-fit mx-auto mb-5 sm:mr-0 lg:w-auto lg:mr-auto lg:mb-0">
          <ul className="flex">
            {modes.map((m) => (
              <li
                className={cn(
                  " px-4 py-2 capitalize cursor-pointer antialiased rounded-md",
                  m === mode
                    ? "bg-white font-semibold text-black shadow-sm"
                    : "hover:bg-gray-50 font-base text-gray-600"
                )}
                key={`mode-${m}`}
                onClick={() => setMode(m)}
              >
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:flex justify-between gap-2 mb-8 lg:mb-0">
          <h2 className="text-center font-bold text-[8vw] mb-4 sm:mb-0 sm:text-4xl lg:hidden">
            {Months[month]}, {year}
          </h2>

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

              console.log(selectedDate);

              onChange(selectedDate);
            }}
          />
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
            // tr={console.log(day)}
            selected={day == date}
            onClick={() => {
              const selectedDate = new Date(year, month, day);
              console.log(selectedDate);

              setDate(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            Hello
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
              console.log(selectedDate);
              setYear(postYear);
              setMonth(postMonth);
              setDate(selectedDate.getDate());
              onChange(selectedDate);
            }}
          />
        ))}
      </div>
    </section>
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
  selected = false,
  onClick = () => {},
  children,
}) => {
  return (
    <div className={cn("aspect-square")} onClick={onClick}>
      <div
        className={cn(
          "h-full  sm:bg-gray-50 dark:sm:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg flex justify-center items-center text-sm sm:text-base select-none cursor-pointer md:flex-col md:items-stretch md:p-2 md:font-semibold transition-all duration-75",
          fade && "text-gray-300 dark:text-neutral-700",
          highlight &&
            !selected &&
            "bg-gradient-to-tr from-rose-400   hover:from-rose-500 text-white ",
          selected && "[&&]:bg-violet-500 text-white md:text-violet-500"
        )}
      >
        <span
          className={cn(
            "md:bg-white h-7 w-7 flex justify-center items-center rounded-full",
            highlight && !selected && "sm:text-rose-500 dark:text-white"
          )}
        >
          {day}
        </span>
        <div className="hidden md:block flex-1">{children}</div>
      </div>
    </div>
  );
};
