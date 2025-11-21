'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Stack, Chip, Typography } from "@mui/material";
import { successAlert, errorAlert } from '@/components/ToastGroup';
import ImageUpload from '@/components/ImageUpload';
import { profileService } from '@/app/services/profileService';

interface Props {
  closeModal: () => void;
  onAdded?: () => void; // optional callback to refresh list
}

const AddOfferings: React.FC<Props> = ({ closeModal, onAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [slotInput, setSlotInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};

    // Title validation: 3-200 characters
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    // Description validation: 10-2000 characters
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.trim().length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    // Duration validation: required
    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    // Slots validation: at least one slot required
    if (slots.length === 0) {
      newErrors.slots = 'At least one slot is required';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const addTag = () => {
    const trimmedValue = tagInput.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setTagInput('');
      if (errors.tags) {
        setErrors({ ...errors, tags: '' });
      }
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      addTag();
    }
  };

  const addSlot = () => {
    const trimmedValue = slotInput.trim();
    if (trimmedValue && !slots.includes(trimmedValue)) {
      setSlots([...slots, trimmedValue]);
      setSlotInput('');
      if (errors.slots) {
        setErrors({ ...errors, slots: '' });
      }
    }
  };

  const handleSlotKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      addSlot();
    }
  };

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const validation = validateForm();
    if (!validation.isValid) {
      // Show error alert if validation fails
      const errorMessages = Object.values(validation.errors).filter(msg => msg);
      if (errorMessages.length > 0) {
        errorAlert(errorMessages[0], 'top-right');
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        tags: tags.map(tag => tag.trim()),
        slots: slots.map(slot => slot.trim()),
        duration: duration.trim(),
        ...(image.trim() && { image: image.trim() }),
      };

      const result = await profileService.createOffering(payload);
      
      // Success response: { success: true, message: '...', data: offering }
      successAlert(result.message || 'Offering added successfully!', 'top-right');
      // Reset form
      setTitle('');
      setDescription('');
      setDuration('');
      setTags([]);
      setSlots([]);
      setImage('');
      setTagInput('');
      setSlotInput('');
      setErrors({});
      onAdded?.();
      closeModal();
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.errors && Array.isArray(error.errors)) {
        const backendErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const field = err.field || err.path;
          if (field) {
            backendErrors[field] = err.message || 'Validation error';
          }
        });
        setErrors(backendErrors);
        errorAlert(error.message || 'Validation failed. Please check the form.', 'top-right');
      } else {
        errorAlert(error.message || 'Failed to add offering', 'top-right');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <TextField 
        label="Title *" 
        value={title} 
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors({ ...errors, title: '' });
        }}
        error={!!errors.title}
        helperText={errors.title || `${title.length}/200 characters`}
        fullWidth 
        required
      />
      
      <TextField 
        label="Description *" 
        value={description} 
        onChange={(e) => {
          setDescription(e.target.value);
          if (errors.description) setErrors({ ...errors, description: '' });
        }}
        error={!!errors.description}
        helperText={errors.description || `${description.length}/2000 characters`}
        multiline 
        rows={4} 
        fullWidth 
        required
      />
      
      <TextField 
        label="Duration *" 
        value={duration} 
        onChange={(e) => {
          setDuration(e.target.value);
          if (errors.duration) setErrors({ ...errors, duration: '' });
        }}
        error={!!errors.duration}
        helperText={errors.duration || 'e.g., "2 hours", "30 minutes", "1 day"'}
        fullWidth 
        required
      />

      <Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <TextField 
            label="Add Tag (press Enter)" 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown} 
            fullWidth 
            helperText="Press Enter or click Add Tag"
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={addTag}
            disabled={!tagInput.trim()}
            sx={{
              minWidth: { sm: 130 },
              height: { sm: '56px' },
            }}
          >
            Add Tag
          </Button>
        </Box>
        {tags.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((t, i) => (
              <Chip 
                key={i} 
                label={t} 
                onDelete={() => setTags(tags.filter(tag => tag !== t))} 
              />
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <TextField 
            label="Add Slot (press Enter) *" 
            value={slotInput}
            onChange={(e) => setSlotInput(e.target.value)}
            onKeyDown={handleSlotKeyDown} 
            error={!!errors.slots}
            helperText={errors.slots || 'Press Enter or click Add Slot. At least one slot is required.'}
            fullWidth 
            required
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={addSlot}
            disabled={!slotInput.trim()}
            sx={{
              minWidth: { sm: 130 },
              height: { sm: '56px' },
            }}
          >
            Add Slot
          </Button>
        </Box>
        {slots.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {slots.map((s, i) => (
              <Chip 
                key={i} 
                label={s} 
                onDelete={() => {
                  setSlots(slots.filter(slot => slot !== s));
                  if (errors.slots && slots.length === 1) {
                    setErrors({ ...errors, slots: '' });
                  }
                }} 
              />
            ))}
          </Box>
        )}
        {errors.slots && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {errors.slots}
          </Typography>
        )}
      </Box>

      <Box>
        <ImageUpload
          label="Offering Image (Optional)"
          value={image}
          onChange={setImage}
          helperText="Upload an image for your offering. Max size 2MB."
          maxSizeMb={2}
        />
      </Box>

      <Button 
        type="button"
        variant="contained" 
        color="primary" 
        onClick={(e) => handleSubmit(e)} 
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Saving...' : 'Add Offering'}
      </Button>
    </Stack>
  );
};

export default AddOfferings;
