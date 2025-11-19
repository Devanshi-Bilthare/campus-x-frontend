'use client';

import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import Image from 'next/image';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#16796f',
        color: '#fff',
        mt: 'auto',
        pt: { xs: 4, md: 5 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box 
              sx={{ 
                mb: 3,
                width: 80,
                height: 80,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.1)',
                
              }}
            >
              <Image src="/logo-2.png" alt="CampusX Logo" width={80} height={80} style={{ objectFit: 'contain' }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 3,
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', md: '1rem' },
              }}
            >
              Connect with expert instructors, book personalized learning sessions,
              and grow your skills through quality education and mentorship.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton
                sx={{
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                  width: 40,
                  height: 40,
                }}
                aria-label="Facebook"
              >
                <FacebookIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                sx={{
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                  width: 40,
                  height: 40,
                }}
                aria-label="Twitter"
              >
                <TwitterIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                sx={{
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                  width: 40,
                  height: 40,
                }}
                aria-label="LinkedIn"
              >
                <LinkedInIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                sx={{
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                  width: 40,
                  height: 40,
                }}
                aria-label="Instagram"
              >
                <InstagramIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: '#fff',
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                href="/"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                Home
              </Link>
              <Link
                href="/offerings"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                Offerings
              </Link>
              <Link
                href="/about"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: '#fff',
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                href="/contact"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                Help Center
              </Link>
              <Link
                href="/about"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: '#fff',
              }}
            >
              Get in Touch
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20, color: '#fff' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.875rem',
                  }}
                >
                  support@campusx.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ fontSize: 20, color: '#fff' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.875rem',
                  }}
                >
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnIcon sx={{ fontSize: 20, color: '#fff', mt: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                  }}
                >
                  123 Education Street<br />
                  Learning City, LC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: { xs: 3, md: 4 },
            pt: { xs: 2, md: 3 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
            }}
          >
            © {currentYear} CampusX. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

