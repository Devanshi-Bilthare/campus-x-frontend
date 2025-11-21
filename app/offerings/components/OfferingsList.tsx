'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Chip, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { profileService } from '@/app/services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';
import { getUser, isLoggedIn } from '@/app/utils/auth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateCalendarField from '@/components/DateCalendarField';
import AddOfferings from './AddOfferings';

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
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  const [bookingLoading, setBookingLoading] = useState<Record<string, boolean>>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<any | null>(null);
  
  // Check if user is a student (only students can book)
  const user = getUser();
  const isStudent = user?.role === 'student';
  const currentUserId = user?._id || user?.id;

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Initialize first slot and today's date as selected for each offering
  useEffect(() => {
    if (offerings.length > 0) {
      const initialSelections: Record<string, string> = {};
      const initialDates: Record<string, string> = {};
      const today = getMinDate();
      
      offerings.forEach(off => {
        if (off.slots && off.slots.length > 0 && !selectedSlots[off._id]) {
          // Find first available slot for today
          const availableSlots = getAvailableSlots(off, today);
          if (availableSlots.length > 0) {
            initialSelections[off._id] = availableSlots[0];
          } else if (off.slots.length > 0) {
            initialSelections[off._id] = off.slots[0];
          }
        }
        if (!selectedDates[off._id]) {
          initialDates[off._id] = today;
        }
      });
      if (Object.keys(initialSelections).length > 0) {
        setSelectedSlots(prev => ({ ...prev, ...initialSelections }));
      }
      if (Object.keys(initialDates).length > 0) {
        setSelectedDates(prev => ({ ...prev, ...initialDates }));
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

  const handleEditModalClose = () => {
    setEditingOffering(null);
    setEditModalOpen(false);
  };

  const handleEditClick = (offering: any) => {
    setEditingOffering(offering);
    setEditModalOpen(true);
  };

  const handleOfferingUpdated = async () => {
    if (fetchOfferings && !propOfferings) {
      await loadOfferings();
    }
    onBookingSuccess?.();
  };

  const getOfferingOwnerId = (offering: any) => {
    if (!offering) return null;

    if (offering.userId) {
      if (typeof offering.userId === 'string') {
        return offering.userId;
      }
      if (typeof offering.userId === 'object') {
        return offering.userId._id || offering.userId.id;
      }
    }

    if (offering.user) {
      if (typeof offering.user === 'string') {
        return offering.user;
      }
      if (typeof offering.user === 'object') {
        return offering.user._id || offering.user.id;
      }
    }

    return null;
  };

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

  const handleDateSelect = (offeringId: string, date: string) => {
    setSelectedDates(prev => ({
      ...prev,
      [offeringId]: date
    }));
    // Reset slot selection when date changes to ensure we select an available slot
    const offering = offerings.find(off => off._id === offeringId);
    if (offering) {
      const availableSlots = getAvailableSlots(offering, date);
      if (availableSlots.length > 0) {
        setSelectedSlots(prev => ({
          ...prev,
          [offeringId]: availableSlots[0]
        }));
      } else {
        // If no slots available, clear selection
        setSelectedSlots(prev => {
          const newState = { ...prev };
          delete newState[offeringId];
          return newState;
        });
      }
    }
  };

  // Get available slots for a specific date
  const getAvailableSlots = (offering: any, date: string): string[] => {
    if (!offering.slots || offering.slots.length === 0) return [];
    
    const bookedSlots = offering.bookedSlots || [];
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Filter out slots that are already booked for this date
    const bookedSlotsForDate = bookedSlots
      .filter((booked: any) => {
        const bookedDate = new Date(booked.date);
        bookedDate.setHours(0, 0, 0, 0);
        return bookedDate.getTime() === selectedDate.getTime();
      })
      .map((booked: any) => booked.slot);
    
    return offering.slots.filter((slot: string) => !bookedSlotsForDate.includes(slot));
  };

  // Check if a slot is available for a specific date
  const isSlotAvailable = (offering: any, slot: string, date: string): boolean => {
    const availableSlots = getAvailableSlots(offering, date);
    return availableSlots.includes(slot);
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
    // Check if user is logged in
    if (!isLoggedIn()) {
      errorAlert('Please login to book a session', 'top-center');
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
      return;
    }

    // Only students can book sessions
    if (!isStudent) {
      errorAlert('Only students can book sessions', 'top-center');
      return;
    }
    
    const selectedSlot = selectedSlots[offeringId];
    const selectedDate = selectedDates[offeringId];
    
    if (!selectedSlot) {
      errorAlert('Please select a slot before booking', 'top-center');
      return;
    }

    if (!selectedDate) {
      errorAlert('Please select a date before booking', 'top-center');
      return;
    }

    const offering = offerings.find(off => off._id === offeringId);
    if (offering && !isSlotAvailable(offering, selectedSlot, selectedDate)) {
      errorAlert('This slot is not available for the selected date', 'top-center');
      return;
    }

    setBookingLoading(prev => ({ ...prev, [offeringId]: true }));
    
    try {
      const result = await profileService.createBooking(offeringId, selectedSlot, selectedDate);
      successAlert(result.message || 'Booking request sent successfully!', 'top-center');
      
      // Redirect to profile page to see booking in pending section
      setTimeout(() => {
        router.push('/profile?tab=pending');
      }, 1000);
      
      // Refresh offerings to update bookedSlots
      if (fetchOfferings && !propOfferings) {
        const updatedOfferings = await fetchOfferings();
        setOfferings(updatedOfferings);
      } else if (onBookingSuccess) {
        // Trigger parent refresh if callback provided
        onBookingSuccess();
      }
    } catch (error: any) {
      errorAlert(error.message || 'Failed to create booking', 'top-center');
    } finally {
      setBookingLoading(prev => ({ ...prev, [offeringId]: false }));
    }
  };

  return (
    <>
    <Grid container spacing={2}>
      {offerings.map(off => {
        const selectedSlot = selectedSlots[off._id];
        const selectedDate = selectedDates[off._id] || getMinDate();
        const instructor = off.userId || off.user || {};
        const instructorName = instructor.fullName || instructor.username || 'Instructor';
        const instructorImage = instructor.profilePicture || instructor.profileImage || '/auth/profile.png';
        const firstTag = off.tags && off.tags.length > 0 ? off.tags[0] : null;
        const slotCount = off.slots ? off.slots.length : 0;
        const availableSlots = getAvailableSlots(off, selectedDate);
        const canEditOffering = Boolean(currentUserId && getOfferingOwnerId(off) === currentUserId);
        
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
                
                {/* Date Selection */}
                {showBookingButton && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem', color: '#667085', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16 }} />
                      Select Date:
                    </Typography>
                    <DateCalendarField
                      value={selectedDate}
                      onChange={(date) => handleDateSelect(off._id, date)}
                      minDate={getMinDate()}
                      placeholder="Select booking date"
                    />
                  </Box>
                )}

                {/* Slots Selection */}
                {off.slots && off.slots.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem', color: '#667085' }}>
                      Select Time Slot:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {off.slots.map((slot: string, index: number) => {
                        const isSelected = selectedSlot === slot;
                        const isAvailable = isSlotAvailable(off, slot, selectedDate);
                        return (
                          <Button
                            key={index}
                            variant="outlined"
                            size="small"
                            onClick={() => isAvailable && handleSlotSelect(off._id, slot)}
                            disabled={!isAvailable}
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.75,
                              fontSize: '0.8rem',
                              textTransform: 'none',
                              backgroundColor: isSelected ? '#16796f' : 'transparent',
                              color: isSelected ? '#fff' : isAvailable ? '#16796f' : '#98a2b3',
                              borderColor: isSelected ? '#16796f' : isAvailable ? '#e4e7ec' : '#e4e7ec',
                              borderWidth: isSelected ? 2 : 1,
                              fontWeight: isSelected ? 600 : 500,
                              opacity: isAvailable ? 1 : 0.5,
                              cursor: isAvailable ? 'pointer' : 'not-allowed',
                              textDecoration: !isAvailable ? 'line-through' : 'none',
                              '&:hover': {
                                backgroundColor: isAvailable ? (isSelected ? '#125a4f' : 'rgba(22, 121, 111, 0.08)') : 'transparent',
                                borderColor: isAvailable ? '#16796f' : '#e4e7ec',
                                borderWidth: isAvailable ? 2 : 1,
                              },
                              '&:disabled': {
                                borderColor: '#e4e7ec',
                                color: '#98a2b3',
                              },
                            }}
                          >
                            {formatSlotTime(slot)}
                            {!isAvailable && ' (Booked)'}
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
                
                {(showBookingButton || canEditOffering) && (
                  <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {showBookingButton && (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<EventAvailableIcon />}
                        onClick={() => handleBooking(off._id)}
                        disabled={bookingLoading[off._id] || !selectedSlot || !selectedDate || availableSlots.length === 0}
                        sx={{
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

                    {canEditOffering && (
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleEditClick(off)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: '#16796f',
                          color: '#16796f',
                          '&:hover': {
                            borderColor: '#125a4f',
                            color: '#125a4f',
                          },
                        }}
                      >
                        Edit Offering
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>

    {editingOffering && (
      <Dialog open={editModalOpen} onClose={handleEditModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Offering</DialogTitle>
        <DialogContent>
          <AddOfferings
            closeModal={handleEditModalClose}
            onUpdated={() => {
              handleOfferingUpdated();
            }}
            initialData={editingOffering}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    )}
    </>
  );
};

export default OfferingsList;

