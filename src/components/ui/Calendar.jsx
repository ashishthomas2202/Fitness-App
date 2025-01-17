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
import moment from "moment";

const getCurrentWeek = (selectedDate) => {
  const startOfWeek = new Date(
    selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay())
  );
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

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
      time: "3:00 PM",
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
      time: "10:00 AM",
    },
    {
      repeat: "weekly",
      days: ["Friday", "Saturday"],
      name: "Personal Event",
      color: "#8b5446",
      start: "2024-09-20",
      end: "2024-10-15",
      startTime: "11:00 AM",
      endTime: "1:00 PM",
    },
  ],
  // items = [],
  selection = true,
}) => {
  const [year, setYear] = useState(value.getFullYear());
  const [month, setMonth] = useState(value.getMonth());
  const [date, setDate] = useState(value.getDate());
  const [mode, setMode] = useState("month");
  const [weekDates, setWeekDates] = useState(getCurrentWeek(new Date()));
  const [preDays, setPreDays] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [postDays, setPostDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const calculateWeekDates = () => {
    setWeekDates(getCurrentWeek(new Date(year, month, date)));
  };

  const getEventsForDay = ({
    day,
    month: specifiedMonth,
    year: specifiedYear,
    isPre = false,
    isPost = false,
  }) => {
    let eventYear = specifiedYear || year;
    let eventMonth = specifiedMonth || month;

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

    // console.log(
    //   "Day of the week:",
    //   dayOfWeek,
    //   `${eventYear} ${eventMonth} ${day}`,
    //   new Date(eventYear, eventMonth, day)
    // );

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
    // console.log("Day clicked:", month, day, "-", year);
    // console.log("Event clicked:", event);
  };

  const getHeading = () => {
    if (mode === "week") {
      const startOfWeek = weekDates[0];
      const endOfWeek = weekDates[6];
      if (startOfWeek.getFullYear() !== endOfWeek.getFullYear()) {
        return `${
          Months[startOfWeek.getMonth()]
        }, ${startOfWeek.getFullYear()} - ${
          Months[endOfWeek.getMonth()]
        }, ${endOfWeek.getFullYear()}`;
      } else if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
        return `${Months[startOfWeek.getMonth()]} - ${
          Months[endOfWeek.getMonth()]
        }, ${year}`;
      }

      return `${Months[startOfWeek.getMonth()]}, ${year}`;
    }

    return `${Months[month]}, ${year}`;
  };
  useEffect(() => {
    if (mode === "month") {
      calculatePreDays();
      calculateDaysInMonth();
      calculatePostDays();
    }
  }, [year, month, mode]);

  useEffect(() => {
    if (mode === "week") {
      calculateWeekDates();
    }
  }, [year, month, date, mode]);

  // useEffect(() => {
  //   console.log("Current Date:", year, month, date);
  // }, [year, month, date]);
  return (
    <section>
      <div className="flex flex-col gap-2 mb-2 justify-between lg:flex-row lg:items-center">
        <h2 className="hidden lg:block text-3xl font-semibold min-w-1/2">
          {getHeading()}
        </h2>
        <ModeSelector mode={mode} setMode={setMode} />
        <div className="sm:flex justify-between gap-2 mb-8 lg:mb-0">
          <h2 className="text-center font-bold text-[8vw] mb-4 select-none sm:mb-0 sm:text-4xl lg:hidden">
            {getHeading()}
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
            mode={mode}
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-7 mb-2 sm:gap-2">
        {Days.map((day) => (
          <DayBlock
            key={`days-${day}`}
            day={xs ? day.slice(0, 1) : sm || md ? day.slice(0, 3) : day}
          />
        ))}
      </div> */}
      {mode == "month" && (
        <MonthView
          preDays={preDays}
          daysInMonth={daysInMonth}
          postDays={postDays}
          currentDate={currentDate}
          date={{
            year: year,
            month: month,
            date: date,
          }}
          setDate={{
            year: setYear,
            month: setMonth,
            date: setDate,
          }}
          getEventsForDay={getEventsForDay}
          handleEventClick={handleEventClick}
          onChange={onChange}
          selection={selection}
        />
      )}

      {mode == "week" && (
        <WeekView
          key={`${year}-${month}-${date}-weekView`} // Force re-render on key change
          date={{
            year: year,
            month: month,
            date: date,
          }}
          setDate={{
            year: setYear,
            month: setMonth,
            date: setDate,
          }}
          weekDates={weekDates}
          onChange={onChange}
          getEventsForDay={getEventsForDay}
          handleEventClick={handleEventClick}
          selection={selection}
        />
      )}
      {mode == "day" && (
        <DayView
          key={`${year}-${month}-${date}-dayView`} // Force re-render on key change
          date={{
            year: year,
            month: month,
            date: date,
          }}
          setDate={{
            year: setYear,
            month: setMonth,
            date: setDate,
          }}
          onChange={onChange}
          getEventsForDay={getEventsForDay}
          handleEventClick={handleEventClick}
          selection={selection}
        />
      )}
    </section>
  );
};

