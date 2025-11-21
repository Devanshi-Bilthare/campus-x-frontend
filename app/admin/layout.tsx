'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider, IconButton, Toolbar, AppBar } from '@mui/material';
import { getUser, isLoggedIn } from '../utils/auth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { logout } from '../utils/auth';
import { successAlert } from '@/components/ToastGroup';
import Link from 'next/link';

const drawerWidth = 260;

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { label: 'Offerings', icon: <MenuBookIcon />, path: '/admin/offerings' },
  { label: 'Bookings', icon: <EventAvailableIcon />, path: '/admin/bookings' },
  { label: 'Reviews', icon: <RateReviewIcon />, path: '/admin/reviews' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = getUser();
      
      if (!isLoggedIn()) {
        router.push('/auth/login');
        return;
      }

      if (currentUser?.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    successAlert('Logged out successfully!', 'top-center');
    router.push('/auth/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Box sx={{ p: 3, bgcolor: '#16796f', color: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
         <Link href="/"> <Image src="/logo-2.png" alt="CampusX" width={40} height={40} /></Link>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
            Admin Panel
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.profilePicture || user?.profileImage || '/auth/profile.png'}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600,color:"#fff" }}>
              {user?.fullName || user?.username || 'Admin'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flex: 1, pt: 2, bgcolor: '#fff' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  bgcolor: isActive ? '#16796f' : 'transparent',
                  color: isActive ? '#fff' : '#667085',
                  borderLeft: isActive ? '4px solid #16796f' : '4px solid transparent',
                  '&:hover': {
                    bgcolor: isActive ? '#125a4f' : 'rgba(22, 121, 111, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#fff' : '#667085', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: { color: isActive ? '#fff' : '#667085', fontWeight: isActive ? 600 : 400 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              color: '#dc2626',
              '&:hover': {
                bgcolor: 'rgba(220, 38, 38, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#dc2626', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', md: 'none' },
          bgcolor: '#16796f',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1,color:"#fff" }}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e4e7ec',
              bgcolor: '#fff',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

