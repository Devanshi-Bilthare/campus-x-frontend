'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Chip, Avatar } from "@mui/material";
import Image from 'next/image';
import { profileService } from '@/app/services/profileService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CompletedBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get both completed bookings I made and completed bookings for my offerings
        const [myCompleted, receivedCompleted] = await Promise.all([
          profileService.getMyCompletedBookings(),
          profileService.getCompletedBookings().catch(() => [])
        ]);
        
        // Mark bookings I made vs received
        const myCompletedMarked = myCompleted.map((b: any) => ({ ...b, type: 'sent' }));
        const receivedCompletedMarked = receivedCompleted.map((b: any) => ({ ...b, type: 'received' }));
        
        setBookings([...myCompletedMarked, ...receivedCompletedMarked]);
      } catch (error) {
        console.error('Failed to fetch completed bookings:', error);
        setError('Failed to load completed bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDuration = (duration: string) => {
    if (!duration) return duration;
    if (duration.toLowerCase().includes('hour')) {
      return duration;
    }
    const match = duration.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      return `${num} hour${num !== 1 ? 's' : ''}`;
    }
    return duration;
  };

  const formatSlotTime = (slot: string) => {
    if (!slot) return slot;
    if (slot.match(/^\d{1,2}:\d{2}/) || slot.match(/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)/i)) {
      return slot;
    }
    return capitalizeFirstLetter(slot);
  };

  if (!bookings.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="text.secondary">No completed bookings found</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {bookings.map((booking) => {
        const offering = booking.offeringId || booking.offering || {};
        const isMyBooking = booking.type === 'sent' || booking.userId;
        
        // Get instructor from offeringOwnerId (populated by backend)
        const instructor = booking.offeringOwnerId || offering.userId || offering.user || {};
        const instructorName = instructor.fullName || instructor.username || 'Instructor';
        const instructorImage = instructor.profilePicture || instructor.profileImage || '/auth/profile.png';
        
        // Get student who booked
        const student = booking.userId || booking.user || {};
        const studentName = student.fullName || student.username || 'Student';
        const studentImage = student.profilePicture || student.profileImage || '/auth/profile.png';
        const firstTag = offering.tags && offering.tags.length > 0 ? offering.tags[0] : null;
        const bookedSlot = booking.slot || (booking.slots && booking.slots[0]) || 'N/A';
        
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {offering.image && (
                <Box sx={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden' }}>
                  <Image
                    src={offering.image}
                    alt={offering.title || 'Offering image'}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                {/* Instructor and Category */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar 
                    src={instructorImage} 
                    alt={instructorName}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: '#667085' }}>
                    {instructorName}
                  </Typography>
                  {firstTag && (
                    <Chip
                      label={firstTag}
                      size="small"
                      sx={{
                        backgroundColor: '#e8f5e9',
                        color: '#25666e',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                        px: 0.5,
                      }}
                    />
                  )}
                </Box>

                {/* Title */}
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.4 }}>
                  {capitalizeFirstLetter(offering.title || 'Offering')}
                </Typography>

                {/* Description */}
                {offering.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1.5, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {offering.description}
                  </Typography>
                )}

                {/* Tags */}
                {offering.tags && offering.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {offering.tags.map((tag: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 22,
                          backgroundColor: '#f0f9ff',
                          color: '#25666e',
                          border: '1px solid #e0f2fe',
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Duration and Slot */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#25666e' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {formatDuration(offering.duration)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MenuBookIcon sx={{ fontSize: 16, color: '#25666e' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Slot: {formatSlotTime(bookedSlot)}
                    </Typography>
                  </Box>
                </Box>

                {/* Booked by Student */}
                <Box sx={{ mb: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                    Booked by:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={studentImage} alt={studentName} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {studentName}
                    </Typography>
                  </Box>
                </Box>

                {/* Status */}
                <Box sx={{ mt: 'auto', pt: 1 }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Completed"
                    size="small"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      color: '#25666e',
                      fontWeight: 500,
                    }}
                  />
                  {booking.completedAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Completed on: {new Date(booking.completedAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CompletedBookings;

