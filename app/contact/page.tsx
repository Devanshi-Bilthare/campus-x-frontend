'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  TextField,
  CircularProgress,
} from '@mui/material';
import { button } from '@/app/theme/typography';
import { successAlert, errorAlert } from '@/components/ToastGroup';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await contactService.sendMessage(values);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        successAlert('Thank you! Your message has been sent successfully.', 'top-right');
        formik.resetForm();
      } catch (error: any) {
        errorAlert(error.message || 'Failed to send message. Please try again.', 'top-right');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              color: '#16796f',
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#667085',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Have a question or want to learn more? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e4e7ec',
                  bgcolor: '#fff',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#e8f5e9',
                    color: '#16796f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#101828' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: '#667085' }}>
                  support@campusx.com
                </Typography>
              </Card>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e4e7ec',
                  bgcolor: '#fff',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#e8f5e9',
                    color: '#16796f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#101828' }}>
                  Phone
                </Typography>
                <Typography variant="body2" sx={{ color: '#667085' }}>
                  +1 (555) 123-4567
                </Typography>
              </Card>
            </Box>

            <Box>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e4e7ec',
                  bgcolor: '#fff',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#e8f5e9',
                    color: '#16796f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#101828' }}>
                  Address
                </Typography>
                <Typography variant="body2" sx={{ color: '#667085' }}>
                  123 Education Street<br />
                  Learning City, LC 12345
                </Typography>
              </Card>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid #e4e7ec',
                bgcolor: '#fff',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: '#101828',
                }}
              >
                Send us a Message
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#D0D5DD',
                          },
                          '&:hover fieldset': {
                            borderColor: '#16796f',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16796f',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#16796f',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#D0D5DD',
                          },
                          '&:hover fieldset': {
                            borderColor: '#16796f',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16796f',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#16796f',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subject && Boolean(formik.errors.subject)}
                      helperText={formik.touched.subject && formik.errors.subject}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#D0D5DD',
                          },
                          '&:hover fieldset': {
                            borderColor: '#16796f',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16796f',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#16796f',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      placeholder="Tell us what you'd like to know..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#D0D5DD',
                          },
                          '&:hover fieldset': {
                            borderColor: '#16796f',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#16796f',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#16796f',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isLoading || !formik.isValid}
                      sx={{
                        ...button,
                        height: '50px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        mt: 1,
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} color="inherit" />
                          Sending...
                        </Box>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;

