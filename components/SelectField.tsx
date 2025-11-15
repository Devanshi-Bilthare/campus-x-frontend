import {
    Box,
    FormHelperText,
    MenuItem,
    Select,
    Typography,
  } from "@mui/material";
  import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
  import React from "react";
  import { getIn } from "formik";
  import Image from "next/image";
  
  interface SelectFieldProps {
    formik?: any;
    label: string;
    name: string;
    options: { label: string; value: string | number | boolean; icon?: string }[];
    placeholder?: string;
  }
  
  const SelectField: React.FC<SelectFieldProps> = ({
    formik,
    label,
    name,
    options,
    placeholder = "Select option",
  }) => {
    const value = getIn(formik.values, name);
  const error = getIn(formik.touched, name) && getIn(formik.errors, name);
    return (
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: "500", color: "#181D27", mb: "6px" }}
        >
          {label}
        </Typography>
        <Select
          fullWidth
          name={name}
          value={value || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(error)}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          renderValue={(selected: string | number) => {
            if (!selected) {
              return <span style={{ color: "#667085", fontWeight: "400" }}>{placeholder}</span>;
            }
            const selectedOption = options?.find((opt) => String(opt.value) === String(selected));
            if (!selectedOption) return null;
            
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {selectedOption.icon && (
                  <Image
                    src={selectedOption.icon}
                    alt={selectedOption.label}
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                )}
                <span style={{ textTransform: "capitalize" }}>{selectedOption.label}</span>
              </Box>
            );
          }}
          sx={{
            border: "1px solid #D0D5DD",
            borderRadius: "8px",
            mt: "6px",
            "& .MuiSelect-select": {
              padding: "12px 14px",
              fontSize: "16px",
              fontWeight: "500",
              color: "#181D27",
            },
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
            "&.Mui-error": {
              border: "1px solid #F04438",
            },
          }}
        >
          <MenuItem disabled value="">
            <span style={{ color: "#667085", fontWeight: "400" }}>{placeholder}</span>
          </MenuItem>
          {options?.map((opt) => (
            <MenuItem key={String(opt.value)} value={String(opt.value)}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {opt.icon && (
                  <Image
                    src={opt.icon}
                    alt={opt.label}
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                )}
                <span style={{ textTransform: "capitalize" }}>{opt.label}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
        {error && (
          <FormHelperText sx={{ color: "#F04438", mt: "4px" }}>
            {formik.errors[name]}
          </FormHelperText>
        )}
      </Box>
    );
  };
  
  export default SelectField;
  