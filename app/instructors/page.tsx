'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  TextField,
  InputAdornment,
  Rating,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { profileService } from '../services/profileService';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [instructorReviews, setInstructorReviews] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const allInstructors = await profileService.getTopInstructors(100); // Get many instructors
        setInstructors(allInstructors);
        setFilteredInstructors(allInstructors);

        // Fetch reviews for each instructor
        const reviewsMap: { [key: string]: any } = {};
        await Promise.all(
          allInstructors.slice(0, 10).map(async (instructor: any) => {
            const instructorId = instructor._id || instructor.id;
            if (instructorId) {
              try {
                const reviewsData = await profileService.getReviewsByProfile(instructorId);
                reviewsMap[instructorId] = reviewsData;
              } catch (error) {
                console.error(`Failed to fetch reviews for instructor ${instructorId}:`, error);
              }
            }
          })
        );
        setInstructorReviews(reviewsMap);
      } catch (error) {
        console.error('Failed to fetch instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInstructors(instructors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = instructors.filter((instructor) => {
        const name = (instructor.fullName || instructor.username || '').toLowerCase();
        const username = (instructor.username || '').toLowerCase();
        return name.includes(query) || username.includes(query);
      });
      setFilteredInstructors(filtered);
    }
  }, [searchQuery, instructors]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#16796f' }}>
            Find Instructors
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover expert instructors and book sessions to enhance your skills
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search instructors by name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  '&.Mui-focused fieldset': {
                    borderColor: '#16796f',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Instructors Grid */}
        {filteredInstructors.length > 0 ? (
          <Grid container spacing={3}>
            {filteredInstructors.map((instructor) => {
              const instructorName = instructor.fullName || instructor.username || 'Instructor';
              const instructorUsername = instructor.username || '';
              const instructorImage = instructor.profilePicture || instructor.profileImage || '/auth/profile.png';
              const instructorId = instructor._id || instructor.id;
              const completedSessions = instructor.completedSessions || 0;
              const reviews = instructorReviews[instructorId] || { reviews: [], averageRating: 0, totalReviews: 0 };
              const topReviews = reviews.reviews?.slice(0, 2) || [];
              const isTopInstructor = completedSessions > 0 && topReviews.length > 0;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={instructorId}>
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
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Instructor Info */}
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Link
                          href={`/profile/${instructorId}`}
                          style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                          <Avatar
                            src={instructorImage}
                            alt={instructorName}
                            sx={{
                              width: 100,
                              height: 100,
                              mx: 'auto',
                              mb: 2,
                              border: '3px solid #16796f',
                              cursor: 'pointer',
                            }}
                          />
                        </Link>
                        <Link
                          href={`/profile/${instructorId}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#16796f' }}>
                            {instructorName}
                          </Typography>
                        </Link>
                        {instructorUsername && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            @{instructorUsername}
                          </Typography>
                        )}
                        <Chip
                          label={`${completedSessions} ${completedSessions === 1 ? 'Session' : 'Sessions'} Completed`}
                          sx={{
                            backgroundColor: '#e8f5e9',
                            color: '#16796f',
                            fontWeight: 600,
                            mb: 2,
                          }}
                        />
                      </Box>

                      {/* Reviews Section for Top Instructors */}
                      {isTopInstructor && (
                        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e4e7ec' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {reviews.averageRating?.toFixed(1) || '0.0'} ({reviews.totalReviews || 0} reviews)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {topReviews.map((review: any) => {
                              const reviewer = review.userId || review.user || {};
                              const reviewerName = reviewer.fullName || reviewer.username || 'Anonymous';
                              return (
                                <Box
                                  key={review._id || review.id}
                                  sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: '#f8fafc',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Rating value={review.rating || 0} readOnly size="small" />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    "{review.message}"
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                                    - {reviewerName}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No instructors found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Try adjusting your search query' : 'No instructors available at the moment'}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

