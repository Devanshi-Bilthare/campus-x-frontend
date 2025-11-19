'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Chip, Avatar } from "@mui/material";
import Image from 'next/image';
import { profileService } from '@/app/services/profileService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';

const RejectedBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get both rejected bookings I made and rejected bookings for my offerings
        const [myRejected, receivedRejected] = await Promise.all([
          profileService.getMyRejectedBookings(),
          profileService.getRejectedBookings().catch(() => [])
        ]);
        
        // Mark bookings I made vs received
        const myRejectedMarked = myRejected.map((b: any) => ({ ...b, type: 'sent' }));
        const receivedRejectedMarked = receivedRejected.map((b: any) => ({ ...b, type: 'received' }));
        
        setBookings([...myRejectedMarked, ...receivedRejectedMarked]);
      } catch (error) {
        console.error('Failed to fetch rejected bookings:', error);
        setError('Failed to load rejected bookings');
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

  if (!bookings.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="text.secondary">No rejected bookings found</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {bookings.map((booking) => {
        const offering = booking.offeringId || booking.offering || {};
        const isMyBooking = booking.type === 'sent'; // Booking I made
        const otherUser = isMyBooking
          ? (offering.userId || offering.user || {})
          : (booking.userId || booking.user || {});
        const otherUserName = otherUser.fullName || otherUser.username || (isMyBooking ? 'Instructor' : 'Student');
        const otherUserImage = otherUser.profilePicture || otherUser.profileImage || '/auth/profile.png';
        
        return (
          <Grid size={{ xs: 12, md: 6 }} key={booking._id}>
            <Card sx={{ height: '100%' }}>
              {offering.image && (
                <Box sx={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                  <Image
                    src={offering.image}
                    alt={offering.title || 'Offering image'}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </Box>
              )}
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar src={otherUserImage} alt={otherUserName} sx={{ width: 32, height: 32 }} />
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                    {otherUserName}
                  </Typography>
                  <Chip
                    icon={<CancelIcon />}
                    label="Rejected"
                    size="small"
                    sx={{
                      backgroundColor: '#ffebee',
                      color: '#c62828',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {offering.title || 'Offering'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: '#25666e' }} />
                  <Typography variant="body2" color="text.secondary">
                    Slot: {booking.slots && booking.slots[0] ? booking.slots[0] : 'N/A'}
                  </Typography>
                </Box>
                {booking.updatedAt && (
                  <Typography variant="caption" color="text.secondary">
                    Rejected on: {new Date(booking.updatedAt).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RejectedBookings;

