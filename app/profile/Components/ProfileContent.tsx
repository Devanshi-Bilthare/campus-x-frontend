'use client';

import { useState, SyntheticEvent } from "react";
import { Grid, Box, CircularProgress, Tabs, Tab, Stack, useMediaQuery, useTheme } from "@mui/material";
import ProfileBanner from "./ProfileBanner";
import PersonalInfo from "./PersonalInfo";
import AcadimicDetails from "./AcadimicDetails";
import Skills from "./Skills";
import Certificates from "./Certificates";
import { useProfile } from "../hooks/useProfile";

const TABS = [
  { label: "Overview", value: "overview" },
  { label: "Offerings", value: "offerings" },
  { label: "Personal Info", value: "personal" },
];

const ProfileContent = () => {
  const { user, isLoading, refreshProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
              color: "#25666e",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#25666e",
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

      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        {activeTab === "overview" && (
          <Box sx={{ minHeight: 200 }} />
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
          <Box sx={{ minHeight: 200 }} />
        )}
      </Box>
    </div>
  );
};

export default ProfileContent;

