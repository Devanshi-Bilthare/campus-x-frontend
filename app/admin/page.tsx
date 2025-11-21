'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import { profileService } from '../services/profileService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOfferings: 0,
    totalBookings: 0,
    totalReviews: 0,
    completedBookings: 0,
    pendingBookings: 0,
    canceledBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [users, offerings, bookings, reviews] = await Promise.all([
          profileService.getAllUsers().catch(() => []),
          profileService.getAllOfferings().catch(() => []),
          profileService.getAllBookings().catch(() => []),
          profileService.getAllReviews().catch(() => []),
        ]);

        const completedBookings = bookings.filter((b: any) => b.status === 'completed');
        const pendingBookings = bookings.filter((b: any) => b.status === 'pending' || b.status === 'approved');
        const canceledBookings = bookings.filter((b: any) => b.status === 'cancelled' || b.status === 'canceled');

        setStats({
          totalUsers: users.length,
          totalOfferings: offerings.length,
          totalBookings: bookings.length,
          totalReviews: reviews.length,
          completedBookings: completedBookings.length,
          pendingBookings: pendingBookings.length,
          canceledBookings: canceledBookings.length,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#16796f',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Total Offerings',
      value: stats.totalOfferings,
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      color: '#16796f',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: <EventAvailableIcon sx={{ fontSize: 40 }} />,
      color: '#16796f',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Total Reviews',
      value: stats.totalReviews,
      icon: <RateReviewIcon sx={{ fontSize: 40 }} />,
      color: '#16796f',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Completed Bookings',
      value: stats.completedBookings,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: <PendingIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
    {
      label: 'Canceled Bookings',
      value: stats.canceledBookings,
      icon: <CancelIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      bgColor: '#ffebee',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#16796f' }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e4e7ec',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(22, 121, 111, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