const DayView = ({
  date: selectedDate = {},
  setDate = {},
  onChange = () => {},
  getEventsForDay = () => [],
  handleEventClick = () => {},
  selection = false,
}) => {
  return (
    <>
      <DayEventList
        date={{
          year: selectedDate.year,
          month: selectedDate.month,
          date: selectedDate.date,
        }}
        getEventsForDay={getEventsForDay}
        selection={selection}
      />
    </>
  );
};

const WeekView = ({
  date: selectedDate = {},
  setDate = {},
  weekDates = [],
  onChange = () => {},
  getEventsForDay = () => [],
  handleEventClick = () => {},
  selection = false,
}) => {
  return (
    <>
      <WeekEventList
        date={{
          year: selectedDate.year,
          month: selectedDate.month,
          date: selectedDate.date,
        }}
        setDate={setDate}
        getEventsForDay={getEventsForDay}
        weekDates={weekDates}
        selection={selection}
      />
    </>
  );
};

const MonthView = ({
  preDays = [],
  daysInMonth = [],
  postDays = [],
  currentDate = new Date(),
  date = {},
  setDate = {},
  getEventsForDay = () => [],
  handleEventClick = () => {},
  onChange = () => {},
  selection = false,
}) => {
  const { xs, sm, md, lg, xl, xxl } = useScreenSize();

  return (
    <>
      <div className="grid grid-cols-7 mb-2 sm:gap-2">
        {Days.map((day) => (
          <DayBlock
            key={`days-${day}-dayBlock-MonthView`}
            day={xs ? day.slice(0, 1) : sm || md ? day.slice(0, 3) : day}
          />
        ))}
      </div>
      <div className="grid grid-cols-7 sm:gap-2">
        {preDays.map((day) => (
          <DateBlock
            key={`pre-day-${day}-dateBlock-MonthView`}
            day={day}
            fade
            onClick={() => {
              const preYear = date?.month === 0 ? date?.year - 1 : date?.year;
              const preMonth = date?.month === 0 ? 11 : date?.month - 1;
              const selectedDate = new Date(date?.year, preMonth, day);

              setDate?.year(preYear);
              setDate?.month(preMonth);
              setDate?.date(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            {getEventsForDay({ day, isPre: true }).map((event, index) => (
              <Event
                key={`event-${index}-preDays-MonthView`}
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
            key={`day-${day}-dateBlock-MonthView-${date?.month}`}
            day={day}
            highlight={
              day === currentDate.getDate() &&
              date?.month === currentDate.getMonth() &&
              date?.year === currentDate.getFullYear()
            }
            highlightText="Today"
            // tr={console.log(day)}
            selected={selection && day == date?.date}
            onClick={() => {
              const selectedDate = new Date(date?.year, date?.month, day);
              setDate?.date(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            {getEventsForDay({ day }).map((event, index) => (
              <Event
                key={`event-${index}-daysInMonth-MonthView`}
                event={event}
                onClick={() => {
                  handleEventClick({ day, event });
                }}
                selected={selection && day == date?.date}
              />
            ))}
          </DateBlock>
        ))}

        {postDays.map((day) => (
          <DateBlock
            key={`post-day-${day}-dateBlock-MonthView-${date?.month}`}
            day={day}
            fade
            onClick={() => {
              const postYear = date?.month === 11 ? date?.year + 1 : date?.year;
              const postMonth = date?.month === 11 ? 0 : date?.month + 1;
              const selectedDate = new Date(date?.year, postMonth, day);
              setDate?.year(postYear);
              setDate?.month(postMonth);
              setDate?.date(selectedDate.getDate());
              onChange(selectedDate);
            }}
          >
            {getEventsForDay({ day, isPost: true }).map((event, index) => (
              <Event
                key={`event-${index}-postDays-MonthView`}
                event={event}
                onClick={() => {
                  handleEventClick({ day, event });
                }}
              />
            ))}
          </DateBlock>
        ))}
      </div>
    </>
  );
};
const ModeSelector = ({ mode, setMode }) => {
  const modes = ["month", "week", "day"];
  return (
    <div className="px-1 py-1 select-none bg-gray-100 dark:bg-neutral-700 rounded-lg shadow-sm w-fit mx-auto mb-5 sm:mr-0 lg:w-auto lg:mr-auto lg:mb-0">
      <ul className="flex">
        {modes.map((m) => (
          <li
            className={cn(
              " px-4 py-2 capitalize cursor-pointer antialiased rounded-md",
              m === mode
                ? "bg-white dark:bg-neutral-950 font-semibold text-black dark:text-white shadow-sm"
                : "hover:bg-gray-50 dark:hover:bg-neutral-900 dark:hover:text-neutral-400 font-base text-gray-600 dark:text-black"
            )}
            key={`mode-${m}-selector`}
            onClick={() => setMode(m)}
          >
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navigator = ({ date, set, mode }) => {
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

  const getNextWeek = () => {
    const newDate = new Date(date.year, date.month, date.date + 7);
    set?.year(newDate.getFullYear());
    set?.month(newDate.getMonth());
    set?.date(newDate.getDate());
  };

  const getPrevWeek = () => {
    const newDate = new Date(date.year, date.month, date.date - 7);
    set?.year(newDate.getFullYear());
    set?.month(newDate.getMonth());
    set?.date(newDate.getDate());
  };
  const getNextDay = () => {
    const newDate = new Date(date.year, date.month, date.date + 1);
    set?.year(newDate.getFullYear());
    set?.month(newDate.getMonth());
    set?.date(newDate.getDate());
  };

  const getPrevDay = () => {
    const newDate = new Date(date.year, date.month, date.date - 1);
    set?.year(newDate.getFullYear());
    set?.month(newDate.getMonth());
    set?.date(newDate.getDate());
  };

  const getToday = () => {
    set?.year(new Date().getFullYear());
    set?.month(new Date().getMonth());
    set?.date(new Date().getDate());
  };

  const handleNext = () => {
    if (mode === "month") {
      getNextMonth();
    } else if (mode === "week") {
      getNextWeek();
    } else if (mode === "day") {
      getNextDay();
    }
  };

  const handlePrev = () => {
    if (mode === "month") {
      getPrevMonth();
    } else if (mode === "week") {
      getPrevWeek();
    } else if (mode === "day") {
      getPrevDay();
    }
  };

  return (
    <div className="flex justify-between gap-2 select-none">
      <button
        className="h-10 w-10 flex justify-center items-center p-0 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg shadow"
        onClick={handlePrev}
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
        onClick={handleNext}
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
    <div className="p-0 sm:p-2 sm:bg-gray-100 dark:sm:bg-neutral-800 rounded-lg select-none">
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
    <div className={cn("aspect-square select-none")} onClick={onClick}>
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

const Event = ({ event, selected = false, onClick = () => {} }) => (
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
      className="h-3 w-3 rounded-full border border-neutral-700"
      style={{ backgroundColor: event.color }}
    ></div>{" "}
    <span className={cn("truncate flex-1 leading-5", selected && "text-white")}>
      {event.name}
    </span>
  </div>
);

const DetailedEvent = ({ event, onClick = () => {} }) => (
  <div
    className="h-full p-2 rounded-lg shadow border dark:border-neutral-800 text-white text-[10px] lg:text-sm font-light cursor-pointer transition-all duration-75"
    style={{ backgroundColor: event.color }}
    // onMouseEnter={(e) => {
    //   e.currentTarget.style.backgroundColor = event.color; // Darken on hover
    // }}
    // onMouseLeave={(e) => {
    //   e.currentTarget.style.backgroundColor = "transparent"; // Revert on mouse leave
    // }}
    onClick={onClick}
  >
    {/* <div
      className="h-3 w-3 rounded-full border border-neutral-700"
      style={{ backgroundColor: event.color }}
    ></div>{" "} */}
    <span className="truncate flex-1 leading-5">{event.name}</span>
  </div>
);

// const DayEventList = ({
//   date: selectedDate = {},
//   getEventsForDay = () => [],
//   weekDates,
//   selection = false,
// }) => {
//   const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

//   const parseTime = (timeString) => {
//     const [time, modifier] = timeString.split(" ");
//     let [hours, minutes] = time.split(":");
//     if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
//     if (modifier === "AM" && hours === "12") hours = 0;
//     return { hours: parseInt(hours), minutes: parseInt(minutes) };
//   };

//   const currentDate = selectedDate.date;
//   const currentMonth = selectedDate.month;
//   const currentYear = selectedDate.year;

//   const dayEvents = getEventsForDay({
//     day: currentDate,
//     month: currentMonth,
//     year: currentYear,
//   });
//   const [timedEvents, untimedEvents] = dayEvents.reduce(
//     ([timed, untimed], event) => {
//       if (event.startTime || event.endTime || event.time) timed.push(event);
//       else untimed.push(event);
//       return [timed, untimed];
//     },
//     [[], []]
//   );

//   return (
//     <section>
//       <div className="bg-violet-400 text-white rounded-lg pl-3 py-2">
//         <div className="w-fit text-center">
//           <h3 className="">
//             {moment(new Date(currentYear, currentMonth, currentDate))
//               .format("ddd")
//               .toUpperCase()}
//           </h3>
//           <h2 className="text-3xl font-semibold">
//             {moment(new Date(currentYear, currentMonth, currentDate)).format(
//               "DD"
//             )}
//           </h2>
//         </div>
//       </div>
//       {console.log(dayEvents)}

//       {untimedEvents.length > 0 && (
//         <>
//           <h3 className="font-semibold text-center mt-4">Untimed Events</h3>
//           {untimedEvents.map((event, index) => (
//             <Event
//               key={`untimed-${event.name}-${index}`}
//               event={event}
//               // selected={selection && selectedDate.date === currentDate}
//             />
//           ))}
//         </>
//       )}

//       <div className="grid grid-cols-2 bg-slate-50 dark:bg-neutral-800 rounded-lg py-5 mt-5">
//         <div className="w-20">
//           <div className="grid grid-rows-subgrid">
//             {hours.map((hour, hourIndex) => (
//               <div key={`hour-${hourIndex}`} className="col-span-1 h-16">
//                 <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//                   {hour}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div>
//         {hours.map((hour, hourIndex) => {
//           const currentHour = parseInt(hour);

//           const matchingEvents = timedEvents.filter((event) => {
//             const { hours: startHour } = parseTime(
//               event.startTime || event.time || "12:00 AM"
//             );
//             const { hours: endHour } = parseTime(
//               event.endTime || event.time || "12:00 AM"
//             );

//             if (event.time) return startHour === currentHour;
//             return startHour <= currentHour && currentHour < endHour;
//           });

//           return (
//             <div
//               key={`hour-${hourIndex}-timedEvents`}
//               className="col-span-1 h-16 relative"
//             >
//               {matchingEvents.length > 0 ? (
//                 matchingEvents.map((event, eventIndex) => (
//                   <div
//                     key={`event-${event.name}-${eventIndex}`}
//                     className="border-l dark:border-l-neutral-700 h-full px-2"
//                   >
//                     <DetailedEvent
//                       event={event}
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         height: `${
//                           (parseTime(event.endTime || "12:00 AM").hours -
//                             parseTime(event.startTime || "12:00 AM").hours) *
//                           50
//                         }px`,
//                         width: "100%",
//                       }}
//                       onClick={() => {
//                         // console.log(
//                         //   "Day clicked:",
//                         //   date.getDate(),
//                         //   "-",
//                         //   date.getMonth(),
//                         //   "-",
//                         //   date.getFullYear()
//                         // );
//                         // console.log("Event clicked:", event);
//                       }}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="h-full border-l dark:border-l-neutral-700"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

const DayEventList = ({
  date: selectedDate = {},
  getEventsForDay = () => [],
  selection = false,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const parseTime = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = 0;
    return { hours: parseInt(hours), minutes: parseInt(minutes) };
  };

  const currentDate = selectedDate.date;
  const currentMonth = selectedDate.month;
  const currentYear = selectedDate.year;

  const dayEvents = getEventsForDay({
    day: currentDate,
    month: currentMonth,
    year: currentYear,
  });

  const [timedEvents, untimedEvents] = dayEvents.reduce(
    ([timed, untimed], event) => {
      if (event.startTime || event.endTime || event.time) timed.push(event);
      else untimed.push(event);
      return [timed, untimed];
    },
    [[], []]
  );

  return (
    <section>
      {/* Header for the selected day */}
      <div className="bg-violet-400 text-white rounded-lg pl-3 py-2 mb-4">
        <div className="w-fit text-center">
          <h3>
            {moment(new Date(currentYear, currentMonth, currentDate))
              .format("ddd")
              .toUpperCase()}
          </h3>
          <h2 className="text-3xl font-semibold">
            {moment(new Date(currentYear, currentMonth, currentDate)).format(
              "DD"
            )}
          </h2>
        </div>
      </div>

      {/* Untimed events */}
      {untimedEvents.length > 0 && (
        <>
          <h3 className="font-semibold text-center mt-4">Untimed Events</h3>
          {untimedEvents.map((event, index) => (
            <Event
              key={`untimed-${event.name}-${index}`}
              event={event}
              // selected={selection && selectedDate.date === currentDate}
            />
          ))}
        </>
      )}

      {/* Day view with 2 columns */}
      <div className="grid grid-cols-[auto_1fr] bg-slate-50 dark:bg-neutral-800 rounded-lg py-5">
        {/* Time column */}
        <div className="">
          <div className="grid grid-rows-subgrid">
            {hours.map((hour, hourIndex) => (
              <div
                key={`hour-${hourIndex}`}
                className="h-16 border-b dark:border-neutral-900 px-2 pt-1"
              >
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events column */}
        <div className="relative">
          {hours.map((hour, hourIndex) => {
            const currentHour = parseInt(hour);

            const matchingEvents = timedEvents.filter((event) => {
              const { hours: startHour } = parseTime(
                event.startTime || event.time || "12:00 AM"
              );
              const { hours: endHour } = parseTime(
                event.endTime || event.time || "12:00 AM"
              );

              if (event.time) return startHour === currentHour;
              return startHour <= currentHour && currentHour < endHour;
            });

            return (
              <div
                key={`hour-${hourIndex}-timedEvents`}
                className="h-16 border-b dark:border-neutral-900 relative"
              >
                {matchingEvents.length > 0 ? (
                  matchingEvents.map((event, eventIndex) => (
                    // <div
                    //   key={`event-${event.name}-${eventIndex}`}
                    //   className="absolute top-0 left-0 w-full bg-violet-200 dark:bg-violet-500 p-2 rounded-lg"
                    //   style={{
                    //     height: `${
                    //       (parseTime(event.endTime || "12:00 AM").hours -
                    //         parseTime(event.startTime || "12:00 AM").hours) *
                    //       64
                    //     }px`,
                    //   }}
                    // >
                    <DetailedEvent
                      event={event}
                      key={`event-${event.name}-${eventIndex}`}
                      onClick={() => {
                        console.log("Event clicked:", event);
                      }}
                    />
                    // </div>
                  ))
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const WeekEventList = ({
  date: selectedDate = {},
  setDate = {},
  getEventsForDay = () => [],
  weekDates,
  selection = false,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const parseTime = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = 0;
    return { hours: parseInt(hours), minutes: parseInt(minutes) };
  };

  return (
    <>
      <div className="grid grid-cols-8">
        <div className="col-span-1"></div>
        {weekDates.map((date, dateIndex) => {
          const currentDate = date.getDate();
          const currentMonth = date.getMonth();
          const currentYear = date.getFullYear();
          const currentDay = date.getDay();
          const dayEvents = getEventsForDay({
            day: currentDate,
            month: currentMonth,
            year: currentYear,
          });

          const [timedEvents, untimedEvents] = dayEvents.reduce(
            ([timed, untimed], event) => {
              if (event.startTime || event.endTime || event.time)
                timed.push(event);
              else untimed.push(event);
              return [timed, untimed];
            },
            [[], []]
          );

          return (
            <div key={`date-${dateIndex}`} className="px-2">
              <div
                className={cn(
                  "bg-gray-100 dark:bg-neutral-800 p-2 rounded aspect-square cursor-pointer",
                  selection &&
                    selectedDate.date === currentDate &&
                    "bg-violet-500 dark:bg-violet-500 text-white"
                )}
                onClick={() => {
                  setDate.year(currentYear);
                  setDate.month(currentMonth);
                  setDate.date(currentDate);
                }}
              >
                <div>
                  <h2 className="text-center antialiased text-slate-400 text-sm sm:text-base dark:text-white truncate">
                    {Days[currentDay]}
                  </h2>
                  <h2 className="text-4xl font-bold text-center mt-2">
                    {currentDate}
                  </h2>
                </div>

                {untimedEvents.length > 0 && (
                  <>
                    <h3 className="font-semibold text-center mt-4">
                      Untimed Events
                    </h3>
                    {untimedEvents.map((event, index) => (
                      <Event
                        key={`untimed-${event.name}-${index}`}
                        event={event}
                        selected={
                          selection && selectedDate.date === currentDate
                        }
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-8 bg-slate-50 dark:bg-neutral-800 rounded-lg py-5 mt-5">
        <div className="col-span-1">
          <div className="grid grid-rows-subgrid">
            {hours.map((hour, hourIndex) => (
              <div key={`hour-${hourIndex}`} className="col-span-1 h-16">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {weekDates.map((date, dateIndex) => {
          const currentDate = date.getDate();
          const currentMonth = date.getMonth();
          const currentYear = date.getFullYear();
          const dayEvents = getEventsForDay({
            day: currentDate,
            month: currentMonth,
            year: currentYear,
          });

          const [timedEvents] = dayEvents.reduce(
            ([timed], event) => {
              if (event.startTime || event.endTime || event.time)
                timed.push(event);
              return [timed];
            },
            [[]]
          );

          // console.log(
          //   "Date:",
          //   `${currentMonth}-${currentDate}-${currentYear}`,
          //   "Timed Events:",
          //   timedEvents
          // );
          return (
            <div key={`date-${dateIndex}-events`}>
              {hours.map((hour, hourIndex) => {
                const currentHour = parseInt(hour);

                const matchingEvents = timedEvents.filter((event) => {
                  const { hours: startHour } = parseTime(
                    event.startTime || event.time || "12:00 AM"
                  );
                  const { hours: endHour } = parseTime(
                    event.endTime || event.time || "12:00 AM"
                  );

                  if (event.time) return startHour === currentHour;
                  return startHour <= currentHour && currentHour < endHour;
                });

                return (
                  <div
                    key={`hour-${hourIndex}-date-${dateIndex}`}
                    className="col-span-1 h-16 relative"
                  >
                    {matchingEvents.length > 0 ? (
                      matchingEvents.map((event, eventIndex) => (
                        <div
                          key={`event-${event.name}-${eventIndex}`}
                          className="border-l dark:border-l-neutral-700 h-full px-2"
                        >
                          <DetailedEvent
                            event={event}
                            style={{
                              position: "absolute",
                              top: 0,
                              height: `${
                                (parseTime(event.endTime || "12:00 AM").hours -
                                  parseTime(event.startTime || "12:00 AM")
                                    .hours) *
                                50
                              }px`,
                              width: "100%",
                            }}
                            onClick={() => {
                              // console.log(
                              //   "Day clicked:",
                              //   date.getDate(),
                              //   "-",
                              //   date.getMonth(),
                              //   "-",
                              //   date.getFullYear()
                              // );
                              // console.log("Event clicked:", event);
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="h-full border-l dark:border-l-neutral-700"></div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
