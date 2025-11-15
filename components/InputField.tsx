import {
  Box,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { getIn } from "formik";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const inputStyles = {
    border: "1px solid #D0D5DD",
    mt: "6px",
    borderRadius: "8px",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
    "& input": {
      fontSize: "16px",
      color: "#181D27",
      fontWeight: "500",
      "::placeholder": {
        fontWeight: "400",
        color: "#252B37",
      },
    },
    "& input[type='date']": {
      color: "#667085",
      fontWeight: "400",
    },
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      opacity: 0,
      display: "none",
    },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
  };
  

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon1?: React.ReactElement;
  icon2?: React.ReactElement;
  formik: any;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  icon1,
  icon2,
  formik,
  placeholder,
  type = "text",
  disabled = false,
}) => {
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowProgress(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowProgress(false);
              setProgress(0);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
    
    formik.setFieldValue(name, file || null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    formik.setFieldValue(name, null);
    const fileInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: "500",color:"#181D27" }}>
        {label}
      </Typography>
      {type === "file" ? (
        <Box>
          <Box
            sx={{
              ...inputStyles,
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            {icon1 && <Box sx={{ mr: 1 }}>{icon1}</Box>}
            <input
              type="file"
              name={name}
              style={{cursor:"pointer"}}
              onChange={handleFileChange}
              onBlur={() => formik.setFieldTouched(name, true)}
            />
            {selectedFile && (
              <IconButton
                size="small"
                onClick={handleRemoveFile}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#667085",
                  "&:hover": {
                    color: "#F04438",
                    backgroundColor: "rgba(240, 68, 56, 0.1)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          {selectedFile && (
            <Typography variant="caption" sx={{ color: "#667085", mt: 0.5, display: "block" }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
          {showProgress && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#AB865D",
                  }
                }} 
              />
              <Typography variant="caption" sx={{ color: "#6B7280", mt: 0.5, display: "block" }}>
                Uploading... {progress}%
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <TextField
          fullWidth
          type={type}
          name={name}
          placeholder={placeholder}
          sx={inputStyles}
          disabled={disabled}
          value={getIn(formik.values, name) ?? ""}
          onChange={(e) => {
            if (type === "number") {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                if (value.length <= 10) {
                  formik.setFieldValue(
                    name,
                    value === "" ? "" : parseInt(value, 10)
                  );
                }
              }
            } else if (name === "fullName") {
              let onlyAlphabets = e.target.value.replace(/[^A-Za-z\s]/g, "");
              formik.setFieldValue(name, onlyAlphabets);
            } else {
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
          error={formik.touched[name] && Boolean(formik.errors[name])}
          slotProps={{
            input: {
              ...(type === "number"
                ? {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    step: "1",
                    min: "0",
                  }
                : {}),
              startAdornment: icon1 && (
                <InputAdornment position="start">{icon1}</InputAdornment>
              ),
              endAdornment: icon2 && (
                <InputAdornment position="end">{icon2}</InputAdornment>
              ),
            },
          }}
        />
      )}
      {formik.touched[name] && formik.errors[name] && (
        <FormHelperText sx={{ color: "#F04438" }}>
          {formik.errors[name]}
        </FormHelperText>
      )}
    </Box>
  );
};

export default InputField;
