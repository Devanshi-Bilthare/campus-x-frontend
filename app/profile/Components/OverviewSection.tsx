'use client';

import { Card, CardContent, Grid, Typography, Stack } from "@mui/material";

interface OverviewSectionProps {
  user: any;
}

const OverviewSection = ({ user }: OverviewSectionProps) => {
  const academics = user?.academics || {};
  const overviewItems = [
    { label: "Full Name", value: user?.fullName || "--" },
    { label: "Email", value: user?.email || "--" },
    { label: "Username", value: user?.username || "--" },
    { label: "City", value: user?.city || "--" },
    { label: "College", value: academics?.collegeName || "--" },
    { label: "Branch", value: academics?.branch || "--" },
    { label: "Semester", value: academics?.semester || "--" },
    { label: "GPA", value: academics?.gpa || "--" },
  ];

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(16, 24, 40, 0.08)",
        border: "1px solid #EAECF0",
        background: "#fff",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack spacing={3}>
        <div>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A quick summary of your profile details and academic snapshot.
          </Typography>
        </div>

        <Grid container spacing={3}>
          {overviewItems.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #EAECF0",
                  boxShadow: "none",
                  background: "#F8FAFC",
                  height: "100%",
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#535862", textTransform: "uppercase", fontSize: "0.75rem" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {item.value || "--"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Card>
  );
};

export default OverviewSection;

