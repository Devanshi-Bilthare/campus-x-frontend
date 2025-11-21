'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, Stack, Box, CircularProgress, Button, Avatar, Rating } from "@mui/material";
import { useRouter } from 'next/navigation';
import { profileService } from "@/app/services/profileService";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface OverviewSectionProps {
  user: any;
  showDashboard?: boolean; // Show dashboard stats only for current user
  profileId?: string; // Profile ID for navigation (for other users' profiles)
  refreshKey?: number; // Key to force refresh
}

const OverviewSection = ({ user, showDashboard = true, profileId, refreshKey = 0 }: OverviewSectionProps) => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookedSessions: 0,
    rejected: 0,
    completed: 0,
    pending: 0,
    totalOfferings: 0,
    totalCoins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Determine user role
  const userRole = user?.role || 'student';
  const isInstructor = userRole === 'teacher';

  useEffect(() => {
    if (!showDashboard) {
      setLoading(false);
    }

    const fetchStats = async () => {
      if (showDashboard) {
        setLoading(true);
        try {
          if (isInstructor) {
            // For instructors: show total booked sessions (received), rejected, completed, offerings, coins
            const [bookingCounts, offeringsCount, profileData] = await Promise.all([
              profileService.getBookingCounts(),
              profileService.getTotalOfferingsCount(),
              profileService.getProfile().catch(() => ({ success: false, data: user })),
            ]);

            // Get fresh user data to ensure coins are up to date
            const freshUser = profileData?.success && profileData?.data ? profileData.data : user;
            
            setStats({
              totalBookedSessions: bookingCounts.totalBookedSessions || 0, // Total booked sessions (approved + completed) for instructor
              rejected: bookingCounts.rejectedBookings || 0, // Rejected bookings for instructor's offerings
              completed: bookingCounts.completedBookings || 0, // Completed bookings for instructor's offerings
              totalOfferings: offeringsCount,
              totalCoins: freshUser?.coins || freshUser?.totalCoins || 0,
            });
          } else {
            // For students: show total completed sessions and coins
            const [bookingCounts, profileData] = await Promise.all([
              profileService.getBookingCounts(),
              profileService.getProfile().catch(() => ({ success: false, data: user })),
            ]);

            // Get fresh user data to ensure coins are up to date
            const freshUser = profileData?.success && profileData?.data ? profileData.data : user;
            
            setStats({
              totalBookedSessions: 0,
              rejected: 0,
              completed: bookingCounts.myCompleted || 0, // Completed bookings made by student
              pending: bookingCounts.myPending || 0, // Pending bookings made by student
              totalOfferings: 0,
              totalCoins: freshUser?.coins || freshUser?.totalCoins || 0,
            });
          }
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchReviews = async () => {
      // Only fetch reviews for instructors
      if (!isInstructor) {
        setReviewsLoading(false);
        return;
      }
      
      setReviewsLoading(true);
      try {
        const profileId = user?._id || user?.id;
        if (profileId) {
          const data = await profileService.getReviewsByProfile(profileId);
          setReviews((data.reviews || []).slice(0, 3)); // Show only first 3 reviews
          setAverageRating(data.averageRating || 0);
          setTotalReviews(data.totalReviews || 0);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchStats();
    fetchReviews();
  }, [user, showDashboard, isInstructor, refreshKey]);


  // Different stats for instructors vs students
  const dashboardStats = isInstructor ? [
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
  ] : [
    {
      label: "Pending Sessions",
      value: stats.pending,
      icon: <EventAvailableIcon sx={{ fontSize: 32, color: '#ff9800' }} />,
      color: '#ff9800',
      bgColor: '#fff3e0',
    },
    {
      label: "Completed Sessions",
      value: stats.completed,
      icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#2e7d32' }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
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

        {/* Reviews Section - Only show for instructors */}
        {isInstructor && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Reviews
              </Typography>
              {averageRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={averageRating} readOnly precision={0.1} size="small" />
                  <Typography variant="body2" sx={{ color: '#667085' }}>
                    {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </Typography>
                </Box>
              )}
            </Box>
            {totalReviews > 3 && (
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  if (profileId && profileId !== (user?._id || user?.id)) {
                    router.push(`/profile/${profileId}?tab=reviews`);
                  } else {
                    router.push('/profile?tab=reviews');
                  }
                }}
                sx={{
                  borderColor: '#16796f',
                  color: '#16796f',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#125a4f',
                    backgroundColor: 'rgba(22, 121, 111, 0.04)',
                  },
                }}
              >
                View More
              </Button>
            )}
          </Box>

          {reviewsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
              <CircularProgress size={24} />
            </Box>
          ) : reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No reviews yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {reviews.map((review) => {
                const reviewer = review.userId || review.user || {};
                const reviewerName = reviewer.fullName || reviewer.username || 'Anonymous';
                const reviewerImage = reviewer.profilePicture || reviewer.profileImage || '/auth/profile.png';

                return (
                  <Grid size={{ xs: 12, md: 4 }} key={review._id || review.id}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                          <Avatar src={reviewerImage} alt={reviewerName} sx={{ width: 40, height: 40 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {reviewerName}
                            </Typography>
                            <Rating value={review.rating} readOnly size="small" />
                          </Box>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {review.message}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
        )}
      </Stack>
    </Card>
  );
};

export default OverviewSection;

