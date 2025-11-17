'use client';

import { useState, SyntheticEvent } from "react";
import { Grid, Box, CircularProgress, Tabs, Tab, Stack } from "@mui/material";
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

      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#667085",
            },
            "& .Mui-selected": {
              color: "#25666e",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#25666e",
              height: "3px",
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

