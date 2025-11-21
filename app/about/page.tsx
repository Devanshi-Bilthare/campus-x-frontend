'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  CircularProgress
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { profileService } from '../services/profileService';

export default function About() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOfferings: 0,
    totalSessions: 0,
    topContributors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch statistics for the about page
        const [offerings, contributors] = await Promise.all([
          profileService.getAllOfferings().catch(() => []),
          profileService.getTopContributors(10).catch(() => []),
        ]);

        // Calculate total sessions booked
        const totalSessions = offerings.reduce((sum: number, off: any) => {
          return sum + (off.completedCount || 0);
        }, 0);

        setStats({
          totalUsers: contributors.length,
          totalOfferings: offerings.length,
          totalSessions,
          topContributors: contributors.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 4 },
          overflow: 'hidden',
          minHeight: { xs: 400, md: 550 },
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <Image
            src="/mentors.avif"
            alt="Great Learning Starts With Great Mentors"
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
          {/* Overlay for better text readability */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(22, 121, 111, 0.7) 0%, rgba(15, 74, 66, 0.7) 100%)',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Content Overlay */}
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 }, position: 'relative', zIndex: 2, height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
              color: '#fff',
              py: { xs: 4, md: 6 },
              maxWidth: { xs: '100%', md: '800px' },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.2,
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Great Learning Starts With Great Mentors
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                mb: 4,
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.6,
                maxWidth: { xs: '100%', md: '600px' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Join a growing learning community where students learn from skilled peers, book personalized sessions, and grow academically and creatively through real, experience-based teaching.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/instructors')}
              sx={{
                backgroundColor: '#fff',
                color: '#16796f',
                px: 5,
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Find Instructors
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 700,
              mb: 2,
              color: '#16796f',
            }}
          >
            Our Amazing Features
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Everything you need to learn, teach, and grow in one platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid #e4e7ec',
                bgcolor: '#fff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(22, 121, 111, 0.15)',
                  borderColor: '#16796f',
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: '#e8f5e9',
                  color: '#16796f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <RateReviewIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#101828' }}>
                Collect Reviews
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                Get authentic feedback from learners and build a strong, trustworthy reputation on the platform.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid #e4e7ec',
                bgcolor: '#fff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(22, 121, 111, 0.15)',
                  borderColor: '#16796f',
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: '#e8f5e9',
                  color: '#16796f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <MenuBookIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#101828' }}>
                Start Your Offering
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                Share your expertise through personalized sessions and help others learn the skills you've mastered.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid #e4e7ec',
                bgcolor: '#fff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(22, 121, 111, 0.15)',
                  borderColor: '#16796f',
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: '#e8f5e9',
                  color: '#16796f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <WorkspacePremiumIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#101828' }}>
                Top Rated Instructors
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                Learn from the best — instructors with proven track records, great reviews, and real teaching experience.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 3,
                border: '1px solid #e4e7ec',
                bgcolor: '#fff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(22, 121, 111, 0.15)',
                  borderColor: '#16796f',
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  bgcolor: '#e8f5e9',
                  color: '#16796f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#101828' }}>
                Create Your Profile
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                Build a comprehensive profile showcasing your skills, achievements, certifications, and offerings.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Marketplace Exploration Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 700,
                mb: 2,
                color: '#16796f',
              }}
            >
              Explore the Marketplace
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Discover offerings across various categories and find the perfect learning opportunity
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { name: 'Web Development', icon: <SchoolIcon /> },
              { name: 'Graphic Design', icon: <MenuBookIcon /> },
              { name: 'Music & Instruments', icon: <StarIcon /> },
              { name: 'Digital Marketing', icon: <TrendingUpIcon /> },
              { name: 'Fitness & Yoga', icon: <PersonIcon /> },
              { name: 'Photography & Video', icon: <RateReviewIcon /> },
              { name: 'Art & Craft', icon: <WorkspacePremiumIcon /> },
              { name: 'Finance & Investing', icon: <EventAvailableIcon /> },
            ].map((category, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3.5,
                    borderRadius: 3,
                    border: '1px solid #e4e7ec',
                    bgcolor: '#fff',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(22, 121, 111, 0.15)',
                      borderColor: '#16796f',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 3,
                      bgcolor: '#e8f5e9',
                      color: '#16796f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#101828',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Top Rated Instructors Section */}
      <Box
        sx={{
          backgroundColor: '#fff',
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          position: 'relative',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: { xs: 300, md: 450 },
                }}
              >
                {/* Circle with image background and teal overlay */}
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 280, md: 360 },
                    height: { xs: 280, md: 360 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 12px 48px rgba(22, 121, 111, 0.2)',
                  }}
                >
                  {/* Image background */}
                  <Image
                    src="/top-mentor.avif"
                    alt="Top Rated Instructors - Network visualization"
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  {/* Teal overlay with reduced opacity */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(22, 121, 111, 0.6)',
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: '3.5rem', md: '5rem' },
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1,
                      }}
                    >
                      {loading ? '...' : `${stats.topContributors}+`}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        mt: 1.5,
                        fontWeight: 600,
                        fontSize: { xs: '1.125rem', md: '1.375rem' },
                      }}
                    >
                      Active Instructors
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: '#16796f',
                }}
              >
                Hire Our Top Instructors
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  mb: 4,
                  color: '#667085',
                  lineHeight: 1.8,
                }}
              >
                Discover skilled and highly-rated instructors with exceptional student feedback. Whether you're learning a new skill or improving an existing one, our top tutors are ready to guide you with personalized, high-quality sessions. Find the perfect match for your learning goals and start your journey today.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/instructors')}
                sx={{
                  backgroundColor: '#16796f',
                  color: '#fff',
                  px: 5,
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(22, 121, 111, 0.3)',
                  '&:hover': {
                    backgroundColor: '#125a4f',
                    boxShadow: '0 6px 16px rgba(22, 121, 111, 0.4)',
                  },
                }}
              >
                Find Instructors
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 700,
              mb: 2,
              color: '#16796f',
            }}
          >
            Our Impact
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Numbers that reflect our commitment to quality education
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { icon: <GroupsIcon />, value: loading ? '...' : `${stats.totalUsers}+`, label: 'Active Users' },
            { icon: <MenuBookIcon />, value: loading ? '...' : `${stats.totalOfferings}+`, label: 'Total Offerings' },
            { icon: <EventAvailableIcon />, value: loading ? '...' : `${stats.totalSessions}+`, label: 'Sessions Completed' },
            { icon: <StarIcon />, value: loading ? '...' : `${stats.topContributors}+`, label: 'Top Instructors' },
          ].map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e4e7ec',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(22, 121, 111, 0.15)',
                    borderColor: '#16796f',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 3,
                    bgcolor: '#e8f5e9',
                    color: '#16796f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#16796f',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
