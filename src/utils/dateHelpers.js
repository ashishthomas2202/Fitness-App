// src/utils/dateHelpers.js
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export const getDateRanges = () => {
  const today = new Date();
  return {
    week: {
      start: subDays(today, 7),
      end: today
    },
    month: {
      start: subDays(today, 30),
      end: today
    },
    threeMonths: {
      start: subDays(today, 90),
      end: today
    }
  };
};

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr);
};