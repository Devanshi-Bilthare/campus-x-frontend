'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Chip, Button, Avatar } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { profileService } from '@/app/services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface OfferingsListProps {
  fetchOfferings?: () => Promise<any[]>;
  offerings?: any[];
  refreshKey?: number;
  onBookingSuccess?: () => void;
  showBookingButton?: boolean; // Hide booking button for profile offerings
}

const OfferingsList = ({ fetchOfferings, offerings: propOfferings, refreshKey = 0, onBookingSuccess, showBookingButton = true }: OfferingsListProps) => {
  const router = useRouter();
  const [offerings, setOfferings] = useState<any[]>(propOfferings || []);
  const [loading, setLoading] = useState(!propOfferings && !!fetchOfferings);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [bookingLoading, setBookingLoading] = useState<Record<string, boolean>>({});

  // Initialize first slot as selected for each offering
  useEffect(() => {
    if (offerings.length > 0) {
      const initialSelections: Record<string, string> = {};
      offerings.forEach(off => {
        if (off.slots && off.slots.length > 0 && !selectedSlots[off._id]) {
          initialSelections[off._id] = off.slots[0];
        }
      });
      if (Object.keys(initialSelections).length > 0) {
        setSelectedSlots(prev => ({ ...prev, ...initialSelections }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerings.length]);

  const loadOfferings = async () => {
    if (!fetchOfferings) return;
    
    setLoading(true);
    setError(null);

    try {
      const list = await fetchOfferings();
      setOfferings(list);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to fetch offerings';
      setError(message);
      setOfferings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propOfferings) {
      setOfferings(propOfferings);
      setLoading(false);
    } else if (fetchOfferings) {
      loadOfferings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, propOfferings]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress size={32} />
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

  if (!offerings.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="text.secondary">No offerings found</Typography>
      </Box>
    );
  }

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSlotSelect = (offeringId: string, slot: string) => {
    setSelectedSlots(prev => ({
      ...prev,
      [offeringId]: slot
    }));
  };

  const formatSlotTime = (slot: string) => {
    if (!slot) return slot;
    
    if (slot.match(/^\d{1,2}:\d{2}/) || slot.match(/^\d{1,2}:\d{2}\s*(AM|PM|am|pm)/i)) {
      return slot;
    }
    
    return capitalizeFirstLetter(slot);
  };

  const formatDuration = (duration: string) => {
    if (!duration) return duration;
    // If it already contains "hour" or "hours", return as is
    if (duration.toLowerCase().includes('hour')) {
      return duration;
    }
    // Try to extract numbers and add "hours"
    const match = duration.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      return `${num} hour${num !== 1 ? 's' : ''}`;
    }
    return duration;
  };

  const handleBooking = async (offeringId: string) => {
    const selectedSlot = selectedSlots[offeringId];
    
    if (!selectedSlot) {
      errorAlert('Please select a slot before booking', 'top-right');
      return;
    }

    setBookingLoading(prev => ({ ...prev, [offeringId]: true }));
    
    try {
      // Send single slot instead of array
      const result = await profileService.createBooking(offeringId, selectedSlot);
      successAlert(result.message || 'Booking request sent successfully!', 'top-right');
      
      // Redirect to profile page to see booking in pending section
      setTimeout(() => {
        router.push('/profile?tab=pending');
      }, 1000);
      
      // Refresh offerings to update completedCount
      if (fetchOfferings && !propOfferings) {
        const updatedOfferings = await fetchOfferings();
        setOfferings(updatedOfferings);
      } else if (onBookingSuccess) {
        // Trigger parent refresh if callback provided
        onBookingSuccess();
      }
    } catch (error: any) {
      errorAlert(error.message || 'Failed to create booking', 'top-right');
    } finally {
      setBookingLoading(prev => ({ ...prev, [offeringId]: false }));
    }
  };

  return (
    <Grid container spacing={2}>
      {offerings.map(off => {
        const selectedSlot = selectedSlots[off._id];
        const instructor = off.userId || off.user || {};
        const instructorName = instructor.fullName || instructor.username || 'Instructor';
        const instructorImage = instructor.profilePicture || instructor.profileImage || '/auth/profile.png';
        const firstTag = off.tags && off.tags.length > 0 ? off.tags[0] : null;
        const slotCount = off.slots ? off.slots.length : 0;
        
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={off._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {off.image && (
                <Box sx={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden' }}>
                  <Image
                    src={off.image}
                    alt={off.title || 'Offering image'}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                {/* Instructor and Category */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  {instructor._id || instructor.id ? (
                    <Link 
                      href={`/profile/${instructor._id || instructor.id}`}
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}
                    >
                      <Avatar 
                        src={instructorImage} 
                        alt={instructorName}
                        sx={{ width: 32, height: 32, cursor: 'pointer' }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          flex: 1, 
                          fontWeight: 500, 
                          color: '#667085',
                          cursor: 'pointer',
                          '&:hover': {
                            color: '#16796f',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {instructorName}
                      </Typography>
                    </Link>
                  ) : (
                    <>
                      <Avatar 
                        src={instructorImage} 
                        alt={instructorName}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: '#667085' }}>
                        {instructorName}
                      </Typography>
                    </>
                  )}
                  {firstTag && (
                    <Chip
                      label={firstTag}
                      size="small"
                      sx={{
                        backgroundColor: '#e8f5e9',
                        color: '#16796f',
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
                  {capitalizeFirstLetter(off.title)}
                </Typography>

                {/* Description */}
                {off.description && (
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
                    {off.description}
                  </Typography>
                )}

                {/* Tags - Show all tags */}
                {off.tags && off.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {off.tags.map((tag: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 22,
                          backgroundColor: '#f0f9ff',
                          color: '#16796f',
                          border: '1px solid #e0f2fe',
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Duration and Slot Count */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#16796f' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {formatDuration(off.duration)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MenuBookIcon sx={{ fontSize: 16, color: '#16796f' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {slotCount === 1 ? 'One slot' : `${slotCount} slots`}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Slots Selection */}
                {off.slots && off.slots.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem', color: '#667085' }}>
                      Select Time Slot:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {off.slots.map((slot: string, index: number) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <Button
                            key={index}
                            variant="outlined"
                            size="small"
                            onClick={() => handleSlotSelect(off._id, slot)}
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.75,
                              fontSize: '0.8rem',
                              textTransform: 'none',
                              backgroundColor: isSelected ? '#16796f' : 'transparent',
                              color: isSelected ? '#fff' : '#16796f',
                              borderColor: isSelected ? '#16796f' : '#e4e7ec',
                              borderWidth: isSelected ? 2 : 1,
                              fontWeight: isSelected ? 600 : 500,
                              '&:hover': {
                                backgroundColor: isSelected ? '#125a4f' : 'rgba(22, 121, 111, 0.08)',
                                borderColor: '#16796f',
                                borderWidth: 2,
                              },
                            }}
                          >
                            {formatSlotTime(slot)}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                )}
                
                {/* Sessions Booked */}
                {off.completedCount !== undefined && off.completedCount > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#16796f', fontWeight: 500 }}>
                      {off.completedCount} Session{off.completedCount !== 1 ? 's' : ''} booked
                    </Typography>
                  </Box>
                )}
                
                {/* Booking Button - Only show if showBookingButton is true */}
                {showBookingButton && (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<EventAvailableIcon />}
                    onClick={() => handleBooking(off._id)}
                    disabled={bookingLoading[off._id] || !selectedSlot}
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
                      '&:disabled': {
                        backgroundColor: '#e4e7ec',
                        color: '#98a2b3',
                      },
                    }}
                  >
                    {bookingLoading[off._id] ? 'Booking...' : 'Book Now'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default OfferingsList;

