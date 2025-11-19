'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, Stack, Box, CircularProgress } from "@mui/material";
import { profileService } from "@/app/services/profileService";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface OverviewSectionProps {
  user: any;
  showDashboard?: boolean; // Show dashboard stats only for current user
}

const OverviewSection = ({ user, showDashboard = true }: OverviewSectionProps) => {
  const [stats, setStats] = useState({
    totalBookedSessions: 0,
    rejected: 0,
    completed: 0,
    totalOfferings: 0,
    totalCoins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!showDashboard) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const [bookingCounts, offeringsCount] = await Promise.all([
          profileService.getBookingCounts(),
          profileService.getTotalOfferingsCount(),
        ]);

        setStats({
          totalBookedSessions: bookingCounts.totalBookedSessions || 0,
          rejected: bookingCounts.rejectedBookings || 0,
          completed: bookingCounts.completedBookings || 0,
          totalOfferings: offeringsCount,
          totalCoins: user?.coins || user?.totalCoins || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, showDashboard]);


  const dashboardStats = [
    {
      label: "Total Booked Sessions",
      value: stats.totalBookedSessions,
      icon: <EventAvailableIcon sx={{ fontSize: 32, color: '#16796f' }} />,
      color: '#16796f',
      bgColor: '#e8f5e9',
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <CancelIcon sx={{ fontSize: 32, color: '#d32f2f' }} />,
      color: '#d32f2f',
      bgColor: '#ffebee',
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#2e7d32' }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      label: "Total Offerings",
      value: stats.totalOfferings,
      icon: <MenuBookIcon sx={{ fontSize: 32, color: '#1976d2' }} />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      label: "Total Coins",
      value: stats.totalCoins,
      icon: <AttachMoneyIcon sx={{ fontSize: 32, color: '#f57c00' }} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
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
            Your booking and offering statistics at a glance.
          </Typography>
        </div>

        {/* Dashboard Stats - Show all for current user, only coins for other users */}
        {showDashboard ? (
          <>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {dashboardStats.map((stat) => (
                  <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                    <Card
                      sx={{
                        borderRadius: "12px",
                        border: "1px solid #EAECF0",
                        boxShadow: "none",
                        background: stat.bgColor,
                        height: "100%",
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ py: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Box sx={{ mb: 1.5 }}>
                          {stat.icon}
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{ 
                            color: stat.color, 
                            fontWeight: 700,
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ 
                            color: "#535862", 
                            textTransform: "uppercase", 
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
              <Card
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #EAECF0",
                  boxShadow: "none",
                  background: '#fff3e0',
                  height: "100%",
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ py: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box sx={{ mb: 1.5 }}>
                    <AttachMoneyIcon sx={{ fontSize: 32, color: '#f57c00' }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ 
                      color: '#f57c00', 
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {user?.coins || user?.totalCoins || 0}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      color: "#535862", 
                      textTransform: "uppercase", 
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    Total Coins
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Card>
  );
};

export default OverviewSection;

