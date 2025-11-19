'use client';

import { useState } from 'react';
import { Typography, Avatar, IconButton, Drawer, Box, List, ListItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';
import { isLoggedIn } from '@/app/utils/auth';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Offerings', href: '/offerings' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 250, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={40} height={40} style={{ cursor: 'pointer' }} />
        </Link>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {navLinks.map((link) => (
          <ListItem key={link.label} sx={{ py: 1.5 }}>
            <Link href={link.href} style={{ textDecoration: 'none', color: '#101828', width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {link.label}
              </Typography>
            </Link>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem sx={{ py: 1.5 }}>
          {isLoggedIn() ? (
            <Link href="/profile" style={{ textDecoration: 'none', color: '#101828', width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src="/auth/profile.png"
                alt="Profile"
                sx={{
                  width: 32,
                  height: 32,
                  border: '2px solid #16796f',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Profile</Typography>
            </Link>
          ) : (
            <Link href="/auth/login" style={{ textDecoration: 'none', color: '#101828', width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Login</Typography>
            </Link>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <div className="flex justify-between w-full px-4 md:px-8 py-4 items-center">
        <div className="flex items-center gap-4">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: '#16796f' }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="logo" 
              width={50} 
              height={50} 
              style={{ cursor: 'pointer' }}
              className="hidden md:block"
            />
            <Image 
              src="/logo.png" 
              alt="logo" 
              width={40} 
              height={40} 
              style={{ cursor: 'pointer' }}
              className="block md:hidden"
            />
          </Link>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} style={{ textDecoration: 'none', color: '#101828' }}>
              <Typography variant="h6" sx={{ fontWeight: 500, '&:hover': { color: '#16796f' } }}>
                {link.label}
              </Typography>
            </Link>
          ))}
        </div>

        <div>
          {isLoggedIn() ? (
            <Link href="/profile">
              <Avatar
                src="/auth/profile.png"
                alt="Profile"
                sx={{
                  width: { xs: 32, md: 40 },
                  height: { xs: 32, md: 40 },
                  cursor: 'pointer',
                  border: '2px solid #16796f',
                }}
              />
            </Link>
          ) : (
            <Typography variant="h6" sx={{ fontSize: { xs: '0.875rem', md: '1.25rem' } }}>
              <Link href="/auth/login" style={{ textDecoration: 'none', color: '#101828', fontWeight: 500 }}>
                Login
              </Link>
            </Typography>
          )}
        </div>
      </div>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;