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
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { profileService } from './services/profileService';
import OfferingsList from './offerings/components/OfferingsList';
import { getUser } from './utils/auth';

export default function Home() {
  const router = useRouter();
  const [topOfferings, setTopOfferings] = useState<any[]>([]);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = getUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [offerings, contributors] = await Promise.all([
          profileService.getTopOfferings(6),
          profileService.getTopContributors(6),
        ]);
        setTopOfferings(offerings);
        setTopContributors(contributors);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/offerings?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/offerings');
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    return duration.replace(/(\d+)\s*(hour|minute|day)s?/i, (match, num, unit) => {
      return `${num} ${unit}${parseInt(num) !== 1 ? 's' : ''}`;
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #16796f 0%, #0f4a42 100%)',
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
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                  color: '#fff',
                }}
              >
                Develop your skills in a new and unique way
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 4,
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6,
                }}
              >
                Join our platform to learn from expert instructors and connect with a community of learners. 
                Book sessions, share knowledge, and grow together.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/offerings')}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#16796f',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  Browse Offerings
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Watch Video
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 300, md: 400 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 250, md: 350 },
                    height: { xs: 250, md: 350 },
                    borderRadius: '50%',
                    border: '3px dashed rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 200, md: 280 },
                      height: { xs: 200, md: 280 },
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: { xs: 100, md: 150 }, color: '#fff' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#16796f' }}>
            Search Offerings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Or, Search for over 50+ offerings
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search for over 50+ offerings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#16796f' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#16796f',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: '#16796f',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#125a4f',
                },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  maxWidth: 300,
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: '#16796f',
                      fontSize: '2rem',
                    }}
                  >
                    {i}
                  </Avatar>
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#16796f' }}>
                Benefits From Our Platform
              </Typography>
              <Stack spacing={3}>
                {[
                  { icon: <SchoolIcon />, title: 'Expert Instructors', desc: 'Learn from certified professionals' },
                  { icon: <MenuBookIcon />, title: 'Flexible Sessions', desc: 'Book sessions at your convenience' },
                  { icon: <PersonIcon />, title: 'Personalized Learning', desc: 'One-on-one or group sessions' },
                  { icon: <PlayArrowIcon />, title: '100+ Offerings', desc: 'Wide variety of courses available' },
                ].map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
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
                        flexShrink: 0,
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Popular Offerings Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#16796f' }}>
            Popular Offerings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover the most booked sessions on our platform
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : topOfferings.length > 0 ? (
          <Grid container spacing={3}>
            {topOfferings.map((offering) => {
              const instructor = offering.userId || offering.user || {};
              const instructorName = instructor.fullName || instructor.username || 'Instructor';
              const instructorImage = instructor.profilePicture || instructor.profileImage || '/auth/profile.png';
              const firstTag = offering.tags && offering.tags.length > 0 ? offering.tags[0] : null;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={offering._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    {offering.image && (
                      <Box sx={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                        <Image
                          src={offering.image}
                          alt={offering.title || 'Offering image'}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                        {firstTag && (
                          <Chip
                            label={capitalizeFirstLetter(firstTag)}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: '#16796f',
                              color: '#fff',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar
                          src={instructorImage}
                          alt={instructorName}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: '#667085' }}>
                          {instructorName}
                        </Typography>
                      </Box>

                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.4 }}>
                        {capitalizeFirstLetter(offering.title)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '0.875rem',
                        }}
                      >
                        {offering.description}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: '#16796f' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {formatDuration(offering.duration)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {offering.completedCount || 0} Sessions
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => router.push(`/offerings`)}
                        sx={{
                          mt: 'auto',
                          backgroundColor: '#16796f',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.25,
                          borderRadius: 1.5,
                          '&:hover': {
                            backgroundColor: '#125a4f',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No popular offerings found.
          </Typography>
        )}
      </Container>

      {/* Top Contributors Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#16796f' }}>
              Top Contributors
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Meet our expert instructors and active learners
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : topContributors.length > 0 ? (
            <Grid container spacing={3}>
              {topContributors.map((contributor) => {
                const contributorName = contributor.fullName || contributor.username || 'User';
                const contributorImage = contributor.profilePicture || contributor.profileImage || '/auth/profile.png';
                const contributorId = contributor._id || contributor.id;

                return (
                  <Grid size={{ xs: 6, sm: 4, md: 2 }} key={contributorId}>
                    <Link
                      href={`/profile/${contributorId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Card
                        sx={{
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 3,
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          },
                        }}
                      >
                        <Avatar
                          src={contributorImage}
                          alt={contributorName}
                          sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2,
                            border: '3px solid #16796f',
                          }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#16796f' }}>
                          {contributorName}
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No contributors found.
            </Typography>
          )}
        </Container>
      </Box>

      {/* Top Offerings Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#16796f' }}>
            Top Offerings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our most popular learning sessions
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : (
          <OfferingsList
            offerings={topOfferings.slice(0, 6)}
            showBookingButton={!!currentUser}
          />
        )}
      </Container>
    </Box>
  );
}
