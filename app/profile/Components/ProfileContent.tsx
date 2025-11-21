'use client';

import { useState, SyntheticEvent, useEffect } from "react";
import { Grid, Box, CircularProgress, Tabs, Tab, Stack, useMediaQuery, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSearchParams } from 'next/navigation';
import ProfileBanner from "./ProfileBanner";
import PersonalInfo from "./PersonalInfo";
import AcadimicDetails from "./AcadimicDetails";
import Skills from "./Skills";
import Certificates from "./Certificates";
import { useProfile } from "../hooks/useProfile";
import ProfileOfferings from "@/app/offerings/components/ProfileOfferings";
import AddOfferings from "@/app/offerings/components/AddOfferings";
import MyBookings from "./MyBookings";
import BookedSessions from "./BookedSessions";
import PendingBookings from "./PendingBookings";
import CompletedBookings from "./CompletedBookings";
import RejectedBookings from "./RejectedBookings";
import CanceledBookings from "./CanceledBookings";
import OverviewSection from "./OverviewSection";
import Reviews from "./Reviews";

const STUDENT_TABS = [
  { label: "Overview", value: "overview" },
  { label: "My Bookings", value: "my-bookings" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
  { label: "Profile Info", value: "personal" },
];

const TEACHER_TABS = [
  { label: "Overview", value: "overview" },
  { label: "My Offerings", value: "offerings" },
  { label: "Booked Sessions", value: "booked-sessions" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
  { label: "Reviews", value: "reviews" },
  { label: "Personal Info", value: "personal" },
];

const ProfileContent = () => {
  const { user, isLoading, refreshProfile } = useProfile();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openModal, setOpenModal] = useState(false);
  const [offeringsRefreshKey, setOfferingsRefreshKey] = useState(0);

  // Determine user role and get appropriate tabs
  const userRole = user?.role || 'student';
  const isTeacher = userRole === 'teacher';
  const TABS = isTeacher ? TEACHER_TABS : STUDENT_TABS;

  // Check for tab query parameter
  useEffect(() => {
    try {
      const tabParam = searchParams?.get('tab');
      if (tabParam) {
        const validTabs = isTeacher ? TEACHER_TABS : STUDENT_TABS;
        if (validTabs.some(tab => tab.value === tabParam)) {
          setActiveTab(tabParam);
        }
      }
    } catch (error) {
      // Handle error silently - use default tab
      console.error('Error reading search params:', error);
    }
  }, [searchParams, isTeacher]);

  const triggerOfferingsRefresh = () => {
    setOfferingsRefreshKey((prev) => prev + 1);
  };

  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <ProfileBanner user={user} refreshProfile={refreshProfile} />

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
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: { xs: 3, md: 4 }, px: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
        {activeTab === "overview" && (
          <OverviewSection user={user} showDashboard={true} refreshKey={offeringsRefreshKey} />
        )}

        {activeTab === "personal" && (
          <Stack spacing={4}>
            <PersonalInfo user={user} refreshProfile={refreshProfile} />
            <Grid container spacing={2}>
              <AcadimicDetails user={user} refreshProfile={refreshProfile} />
              <Skills user={user} refreshProfile={refreshProfile} />
              <Certificates user={user} refreshProfile={refreshProfile} />
            </Grid>
          </Stack>
        )}

        {activeTab === "offerings" && (
          <Box sx={{ minHeight: 200, position: "relative" }}>
            {/* Add Offering Button on top right */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                Add Offering
              </Button>
            </Box>

            {/* Offerings List */}
            <ProfileOfferings refreshKey={offeringsRefreshKey} />

            {/* Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
              <DialogTitle>Add New Offering</DialogTitle>
              <DialogContent>
                <AddOfferings
                  closeModal={() => setOpenModal(false)}
                  onAdded={triggerOfferingsRefresh}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {activeTab === "my-bookings" && (
          <Box sx={{ minHeight: 200 }}>
            <MyBookings />
          </Box>
        )}

        {activeTab === "booked-sessions" && (
          <Box sx={{ minHeight: 200 }}>
            <BookedSessions onStatusUpdate={refreshProfile} />
          </Box>
        )}

        {activeTab === "pending" && (
          <Box sx={{ minHeight: 200 }}>
            <PendingBookings />
          </Box>
        )}

        {activeTab === "rejected" && (
          <Box sx={{ minHeight: 200 }}>
            <RejectedBookings />
          </Box>
        )}

        {activeTab === "completed" && (
          <Box sx={{ minHeight: 200 }}>
            <CompletedBookings />
          </Box>
        )}

        {activeTab === "canceled" && (
          <Box sx={{ minHeight: 200 }}>
            <CanceledBookings />
          </Box>
        )}

        {activeTab === "reviews" && isTeacher && (
          <Box sx={{ minHeight: 200 }}>
            <Reviews profileId={user?._id || user?.id} profileUserId={user?._id || user?.id} />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ProfileContent;

