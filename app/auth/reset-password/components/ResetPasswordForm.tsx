"use client";
import { Button, Grid, Link, Typography, Alert } from "@mui/material";
import InputField from "@/components/InputField";
import { useFormik } from "formik";
import { button } from "@/app/theme/typography";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { successAlert, errorAlert } from "@/components/ToastGroup";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    onSubmit: async (values) => {
      if (!token) {
        setError("Invalid reset token");
        return;
      }

      if (!values.newPassword) {
        setError("Please enter a new password");
        return;
      }

      setIsLoading(true);
      try {
        const data = await authService.resetPassword({
          token: token,
          newPassword: values.newPassword,
        });

        if (data.success) {
          setIsSuccess(true);
          setError(null);
          successAlert('Password reset successfully!', 'top-right');
          
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          setError(data.message || 'Failed to reset password. Please try again.');
          errorAlert(data.message || 'Failed to reset password. Please try again.', 'top-right');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to reset password. Please try again.');
        errorAlert(error.message || 'Failed to reset password. Please try again.', 'top-right');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  if (isSuccess) {
    return (
      <div className="w-full md:w-[50%] p-4 md:p-8 text-center">
        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Password Reset Successful</Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, mt: 2, mb: 4 }}>
          Your password has been successfully reset.
        </Typography>
        <Alert severity="success" sx={{ mb: 3, textAlign: 'left', mx: { xs: 2, md: 0 } }}>
          You can now login with your new password.
        </Alert>
        <Button 
          sx={button} 
          href="/auth/login"
          component="a"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[50%] p-4 md:p-8 text-center">
      <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Reset Password</Typography>
      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Enter your new password</Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2, textAlign: 'left', mx: { xs: 2, md: 0 } }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit} className="text-start px-4 md:px-20">
        <Grid container spacing={2} mt={2}>
          <Grid size={{ xs: 12 }}>
            <InputField
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter your new password"
              formik={formik}
            />
          </Grid>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Remember your password? <Link href="/auth/login" sx={{ textDecoration: 'none', color: '#16796f' }}>Login</Link>
          </Typography>
          <Button sx={button} type="submit" disabled={!token || isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

