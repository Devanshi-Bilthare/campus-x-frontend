import { Suspense } from "react";
import ProfileContent from "./Components/ProfileContent"
import { Box, CircularProgress } from "@mui/material";

const ProfilePage = () => {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <ProfileContent />
    </Suspense>
  );
}

export default ProfilePage