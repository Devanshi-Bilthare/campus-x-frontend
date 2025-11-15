"use client";
import { Button, Grid, Link, Typography, Alert } from "@mui/material";
import InputField from "@/components/InputField";
import { useFormik } from "formik";
import { button } from "@/app/theme/typography";
import { useState } from "react";
import { authService } from "@/app/services/authService";
import { successAlert, errorAlert } from "@/components/ToastGroup";

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await authService.forgotPassword({ email: values.email });
        
        if (data.success) {
          setIsSubmitted(true);
          successAlert('Password reset link sent to your email!', 'top-right');
        } else {
          errorAlert(data.message || 'Failed to send reset link. Please try again.', 'top-right');
        }
      } catch (error: any) {
        errorAlert(error.message || 'An error occurred. Please try again.', 'top-right');
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <div className="w-full md:w-[50%] p-4 md:p-8 text-center">
        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Check Your Email</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, mt: 2, mb: 4 }}>
          We've sent a password reset link to your email address.
        </Typography>
        <Alert severity="success" sx={{ mb: 3, textAlign: 'left', mx: { xs: 2, md: 0 } }}>
          If an account exists with the email <strong>{formik.values.email}</strong>, you will receive a password reset link shortly.
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ px: { xs: 2, md: 0 } }}>
          Didn't receive the email? Check your spam folder or{" "}
          <Link href="/auth/forgot-password" sx={{ textDecoration: 'none', color: '#25666e' }}>
            try again
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          <Link href="/auth/login" sx={{ textDecoration: 'none', color: '#25666e' }}>
            Back to Login
          </Link>
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[50%] p-4 md:p-8 text-center">
      <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Forgot Password</Typography>
      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Enter your email to reset your password</Typography>

      <form onSubmit={formik.handleSubmit} className="text-start px-4 md:px-20">
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 12 }}>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              formik={formik}
            />
          </Grid>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Remember your password? <Link href="/auth/login" sx={{ textDecoration: 'none', color: '#25666e' }}>Login</Link>
          </Typography>
          <Button sx={button} type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

