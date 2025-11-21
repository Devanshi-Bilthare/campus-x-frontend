'use client';

import { useState, SyntheticEvent, useEffect } from "react";
import { Box, Tabs, Tab, useMediaQuery, useTheme, Grid, Stack, CircularProgress, Typography } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import ProfileBanner from "../Components/ProfileBanner";
import PersonalInfo from "../Components/PersonalInfo";
import AcadimicDetails from "../Components/AcadimicDetails";
import Skills from "../Components/Skills";
import Certificates from "../Components/Certificates";
import OverviewSection from "../Components/OverviewSection";
import Reviews from "../Components/Reviews";
import OfferingsList from "@/app/offerings/components/OfferingsList";
import { profileService } from "@/app/services/profileService";

const USER_TABS = [
  { label: "Overview", value: "overview" },
  { label: "Offerings", value: "offerings" },
  { label: "Reviews", value: "reviews" },
  { label: "Personal Info", value: "personal" },
];

interface UserProfileContentProps {
  user: any;
}

const UserOfferings = ({ userId }: { userId: string }) => {
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOfferings = async () => {
      setLoading(true);
      try {
        // Fetch all offerings and filter by userId
        const allOfferings = await profileService.getAllOfferings();
        const userOfferings = allOfferings.filter((off: any) => 
          (off.userId?._id || off.userId?.id || off.user?._id || off.user?.id) === userId
        );
        setOfferings(userOfferings);
      } catch (error) {
        console.error('Failed to fetch user offerings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserOfferings();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (offerings.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="text.secondary">No offerings found.</Typography>
      </Box>
    );
  }

  return <OfferingsList offerings={offerings} showBookingButton={true} />;
};

const UserProfileContent = ({ user }: UserProfileContentProps) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check for tab query parameter
  useEffect(() => {
    try {
      const tabParam = searchParams?.get('tab');
      if (tabParam && USER_TABS.some(tab => tab.value === tabParam)) {
        setActiveTab(tabParam);
      }
    } catch (error) {
      // Handle error silently - use default tab
      console.error('Error reading search params:', error);
    }
  }, [searchParams]);

  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const refreshProfile = async () => {
    // No-op for other users' profiles
  };

  return (
    <div>
      <ProfileBanner user={user} refreshProfile={refreshProfile} isEditMode={false} />

      <Box sx={{ mt: 4, px: { xs: 2, md: 4 }, width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={false}
          sx={{
            width: '100%',
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", md: "1rem" },
              color: "#667085",
              minWidth: { xs: 100, md: 'auto' },
            },
            "& .Mui-selected": {
              color: "#16796f",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#16796f",
              height: "3px",
            },
            "& .MuiTabs-scrollButtons": {
              display: "none",
            },
            "& .MuiTabs-scrollableContainer": {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            },
          }}
        >
          {USER_TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: { xs: 3, md: 4 }, px: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
        {activeTab === "overview" && (
          <OverviewSection user={user} showDashboard={false} profileId={user._id || user.id} />
        )}

        {activeTab === "offerings" && (
          <Box sx={{ minHeight: 200 }}>
            <UserOfferings userId={user._id || user.id} />
          </Box>
        )}

        {activeTab === "reviews" && (
          <Box sx={{ minHeight: 200 }}>
            <Reviews profileId={user._id || user.id} profileUserId={user._id || user.id} />
          </Box>
        )}

        {activeTab === "personal" && (
          <Stack spacing={4}>
            <PersonalInfo user={user} refreshProfile={refreshProfile} isEditMode={false} />
            <Grid container spacing={2}>
              <AcadimicDetails user={user} refreshProfile={refreshProfile} isEditMode={false} />
              <Skills user={user} refreshProfile={refreshProfile} isEditMode={false} />
              <Certificates user={user} refreshProfile={refreshProfile} isEditMode={false} />
            </Grid>
          </Stack>
        )}
      </Box>
    </div>
  );
};

export default UserProfileContent;

