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
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Rating from '@mui/material/Rating';
import { profileService } from './services/profileService';
import OfferingsList from './offerings/components/OfferingsList';
import { getUser } from './utils/auth';

export default function Home() {
  const router = useRouter();
  const [topOfferings, setTopOfferings] = useState<any[]>([]);
  const [topInstructors, setTopInstructors] = useState<any[]>([]);
  const [totalOfferings, setTotalOfferings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = getUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [offerings, instructors, allOfferings] = await Promise.all([
          profileService.getTopOfferings(6),
          profileService.getTopInstructors(6),
          profileService.getAllOfferings().catch(() => []),
        ]);
        setTopOfferings(offerings);
        setTopInstructors(instructors);
        setTotalOfferings(allOfferings);
        
        // Fetch some recent reviews
        try {
          const allReviews = await profileService.getReviews({ limit: 6 });
          setReviews(Array.isArray(allReviews) ? allReviews : (allReviews?.data || []));
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
          setReviews([]);
        }
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
            src="/homebanner.jpg"
            alt="Learning"
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
              background: 'linear-gradient(135deg, rgba(22, 121, 111, 0.7) 0%, rgba(15, 74, 66, 0.3) 100%)',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Content */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, position: 'relative', zIndex: 2 }}>
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
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                Your Skills Can Change Someone's Journey.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 4,
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 1.6,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
               Teach what you know or learn something new. Book sessions, collaborate, and be part of a community built on knowledge exchange.
              </Typography>
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Browse Offerings
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#16796f' }}>
            Search Offerings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Or, Search for over {totalOfferings.length}+ offerings
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder={`Search for over ${topOfferings.length}+ offerings`}
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
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 3,
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                {/* Top-left: Circular shape with light blue background */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    bgcolor: '#E3F2FD',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src="/benifit-1.avif"
                    alt="Benefit 1"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                {/* Top-right: Rounded rectangle with top-left corner rounded, vibrant blue background */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '16px 16px 16px 4px',
                    overflow: 'hidden',
                    bgcolor: '#1976D2',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src="/benifit-2.avif"
                    alt="Benefit 2"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                {/* Bottom-left: Rounded rectangle with top-right corner rounded, soft lavender background */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '4px 16px 16px 16px',
                    overflow: 'hidden',
                    bgcolor: '#E1BEE7',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src="/benifit-3.avif"
                    alt="Benefit 3"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                {/* Bottom-right: Circular shape with bright blue background */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    bgcolor: '#03A9F4',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src="/benifit-4.avif"
                    alt="Benefit 4"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#16796f' }}>
                Benefits From Our Platform
              </Typography>
              <Stack spacing={3}>
                {[
                  { icon: <SchoolIcon />, title: 'Skill-Based Learning', desc: 'Learn directly from students and mentors who actually practice the skills you want to master.' },
                  { icon: <MenuBookIcon />, title: 'Flexible Session Booking', desc: 'Choose your preferred time slots and learn at your own pace—no rigid schedules.' },
                  { icon: <SchoolIcon />, title: `${totalOfferings.length}+ Skill Offerings`, desc: 'Explore a growing library of academic, technical, creative, and hobby-based offerings.'},
                  { icon: <MenuBookIcon />, title: 'Teach & Earn', desc: 'Share your knowledge, conduct sessions, and earn coins or rewards for every completed class.' },
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
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
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

      {/* Top Instructors Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#16796f' }}>
              Top Instructors
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Meet our expert instructors who have conducted the most sessions
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : topInstructors.length > 0 ? (
            <Grid container spacing={3}>
              {topInstructors.map((instructor) => {
                const instructorName = instructor.fullName || instructor.username || 'Instructor';
                const instructorImage = instructor.profilePicture || instructor.profileImage || '/auth/profile.png';
                const instructorId = instructor._id || instructor.id;
                const completedSessions = instructor.completedSessions || 0;

                return (
                  <Grid size={{ xs: 6, sm: 4, md: 2 }} key={instructorId}>
                    <Link
                      href={`/profile/${instructorId}`}
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
                          src={instructorImage}
                          alt={instructorName}
                          sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2,
                            border: '3px solid #16796f',
                          }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#16796f', mb: 0.5 }}>
                          {instructorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {completedSessions} {completedSessions === 1 ? 'Session' : 'Sessions'}
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No instructors found.
            </Typography>
          )}
        </Container>
      </Box>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#16796f' }}>
              Recent Reviews
            </Typography>
            <Typography variant="body1" color="text.secondary">
              See what our community is saying
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {reviews.slice(0, 6).map((review: any) => {
              const reviewer = review.userId || review.user || {};
              const reviewerName = reviewer.fullName || reviewer.username || 'Anonymous';
              const reviewerImage = reviewer.profilePicture || reviewer.profileImage || '/auth/profile.png';
              const profile = review.profileId || review.profile || {};
              const profileName = profile.fullName || profile.username || 'Instructor';
              const profileId = profile._id || profile.id;

              return (
                <Grid size={{ xs: 12, md: 6 }} key={review._id || review.id}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Avatar
                        src={reviewerImage}
                        alt={reviewerName}
                        sx={{ width: 48, height: 48 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {reviewerName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={review.rating || 0} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            for{' '}
                            {profileId ? (
                              <Link
                                href={`/profile/${profileId}`}
                                style={{ color: '#16796f', textDecoration: 'none' }}
                              >
                                {profileName}
                              </Link>
                            ) : (
                              profileName
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {review.message}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}

    </Box>
  );
}
