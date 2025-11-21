'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Avatar, Rating, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton } from "@mui/material";
import { profileService } from '@/app/services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';
import { getUser } from '@/app/utils/auth';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface ReviewsProps {
  profileId: string;
  profileUserId?: string; // The user ID of the profile being viewed
}

const Reviews = ({ profileId, profileUserId }: ReviewsProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myReview, setMyReview] = useState<any>(null);

  const currentUser = getUser();
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = currentUserId === profileUserId;

  useEffect(() => {
    fetchReviews();
    if (currentUserId && !isOwnProfile) {
      checkMyReview();
    }
  }, [profileId, currentUserId, isOwnProfile]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getReviewsByProfile(profileId);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const checkMyReview = async () => {
    try {
      const myReviews = await profileService.getMyReviews();
      const review = myReviews.find((r: any) => {
        const reviewProfileId = r.profileId?._id || r.profileId?.id || r.profileId;
        return reviewProfileId === profileId;
      });
      setMyReview(review || null);
    } catch (error) {
      console.error('Failed to check my review:', error);
    }
  };

  const handleOpenAddDialog = () => {
    if (myReview) {
      // If user already has a review, open edit dialog instead
      setEditingReview(myReview);
      setRating(myReview.rating || 5);
      setMessage(myReview.message || '');
      setOpenEditDialog(true);
    } else {
      setRating(5);
      setMessage('');
      setOpenAddDialog(true);
    }
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setRating(5);
    setMessage('');
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingReview(null);
    setRating(5);
    setMessage('');
  };

  const handleSubmitReview = async () => {
    if (!message.trim() || message.length < 10) {
      errorAlert('Review message must be at least 10 characters', 'top-right');
      return;
    }

    setSubmitting(true);
    try {
      await profileService.createReview(profileId, rating, message);
      successAlert('Review added successfully!', 'top-right');
      handleCloseAddDialog();
      fetchReviews();
      checkMyReview();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to create review', 'top-right');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    if (!message.trim() || message.length < 10) {
      errorAlert('Review message must be at least 10 characters', 'top-right');
      return;
    }

    if (!editingReview) return;

    setSubmitting(true);
    try {
      await profileService.updateReview(editingReview._id || editingReview.id, rating, message);
      successAlert('Review updated successfully!', 'top-right');
      handleCloseEditDialog();
      fetchReviews();
      checkMyReview();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to update review', 'top-right');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await profileService.deleteReview(reviewId);
      successAlert('Review deleted successfully!', 'top-right');
      fetchReviews();
      checkMyReview();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to delete review', 'top-right');
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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

  return (
    <Box>
      {/* Header with rating summary and add button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Reviews
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={averageRating} readOnly precision={0.1} size="large" />
            <Typography variant="body1" sx={{ color: '#667085' }}>
              {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </Typography>
          </Box>
        </Box>
        {currentUserId && !isOwnProfile && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: '#16796f',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#125a4f',
              },
            }}
          >
            {myReview ? 'Edit Review' : 'Add Review'}
          </Button>
        )}
      </Box>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <Typography color="text.secondary">No reviews yet. Be the first to review!</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {reviews.map((review) => {
            const reviewer = review.userId || review.user || {};
            const reviewerName = reviewer.fullName || reviewer.username || 'Anonymous';
            const reviewerImage = reviewer.profilePicture || reviewer.profileImage || '/auth/profile.png';
            const isMyReview = (review.userId?._id || review.userId?.id || review.userId) === currentUserId;

            return (
              <Grid size={{ xs: 12, md: 6 }} key={review._id || review.id}>
                <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                        <Avatar src={reviewerImage} alt={reviewerName} sx={{ width: 40, height: 40 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {reviewerName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(review.createdAt || review.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {isMyReview && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingReview(review);
                              setRating(review.rating || 5);
                              setMessage(review.message || '');
                              setOpenEditDialog(true);
                            }}
                            sx={{ color: '#16796f' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteReview(review._id || review.id)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {review.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add Review Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 5)}
                size="large"
              />
            </Box>
            <TextField
              label="Review Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your review here (minimum 10 characters)..."
              fullWidth
              required
              helperText={`${message.length}/1000 characters`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={submitting || !message.trim() || message.length < 10}
            sx={{
              backgroundColor: '#16796f',
              '&:hover': { backgroundColor: '#125a4f' },
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue || 5)}
                size="large"
              />
            </Box>
            <TextField
              label="Review Message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your review here (minimum 10 characters)..."
              fullWidth
              required
              helperText={`${message.length}/1000 characters`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateReview}
            variant="contained"
            disabled={submitting || !message.trim() || message.length < 10}
            sx={{
              backgroundColor: '#16796f',
              '&:hover': { backgroundColor: '#125a4f' },
            }}
          >
            {submitting ? 'Updating...' : 'Update Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews;

