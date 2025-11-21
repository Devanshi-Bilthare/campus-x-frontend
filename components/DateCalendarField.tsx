'use client';

import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Popper,
  ClickAwayListener,
  FormHelperText,
  Typography,
  InputAdornment,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface DateCalendarFieldProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string; // ISO date string (YYYY-MM-DD)
  maxDate?: string; // ISO date string (YYYY-MM-DD)
  error?: boolean;
  helperText?: string;
}

const DateCalendarField: React.FC<DateCalendarFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select date",
  minDate,
  maxDate,
  error = false,
  helperText,
}) => {
  const anchorRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format("YYYY-MM-DD"));
      setOpen(false);
    }
  };

  const displayValue = value ? dayjs(value).format("YYYY-MM-DD") : "";

  const minDateDayjs = minDate ? dayjs(minDate) : dayjs();
  const maxDateDayjs = maxDate ? dayjs(maxDate) : undefined;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box sx={{ position: "relative", width: "100%" }}>
          {label && (
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#344054", mb: 0.5 }}
            >
              {label}
            </Typography>
          )}

          <TextField
            fullWidth
            inputRef={anchorRef}
            placeholder={placeholder}
            value={displayValue}
            onClick={() => setOpen(!open)}
            onChange={() => {}}
            error={error}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover fieldset": {
                  borderColor: "#16796f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#16796f",
                },
                "&.Mui-error fieldset": {
                  borderColor: "#d32f2f",
                },
              },
              "& input": {
                cursor: "pointer",
                fontSize: "0.875rem",
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonthIcon sx={{ color: "#16796f", cursor: "pointer" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 8],
                },
              },
            ]}
            sx={{ zIndex: 1500 }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                "& .MuiDateCalendar-root": {
                  width: "100%",
                  "& .MuiPickersCalendarHeader-root": {
                    backgroundColor: "#16796f",
                    color: "#fff",
                    padding: "8px 16px",
                    "& .MuiPickersCalendarHeader-label": {
                      color: "#fff",
                      fontWeight: 600,
                    },
                    "& .MuiIconButton-root": {
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                  },
                  "& .MuiDayCalendar-weekContainer": {
                    "& .MuiPickersDay-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#16796f",
                        color: "#fff",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#125a4f",
                        },
                        "&:focus": {
                          backgroundColor: "#16796f",
                        },
                      },
                      "&.MuiPickersDay-today": {
                        border: "2px solid #16796f",
                        fontWeight: 600,
                        color: "#16796f",
                        "&.Mui-selected": {
                          border: "2px solid #fff",
                          color: "#fff",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(22, 121, 111, 0.1)",
                      },
                      "&.Mui-disabled": {
                        color: "#ccc",
                      },
                    },
                  },
                  "& .MuiPickersCalendarHeader-weekDayLabel": {
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: "#666",
                    textTransform: "uppercase",
                  },
                },
              }}
            >
              <DateCalendar
                value={value ? dayjs(value) : null}
                onChange={handleDateChange}
                minDate={minDateDayjs}
                maxDate={maxDateDayjs}
                shouldDisableDate={(date) => {
                  if (minDate && date.isBefore(minDateDayjs, "day")) {
                    return true;
                  }
                  if (maxDate && maxDateDayjs && date.isAfter(maxDateDayjs, "day")) {
                    return true;
                  }
                  return false;
                }}
              />
            </Box>
          </Popper>

          {error && helperText && (
            <FormHelperText sx={{ color: "#F04438", mt: 0.5 }}>
              {helperText}
            </FormHelperText>
          )}
        </Box>
      </ClickAwayListener>
    </LocalizationProvider>
  );
};

export default DateCalendarField;

