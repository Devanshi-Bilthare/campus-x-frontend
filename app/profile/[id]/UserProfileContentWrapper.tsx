'use client';

import { Suspense } from 'react';
import { Box, CircularProgress } from "@mui/material";
import UserProfileContent from "./UserProfileContent";

interface UserProfileContentWrapperProps {
  user: any;
}

const UserProfileContentWrapper = ({ user }: UserProfileContentWrapperProps) => {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <UserProfileContent user={user} />
    </Suspense>
  );
};

export default UserProfileContentWrapper;

