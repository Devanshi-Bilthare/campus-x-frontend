'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  InputAdornment, 
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OfferingsList from './components/OfferingsList';
import { profileService } from '@/app/services/profileService';
import { getUser } from '@/app/utils/auth';

const Offerings = () => {
  const [allOfferings, setAllOfferings] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshOfferings = async () => {
    try {
      const offerings = await profileService.getAllOfferings();
      setAllOfferings(offerings);
      
      // Also refresh bookings to filter out booked offerings
      try {
        const bookings = await profileService.getAllMyBookings();
        setMyBookings(bookings);
      } catch (error) {
        // If bookings fetch fails, continue without filtering
        console.error('Failed to fetch bookings:', error);
      }
      
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to refresh offerings:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [offerings, bookings] = await Promise.all([
          profileService.getAllOfferings(),
          profileService.getAllMyBookings().catch(() => []) // Don't fail if bookings can't be fetched
        ]);
        setAllOfferings(offerings);
        setMyBookings(bookings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract all unique categories from tags
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    allOfferings.forEach(offering => {
      if (offering.tags && Array.isArray(offering.tags)) {
        offering.tags.forEach((tag: string) => {
          if (tag) categorySet.add(tag);
        });
      }
    });
    return ['All', ...Array.from(categorySet).sort()];
  }, [allOfferings]);

  // Filter offerings based on search, category, exclude user's own offerings, and exclude already booked offerings
  const filteredOfferings = useMemo(() => {
    const user = getUser();
    const userId = user?._id || user?.id;

    // Get offering IDs that user has already booked (any status except rejected)
    const bookedOfferingIds = new Set(
      myBookings
        .filter((booking: any) => {
          const status = booking.status?.toLowerCase();
          return status !== 'rejected' && status !== 'cancelled';
        })
        .map((booking: any) => {
          const offering = booking.offeringId || booking.offering;
          return offering?._id || offering;
        })
        .filter(Boolean)
    );

    return allOfferings.filter(offering => {
      const offeringId = offering._id || offering.id;
      
      // Exclude user's own offerings
      const offeringUserId = offering.userId?._id || offering.userId || offering.user?._id || offering.user;
      if (userId && offeringUserId === userId) {
        return false;
      }

      // Exclude offerings that user has already booked
      if (bookedOfferingIds.has(offeringId)) {
        return false;
      }

      // Search filter
      const matchesSearch = searchQuery === '' || 
        offering.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'All' ||
        offering.tags?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [allOfferings, myBookings, searchQuery, selectedCategory]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '60%',
              height: 3,
              backgroundColor: '#16796f',
            }
          }}
        >
          All <span style={{ color: '#16796f' }}>Offerings</span>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Browse and select from available offerings
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search your offering"
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
              backgroundColor: '#f8f9fa',
              '& fieldset': {
                borderColor: '#e4e7ec',
              },
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

      {/* Category Navigation */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pb: 1,
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              sx={{
                backgroundColor: selectedCategory === category ? '#16796f' : '#f8f9fa',
                color: selectedCategory === category ? '#fff' : '#667085',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: selectedCategory === category ? '#125a4f' : '#e8f0f2',
                },
                minWidth: 'fit-content',
                px: 2,
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Results Count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredOfferings.length} offering{filteredOfferings.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Offerings List */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography>Loading offerings...</Typography>
        </Box>
      ) : (
        <OfferingsList 
          offerings={filteredOfferings}
          fetchOfferings={async () => filteredOfferings}
          onBookingSuccess={refreshOfferings}
        />
      )}
    </Container>
  );
};

export default Offerings;