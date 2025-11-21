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
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  CircularProgress,
  Card,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { profileService } from '../../services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await profileService.getAllBookings();
      setBookings(data);
    } catch (error: any) {
      errorAlert(error.message || 'Failed to fetch bookings', 'top-center');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;
    try {
      await profileService.deleteBooking(selectedBooking._id || selectedBooking.id);
      successAlert('Booking deleted successfully', 'top-center');
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to delete booking', 'top-center');
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !status) return;
    try {
      await profileService.updateBookingStatus(selectedBooking._id || selectedBooking.id, status);
      successAlert('Booking status updated successfully', 'top-center');
      setStatusDialogOpen(false);
      setSelectedBooking(null);
      setStatus('');
      fetchBookings();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to update booking status', 'top-center');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { color: '#2e7d32', bg: '#e8f5e9' };
      case 'approved':
        return { color: '#16796f', bg: '#e8f5e9' };
      case 'pending':
      case 'requested':
        return { color: '#f57c00', bg: '#fff3e0' };
      case 'rejected':
        return { color: '#d32f2f', bg: '#ffebee' };
      case 'cancelled':
      case 'canceled':
        return { color: '#9e9e9e', bg: '#f5f5f5' };
      default:
        return { color: '#667085', bg: '#f8fafc' };
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
          Bookings Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {bookings.length} bookings
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Offering</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Slot</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => {
                const student = booking.userId || booking.user || {};
                const instructor = booking.offeringOwnerId || booking.offeringOwner || {};
                const offering = booking.offeringId || booking.offering || {};
                const statusColors = getStatusColor(booking.status);
                return (
                  <TableRow key={booking._id || booking.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={student.profilePicture || student.profileImage || '/auth/profile.png'}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2">
                          {student.fullName || student.username || 'N/A'}
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
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {offering.title || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{booking.slot || 'N/A'}</TableCell>
                    <TableCell>
                      {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status || 'N/A'}
                        size="small"
                        sx={{
                          bgcolor: statusColors.bg,
                          color: statusColors.color,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setStatus(booking.status || '');
                          setStatusDialogOpen(true);
                        }}
                        sx={{ color: '#16796f' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedBooking(booking);
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
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="requested">Requested</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" sx={{ bgcolor: '#16796f' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

