'use client';

import ProfileBanner from "./ProfileBanner"
import PersonalInfo from "./PersonalInfo"
import AcadimicDetails from "./AcadimicDetails"
import { Grid, Box, CircularProgress } from "@mui/material"
import { useProfile } from "../hooks/useProfile"

const ProfileContent = () => {
  const { user, isLoading, refreshProfile } = useProfile();

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <ProfileBanner user={user} />
      <PersonalInfo user={user} refreshProfile={refreshProfile} />
      <Grid container spacing={2} mt={4} px={4}>
        <AcadimicDetails />
      </Grid>
    </div>
  );
};

export default ProfileContent;

