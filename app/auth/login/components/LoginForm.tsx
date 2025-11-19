"use client";
import { Button, Grid, Link, Typography } from "@mui/material";
import InputField from "@/components/InputField";
import { useFormik } from "formik";
import { button } from "@/app/theme/typography";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { successAlert, errorAlert } from "@/components/ToastGroup";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const data = await authService.login({
          username: values.username,
          password: values.password,
        });

        if (data.success && data.data) {
          // Store token in localStorage
          if (data.data.token) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
          }
          
          successAlert('Login successful!', 'top-right');
          
          // Redirect to home or dashboard
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          errorAlert(data.message || 'Login failed. Please try again.', 'top-right');
        }
      } catch (error: any) {
        errorAlert(error.message || 'An error occurred. Please try again.', 'top-right');
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <div className="w-full md:w-[50%] p-4 md:p-8 text-center">
      <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Login</Typography>
      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Welcome Back to CampusX</Typography>

      <form onSubmit={formik.handleSubmit} className="text-start px-4 md:px-20">
      <Grid container spacing={2} mt={2}>
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            formik={formik}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>   
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            formik={formik}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" sx={{ textAlign: 'right', mb: 1 }}>
            <Link href="/auth/forgot-password" sx={{ textDecoration: 'none', color: '#16796f' }}>
              Forgot Password?
            </Link>
          </Typography>
        </Grid>
        <Typography variant="body2" color="text.secondary" >Don't have an account? <Link href="/auth/signup">Sign Up</Link></Typography>
        <Button sx={button} type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Grid>
      </form>
    </div>
  );
};

export default LoginForm;

