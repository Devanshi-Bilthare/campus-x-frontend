import { Box, Button, Typography, Container } from '@mui/material';
import Link from 'next/link';
import { button } from './theme/typography';

export default function NotFound() {
  return (
    <>
      <Box
        sx={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          px: 2,
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              color: '#16796f',
              mb: 2,
              lineHeight: 1,
            }}
          >
            404
          </Typography>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#101828',
              mb: 2,
              fontWeight: 600,
            }}
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#535862',
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
              px: { xs: 2, md: 0 },
            }}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              gap: { xs: 1.5, md: 2 }, 
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%',
              maxWidth: '400px',
              mx: 'auto',
            }}
          >
            <Link href="/"> 
            <Button
              sx={{
                ...button,
                px: { xs: 3, md: 4 },
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 1, sm: 'none' },
                ":hover": {
                  backgroundColor: '#ffffff',
                  color: '#16796f',
                  border: '2px solid #16796f',
                }
              }}
            >
              Go to Home
            </Button>
            </Link> 
            
            <Link href="/auth/login">
            <Button
              sx={{
                ...button,
                px: { xs: 3, md: 4 },
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 1, sm: 'none' },
                backgroundColor: 'transparent',
                color: '#16796f',
                border: '2px solid #16796f',
                ":hover": {
                  backgroundColor: '#16796f',
                  color: '#ffffff',
                }
              }}
            >
              Login
            </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </>
  );
}

