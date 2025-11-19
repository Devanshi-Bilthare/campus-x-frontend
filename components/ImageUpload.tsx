'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

interface ImageUploadProps {
  label?: string;
  helperText?: string;
  value?: string;
  onChange: (value: string) => void;
  maxSizeMb?: number;
}

const ImageUpload = ({
  label = "Upload Image",
  helperText = "Supported formats: JPG, PNG, GIF (max 2MB)",
  value,
  onChange,
  maxSizeMb = 2,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(value || "");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size should be less than ${maxSizeMb}MB.`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      setError("");
      onChange(base64);
    } catch (err) {
      setError("Failed to load image. Please try again.");
    }
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    onChange("");
  };

  return (
    <Stack spacing={2}>
      {label && (
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      )}

      <Box
        sx={{
          border: "2px dashed #E4E7EC",
          borderRadius: "16px",
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#F8FAFC",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", px: 4 }}>
            Drag and drop an image here, or click below to upload
          </Typography>
        )}
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#16796f",
            textTransform: "none",
            px: 4,
            py: 1.5,
            "&:hover": { backgroundColor: "#125a4f" },
          }}
        >
          {preview ? "Change Image" : "Upload Image"}
          <input hidden type="file" accept="image/*" onChange={handleFileChange} />
        </Button>
        {preview && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleRemove}
            sx={{ textTransform: "none", px: 4, py: 1.5 }}
          >
            Remove
          </Button>
        )}
      </Stack>

      {helperText && !error && (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default ImageUpload;

