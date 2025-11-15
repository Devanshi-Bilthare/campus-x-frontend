'use client';

import { Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, CircularProgress } from "@mui/material"
import { outlineButton, button } from "@/app/theme/typography"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import { useState, useEffect } from "react"
import { useFormik } from "formik"
import InputField from "@/components/InputField"
import SelectField from "@/components/SelectField"
import { profileService } from "@/app/services/profileService"
import { successAlert, errorAlert } from "@/components/ToastGroup"

interface PersonalInfoProps {
  user: any;
  refreshProfile: () => Promise<void>;
  isEditMode?: boolean;
  onToggleEdit?: () => void;
}

const PersonalInfo = ({ user, refreshProfile, onToggleEdit }: PersonalInfoProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      username: user?.username || '',
      phoneNumber: user?.phoneNumber || '',
      city: user?.city || '',
      gender: user?.gender || '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await profileService.updateProfile(values);
        if (data.success && data.data) {
          localStorage.setItem('user', JSON.stringify(data.data));
          await refreshProfile();
          setOpen(false);
          if (onToggleEdit) onToggleEdit();
          successAlert('Profile updated successfully!', 'top-right');
        }
      } catch (error: any) {
        errorAlert(error.message || 'Failed to update profile.', 'top-right');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
        city: user.city || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
    if (onToggleEdit) onToggleEdit();
  };

  const handleClose = () => {
    setOpen(false);
    if (onToggleEdit) onToggleEdit();
    // Reset form values
    if (user) {
      formik.setValues({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
        city: user.city || '',
        gender: user.gender || '',
      });
    }
  };

  return (
    <>
      <div className="px-8">
        <div className="flex justify-between items-center mt-4">
          <Typography variant="h3">Personal Information</Typography>
          <Button sx={{ ...outlineButton }} onClick={handleOpen}>
            <EditIcon sx={{ fontSize: 20, mr: 1 }} /> Edit
          </Button>
        </div>
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6">Full Name</Typography>
            <Typography variant="body1">{user?.fullName || '--'}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6">Email</Typography>
            <Typography variant="body1">{user?.email || '--'}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6">Username</Typography>
            <Typography variant="body1">{user?.username || '--'}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6">Phone</Typography>
            <Typography variant="body1">{user?.phoneNumber || '--'}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6">City</Typography>
            <Typography variant="body1">{user?.city || '--'}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h6">Gender</Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{user?.gender || '--'}</Typography>
          </Grid>
        </Grid>
      </div>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Typography variant="h3">Edit Personal Information</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  formik={formik}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Phone"
                  name="phoneNumber"
                  type="text"
                  placeholder="Enter your phone number"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="City"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectField
                  label="Gender"
                  name="gender"
                  placeholder="Select your gender"
                  formik={formik}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
            <Button 
              sx={{ ...outlineButton,height:"50px", width:"160px"}} 
              onClick={handleClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              sx={{ ...button, width: 'auto', px: 4 }} 
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

export default PersonalInfo
