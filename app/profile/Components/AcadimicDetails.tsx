'use client';

import { Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, CircularProgress } from "@mui/material"
import { outlineButton, button } from "@/app/theme/typography"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import InputField from "@/components/InputField"
import SelectField from "@/components/SelectField"
import { profileService } from "@/app/services/profileService"
import { successAlert, errorAlert } from "@/components/ToastGroup"

interface AcadimicDetailsProps {
  user: any;
  refreshProfile: () => Promise<void>;
  isEditMode?: boolean;
}

const AcadimicDetails = ({ user, refreshProfile, isEditMode = true }: AcadimicDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const academics = user?.academics || {};

  const validationSchema = Yup.object({
    collegeName: Yup.string().required('College name is required'),
    branch: Yup.string().required('Branch is required'),
  });

  const formik = useFormik({
    initialValues: {
      collegeName: academics?.collegeName || '',
      branch: academics?.branch || '',
      semester: academics?.semester || '',
      yearOfGraduation: academics?.yearOfGraduation || '',
      yearOfJoining: academics?.yearOfJoining || '',
      gpa: academics?.gpa || '',
      degree: academics?.degree || '',
      yearsOfExperience: academics?.yearsOfExperience || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data: any = await profileService.updateProfile({
          academics: values,
        });
        if (data.success && data.data) {
          localStorage.setItem('user', JSON.stringify(data.data));
          await refreshProfile();
          setOpen(false);
          successAlert('Academic details updated successfully!', 'top-right');
        } else if (data.errors && Array.isArray(data.errors)) {
          // Handle validation errors
          data.errors.forEach((err: any) => {
            const fieldName = err.field?.replace('academics.', '') || '';
            if (fieldName) {
              formik.setFieldError(fieldName, err.message);
              formik.setFieldTouched(fieldName, true);
            }
          });
          errorAlert(data.message || 'Please fix the validation errors.', 'top-right');
        }
      } catch (error: any) {
        // Check if error has validation errors structure
        if (error.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err: any) => {
            const fieldName = err.field?.replace('academics.', '') || '';
            if (fieldName) {
              formik.setFieldError(fieldName, err.message);
              formik.setFieldTouched(fieldName, true);
            }
          });
          errorAlert(error.message || 'Please fix the validation errors.', 'top-right');
        } else {
          errorAlert(error.message || 'Failed to update academic details.', 'top-right');
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
    if (academics) {
      formik.setValues({
        collegeName: academics?.collegeName || '',
        branch: academics?.branch || '',
        semester: academics?.semester || '',
        yearOfGraduation: academics?.yearOfGraduation || '',
        yearOfJoining: academics?.yearOfJoining || '',
        gpa: academics?.gpa || '',
        degree: academics?.degree || '',
        yearsOfExperience: academics?.yearsOfExperience || '',
      });
    }
  };

  return (
    <>
      <Grid size={{ xs: 12, md: 4 }} sx={{
        backgroundColor: '#16796f',
        color: '#fff',
        padding: { xs: '16px', md: '20px' },
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h3" color="white" sx={{ fontSize: { xs: '1.25rem', md: '2rem' } }}>
            Academic Details
          </Typography>
          {isEditMode && (
            <IconButton
              onClick={handleOpen}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <EditIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
            </IconButton>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            College
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, textAlign: { xs: 'left', sm: 'right' }, maxWidth: { sm: '60%' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.collegeName || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Branch
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, textAlign: { xs: 'left', sm: 'right' }, maxWidth: { sm: '60%' }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.branch || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Semester
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.semester || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Year of Graduation
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.yearOfGraduation || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Year of Joining
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.yearOfJoining || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            GPA
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.gpa || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b border-white/30 pb-2 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Degree
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.degree || '--'}
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-1">
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Years of Experience
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {academics?.yearsOfExperience || '--'}
          </Typography>
        </div>
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
            Edit Academic Details
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ px: { xs: 2, md: 3 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="College Name"
                  name="collegeName"
                  type="text"
                  placeholder="Enter your college name"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Branch"
                  name="branch"
                  type="text"
                  placeholder="Enter your branch"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Semester"
                  name="semester"
                  type="number"
                  placeholder="Enter your semester"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Year of Graduation"
                  name="yearOfGraduation"
                  type="number"
                  placeholder="Enter year of graduation"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Year of Joining"
                  name="yearOfJoining"
                  type="number"
                  placeholder="Enter year of joining"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="GPA"
                  name="gpa"
                  type="number"
                  placeholder="Enter your GPA"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Degree"
                  name="degree"
                  type="text"
                  placeholder="Enter your degree"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Years of Experience"
                  name="yearsOfExperience"
                  type="number"
                  placeholder="Enter years of experience"
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
              disabled={isLoading || !formik.isValid}
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

export default AcadimicDetails
