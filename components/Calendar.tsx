'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface CalendarProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  minDate?: string; // ISO date string (YYYY-MM-DD)
  maxDate?: string; // ISO date string (YYYY-MM-DD)
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, minDate, maxDate }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = value ? new Date(value) : null;
  if (selectedDate) {
    selectedDate.setHours(0, 0, 0, 0);
  }

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    // Check min/max date constraints
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (clickedDate < min) return;
    }

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (clickedDate > max) return;
    }

    const isoDate = clickedDate.toISOString().split('T')[0];
    onChange(isoDate);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }

    return false;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = [];

  // Get previous month's last days for display
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = prevMonth.getDate();
  const prevMonthDaysToShow: number[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    prevMonthDaysToShow.push(prevMonthDays - i);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Get next month's first days for display
  const totalCells = prevMonthDaysToShow.length + days.length;
  const remainingCells = 42 - totalCells; // 6 rows * 7 days
  const nextMonthDaysToShow: number[] = [];
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDaysToShow.push(i);
  }

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#16796f',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        <IconButton
          onClick={handlePrevMonth}
          size="small"
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
          {monthNames[month]} {year}
        </Typography>
        <IconButton
          onClick={handleNextMonth}
          size="small"
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Days of week header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {dayNames.map((day) => (
          <Box
            key={day}
            sx={{
              py: 1,
              textAlign: 'center',
              borderRight: day !== 'SAT' ? '1px solid #e0e0e0' : 'none',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {/* Previous month days (faded) */}
        {prevMonthDaysToShow.map((day, idx) => (
          <Box
            key={`prev-${day}`}
            sx={{
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: (idx + 1) % 7 !== 0 ? '1px solid #e0e0e0' : 'none',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                color: '#ccc',
                fontWeight: 400,
              }}
            >
              {day}
            </Typography>
          </Box>
        ))}

        {/* Current month days */}
        {days.map((day, idx) => {
          if (day === null) return null;
          
          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);
          const isTodayDate = isToday(day);
          const cellIndex = prevMonthDaysToShow.length + idx;

          return (
            <Box
              key={`day-${day}`}
              onClick={() => !disabled && handleDateClick(day)}
              sx={{
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: (cellIndex + 1) % 7 !== 0 ? '1px solid #e0e0e0' : 'none',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: selected ? '#16796f' : 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                position: 'relative',
                '&:hover': {
                  backgroundColor: disabled
                    ? 'transparent'
                    : selected
                    ? '#125a4f'
                    : 'rgba(22, 121, 111, 0.1)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: selected ? 600 : isTodayDate ? 600 : 400,
                  color: disabled
                    ? '#ccc'
                    : selected
                    ? '#fff'
                    : isTodayDate
                    ? '#16796f'
                    : '#333',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {day}
              </Typography>
              {isTodayDate && !selected && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: 32,
                    height: 32,
                    border: '2px solid #16796f',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </Box>
          );
        })}

        {/* Next month days (faded) */}
        {nextMonthDaysToShow.map((day, idx) => {
          const cellIndex = prevMonthDaysToShow.length + days.length + idx;
          return (
            <Box
              key={`next-${day}`}
              sx={{
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: (cellIndex + 1) % 7 !== 0 ? '1px solid #e0e0e0' : 'none',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#fafafa',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: '#ccc',
                  fontWeight: 400,
                }}
              >
                {day}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Calendar;

