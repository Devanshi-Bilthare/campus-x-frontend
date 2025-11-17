'use client';

import { Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, CircularProgress, Chip } from "@mui/material"
import { outlineButton, button } from "@/app/theme/typography"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react"
import { useFormik } from "formik"
import InputField from "@/components/InputField"
import { profileService } from "@/app/services/profileService"
import { successAlert, errorAlert } from "@/components/ToastGroup"

interface SkillsProps {
  user: any;
  refreshProfile: () => Promise<void>;
}

const Skills = ({ user, refreshProfile }: SkillsProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const skills = user?.skills || {};
  const academicSkills = skills?.academic || [];
  const hobbySkills = skills?.hobby || [];
  const otherSkills = skills?.other || [];

  const formik = useFormik({
    initialValues: {
      academicSkills: academicSkills.join(', ') || '',
      hobbySkills: hobbySkills.join(', ') || '',
      otherSkills: otherSkills.join(', ') || '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const skillsData = {
          academic: values.academicSkills ? values.academicSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
          hobby: values.hobbySkills ? values.hobbySkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
          other: values.otherSkills ? values.otherSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
        };
        const data = await profileService.updateProfile({
          skills: skillsData,
        });
        if (data.success && data.data) {
          localStorage.setItem('user', JSON.stringify(data.data));
          await refreshProfile();
          setOpen(false);
          successAlert('Skills updated successfully!', 'top-right');
        }
      } catch (error: any) {
        // Check if error has validation errors structure
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err: any) => {
            const fieldName = err.field?.replace('skills.', '') || '';
            if (fieldName) {
              formik.setFieldError(fieldName, err.message);
              formik.setFieldTouched(fieldName, true);
            }
          });
          errorAlert(error.message || 'Please fix the validation errors.', 'top-right');
        } else {
          errorAlert(error.message || 'Failed to update skills.', 'top-right');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (skills) {
      formik.setValues({
        academicSkills: academicSkills.join(', ') || '',
        hobbySkills: hobbySkills.join(', ') || '',
        otherSkills: otherSkills.join(', ') || '',
      });
    }
  };

  return (
    <>
      <Grid size={{ xs: 12, md: 4 }} sx={{
        backgroundColor: '#52939b',
        color: '#fff',
        padding: { xs: '16px', md: '20px' },
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" color="white" sx={{ fontSize: { xs: '1.25rem', md: '2rem' } }}>
            Skills
          </Typography>
          <IconButton 
            onClick={handleOpen}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <EditIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>
        </div>
        
        {academicSkills.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="white" sx={{ opacity: 0.9, mb: 1.5, fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Academic
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {academicSkills.map((skill: string, index: number) => (
                <Chip 
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {hobbySkills.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="white" sx={{ opacity: 0.9, mb: 1.5, fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Hobby
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {hobbySkills.map((skill: string, index: number) => (
                <Chip 
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {otherSkills.length > 0 && (
          <Box>
            <Typography variant="body2" color="white" sx={{ opacity: 0.9, mb: 1.5, fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Other
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {otherSkills.map((skill: string, index: number) => (
                <Chip 
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {academicSkills.length === 0 && hobbySkills.length === 0 && otherSkills.length === 0 && (
          <Typography variant="body1" color="white" sx={{ opacity: 0.7, fontStyle: 'italic', fontSize: { xs: '0.875rem', md: '1rem' } }}>
            No skills added yet
          </Typography>
        )}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            m: { xs: 2, md: 3 },
            maxHeight: { xs: '90vh', md: 'auto' },
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, px: { xs: 2, md: 3 } }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.25rem', md: '2rem' } }}>
            Edit Skills
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Academic Skills"
                  name="academicSkills"
                  type="text"
                  placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Hobby Skills"
                  name="hobbySkills"
                  type="text"
                  placeholder="Enter skills separated by commas (e.g., Photography, Music, Sports)"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Other Skills"
                  name="otherSkills"
                  type="text"
                  placeholder="Enter skills separated by commas"
                  formik={formik}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, md: 3 }, pb: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button 
              sx={{ ...outlineButton, height: "50px", width: { xs: '100%', sm: "160px" } }} 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              sx={{ ...button, width: { xs: '100%', sm: 'auto' }, px: 4 }} 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Saving...
                </Box>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Skills

