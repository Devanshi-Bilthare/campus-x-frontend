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
  Avatar,
  Stack,
  CircularProgress
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
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
        //   background: 'linear-gradient(135deg, #16796f 0%, #0f4a42 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                  color: '#16796f',
                }}
              >
                90% Students Choose Instructors with Better Reviews
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 4,
                  color: '#16796f',
                  lineHeight: 1.6,
                }}
              >
                Join our platform to connect with expert instructors, book personalized learning sessions, 
                and grow your skills through quality education and mentorship.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/offerings')}
                sx={{
                  backgroundColor: '#1a8a7a',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#5a9aa2',
                  },
                }}
              >
                Find Instructors
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="https://plus.unsplash.com/premium_vector-1714618947775-73eebc939856?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8"
                  alt="Hero - Students choosing instructors"
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Partnership/Integration Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: '#667085',
              fontWeight: 500,
            }}
          >
            Trusted by Leading Platforms
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {['Platform 1', 'Platform 2', 'Platform 3', 'Platform 4', 'Platform 5'].map((name, index) => (
              <Box
                key={index}
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                  bgcolor: '#fff',
                  border: '1px solid #e4e7ec',
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#667085', fontWeight: 500 }}>
                  {name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 300, md: 400 },
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Image
                src="https://plus.unsplash.com/premium_vector-1682303058649-52fb42b3c7cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D"
                alt="Features - Person with tablet"
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 3,
                color: '#16796f',
              }}
            >
              Our Amazing Features Helpful for Your Learning
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#e8f5e9',
                        color: '#16796f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <StarIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Collect Reviews
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 7 }}>
                    Get authentic feedback from students to build your reputation
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#e8f5e9',
                        color: '#16796f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MenuBookIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Start Your Offering
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 7 }}>
                    Create and share your expertise through personalized sessions
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#e8f5e9',
                        color: '#16796f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrendingUpIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Top Rated Instructors
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 7 }}>
                    Learn from the best instructors with proven track records
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#e8f5e9',
                        color: '#16796f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Create Your Profile
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 7 }}>
                    Build a comprehensive profile showcasing your skills and expertise
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Marketplace Exploration Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                color: '#16796f',
              }}
            >
              Explore the Marketplace
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover offerings across various categories
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              'Graphic Design',
              'Digital Marketing',
              'Content Writing',
              'Development',
              'Data Entry',
              'Business',
              'Web Design',
            ].map((category, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e4e7ec',
                    bgcolor: '#fff',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: '#e8f5e9',
                      color: '#16796f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#16796f' }}>
                    {category}
                  </Typography>
                </Card>
              </Grid>
            ))}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e4e7ec',
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: '#e8f5e9',
                    color: '#16796f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#16796f', mb: 0.5 }}>
                  30+ Categories
                </Typography>
                <Typography variant="body2" sx={{ color: '#667085' }}>
                  for Your Learning
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Collect Reviews Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 3,
                color: '#16796f',
              }}
            >
              Collect Reviews from Your Existing Students
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.8 }}
            >
              Build trust and credibility by showcasing authentic reviews from students 
              who have completed sessions with you. Reviews help new students make informed 
              decisions and help you grow your teaching practice.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/auth/signup')}
              sx={{
                backgroundColor: '#1a8a7a',
                color: '#fff',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#5a9aa2',
                },
              }}
            >
              Get Started
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 300, md: 400 },
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Image
                src="https://plus.unsplash.com/premium_vector-1726290624743-2cb16b1f38b2?q=80&w=996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Collect Reviews - Person with laptop showing reviews"
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Top Rated Instructors Section */}
      <Box
        sx={{
          backgroundColor: '#fff',
          py: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: { xs: 300, md: 400 },
                }}
              >
                {/* Circle with image background and teal overlay */}
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 250, md: 320 },
                    height: { xs: 250, md: 320 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  {/* Image background */}
                  <Image
                    src="https://plus.unsplash.com/premium_vector-1682269869102-5292bc3587a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D"
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
                        fontSize: { xs: '3rem', md: '4.5rem' },
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
                        mt: 1,
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.25rem' },
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
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: '#16796f',
                }}
              >
                Hire Our Top Rated Instructors
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 4,
                  color: '#535862',
                  lineHeight: 1.6,
                }}
              >
                Connect with experienced instructors who have proven track records 
                and excellent student reviews. Our platform makes it easy to find 
                the perfect instructor for your learning goals.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/offerings')}
                sx={{
                  backgroundColor: '#16796f',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#125a4f',
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            { icon: <PeopleIcon />, value: loading ? '...' : `${stats.totalUsers}+`, label: 'Active Users' },
            { icon: <MenuBookIcon />, value: loading ? '...' : `${stats.totalOfferings}+`, label: 'Total Offerings' },
            { icon: <SchoolIcon />, value: loading ? '...' : `${stats.totalSessions}+`, label: 'Sessions Completed' },
            { icon: <StarIcon />, value: loading ? '...' : `${stats.topContributors}+`, label: 'Top Instructors' },
          ].map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e4e7ec',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: '#e8f5e9',
                    color: '#16796f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
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
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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

