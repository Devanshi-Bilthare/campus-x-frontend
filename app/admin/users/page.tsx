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
  TextField,
  MenuItem,
  CircularProgress,
  Card,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { profileService } from '../../services/profileService';
import { successAlert, errorAlert } from '@/components/ToastGroup';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await profileService.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      errorAlert(error.message || 'Failed to fetch users', 'top-center');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await profileService.deleteUser(selectedUser._id || selectedUser.id);
      successAlert('User deleted successfully', 'top-center');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to delete user', 'top-center');
    }
  };

  const handleEditRole = async () => {
    if (!selectedUser || !role) return;
    try {
      await profileService.updateUserRole(selectedUser._id || selectedUser.id, role);
      successAlert('User role updated successfully', 'top-center');
      setEditDialogOpen(false);
      setSelectedUser(null);
      setRole('');
      fetchUsers();
    } catch (error: any) {
      errorAlert(error.message || 'Failed to update user role', 'top-center');
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
          Users Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {users.length} users
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Coins</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id || user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={user.profilePicture || user.profileImage || '/auth/profile.png'}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.fullName || user.username || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Instructor' : 'Student'}
                      size="small"
                      sx={{
                        bgcolor: user.role === 'admin' ? '#dc2626' : user.role === 'teacher' ? '#16796f' : '#6366f1',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.coins || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setRole(user.role || 'student');
                        setEditDialogOpen(true);
                      }}
                      sx={{ color: '#16796f' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ color: '#dc2626' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.fullName || selectedUser?.username || 'this user'}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Instructor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditRole} variant="contained" sx={{ bgcolor: '#16796f' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

