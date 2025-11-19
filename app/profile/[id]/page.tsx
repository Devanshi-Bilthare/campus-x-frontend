'use client';

import { Suspense } from "react";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from "@mui/material";
import UserProfileContent from "./UserProfileContent";
import { profileService } from "@/app/services/profileService";

const UserProfilePage = () => {
  const params = useParams();
  const userId = params?.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      try {
        const result = await profileService.getUserById(userId);
        if (result.success && result.data) {
          setUser(result.data);
        } else if (result.data) {
          setUser(result.data);
        } else {
          setError('User not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch user:', err);
        setError(err.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error || 'User not found'}</Typography>
      </Box>
    );
  }

  return <UserProfileContent user={user} />;
};

const UserProfilePageWrapper = () => {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <UserProfilePage />
    </Suspense>
  );
};

export default UserProfilePageWrapper;

