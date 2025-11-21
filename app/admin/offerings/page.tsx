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
  Paper,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Card,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { profileService } from '../../services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';
import { useRouter } from 'next/navigation';

export default function AdminOfferings() {
  const router = useRouter();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<any>(null);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    setLoading(true);
    try {
      const data = await profileService.getAllOfferings();
      setOfferings(data);
    } catch (error: any) {
      errorAlert(error.message || 'Failed to fetch offerings', 'top-center');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOffering) return;
    try {
      await profileService.deleteOffering(selectedOffering._id || selectedOffering.id);
      successAlert('Offering deleted successfully', 'top-center');
      setDeleteDialogOpen(false);
      setSelectedOffering(null);
      fetchOfferings();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to delete offering', 'top-center');
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
          Offerings Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {offerings.length} offerings
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Instructor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sessions Booked</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offerings.map((offering) => {
                const instructor = offering.userId || offering.user || {};
                return (
                  <TableRow key={offering._id || offering.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {offering.title || 'N/A'}
                      </Typography>
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
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {offering.tags?.slice(0, 2).map((tag: string, idx: number) => (
                          <Chip key={idx} label={tag} size="small" sx={{ bgcolor: '#e8f5e9', color: '#16796f' }} />
                        ))}
                        {offering.tags?.length > 2 && (
                          <Chip label={`+${offering.tags.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{offering.duration || 'N/A'}</TableCell>
                    <TableCell>{offering.completedCount || 0}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedOffering(offering);
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
        <DialogTitle>Delete Offering</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedOffering?.title || 'this offering'}"? This action cannot be undone.
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

