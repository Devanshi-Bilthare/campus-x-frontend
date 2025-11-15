'use client';

import { useEffect, useState } from "react";
import { profileService } from "@/app/services/profileService";
import { getUser } from "@/app/utils/auth";

export const useProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const cachedUser = getUser();
      if (cachedUser) {
        // Fetch fresh data from API
        const data = await profileService.getProfile();
        if (data.success && data.data) {
          localStorage.setItem('user', JSON.stringify(data.data));
          setUser(data.data);
        } else {
          setUser(cachedUser);
        }
      }
    } catch (error: any) {
      // If API fails, use cached user data
      const cachedUser = getUser();
      if (cachedUser) {
        setUser(cachedUser);
      }
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return { user, isLoading, refreshProfile };
};

