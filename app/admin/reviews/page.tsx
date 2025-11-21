'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  CircularProgress,
  Card,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { profileService } from '../../services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await profileService.getAllReviews();
      setReviews(data);
    } catch (error: any) {
      errorAlert(error.message || 'Failed to fetch reviews', 'top-center');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      await profileService.deleteReview(selectedReview._id || selectedReview.id);
      successAlert('Review deleted successfully', 'top-center');
      setDeleteDialogOpen(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to delete review', 'top-center');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#16796f' }}>
          Reviews Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {reviews.length} reviews
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Reviewer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => {
                const reviewer = review.userId || review.user || {};
                const instructor = review.profileId || review.profile || {};
                return (
                  <TableRow key={review._id || review.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={reviewer.profilePicture || reviewer.profileImage || '/auth/profile.png'}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {reviewer.fullName || reviewer.username || 'Anonymous'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={instructor.profilePicture || instructor.profileImage || '/auth/profile.png'}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {instructor.fullName || instructor.username || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Rating value={review.rating || 0} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {review.message || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedReview(review);
                          setDeleteDialogOpen(true);
                        }}
                        sx={{ color: '#dc2626' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

