"use client";
import { Button, Grid, Link, Typography, Box } from "@mui/material";
import InputField from "@/components/InputField";
import { useFormik } from "formik";
import { button } from "@/app/theme/typography";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/services/authService";
import { successAlert, errorAlert } from "@/components/ToastGroup";
import * as Yup from "yup";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: Yup.string().oneOf(["student", "teacher"], "Please select a role").required("Role is required"),
});

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      role: "student" as "student" | "teacher",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const data = await authService.register({
          fullName: values.fullName,
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
        });

        if (data.success && data.data) {
          // Store token in localStorage
          if (data.data.token) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
          }
          
          successAlert('Account created successfully!', 'top-right');
          
          // Redirect to home or dashboard
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          errorAlert('Registration failed. Please try again.', 'top-right');
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
      <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Sign Up</Typography>
      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>Create Your Free Account</Typography>

      <form onSubmit={formik.handleSubmit} className="text-start px-4 md:px-20">
      <Grid container spacing={2} mt={2}>
        <Grid size={{ xs: 12 }}>
          <InputField
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            formik={formik}
          />
        </Grid>
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
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
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
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: '#101828' }}>
            Select Your Role <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={() => {
              const newRole = role === "student" ? "teacher" : "student";
              setRole(newRole);
              formik.setFieldValue("role", newRole);
              formik.setFieldTouched("role", true);
            }}
            sx={{
              position: 'relative',
              width: '100%',
              height: 56,
              borderRadius: '28px',
              border: 'none',
              backgroundColor: '#e0e0e0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              '&:hover': {
                backgroundColor: '#d0d0d0',
              },
            }}
          >
            {/* Background fill for active state - slides left/right */}
            <Box
              sx={{
                position: 'absolute',
                left: role === "student" ? 0 : '50%',
                width: '50%',
                height: '100%',
                backgroundColor: '#16796f',
                borderRadius: '28px',
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1,
              }}
            />
            
            {/* Student label - always visible */}
            <Typography
              sx={{
                position: 'relative',
                zIndex: 2,
                color: role === "student" ? '#ffffff' : '#666666',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                flex: 1,
                textAlign: 'center',
              }}
            >
              Student
            </Typography>
            
            {/* Teacher label - always visible */}
            <Typography
              sx={{
                position: 'relative',
                zIndex: 2,
                color: role === "teacher" ? '#ffffff' : '#666666',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                flex: 1,
                textAlign: 'center',
              }}
            >
              Teacher
            </Typography>
            
            {/* Sliding knob */}
            <Box
              sx={{
                position: 'absolute',
                left: role === "student" ? 4 : 'calc(100% - 52px)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 3,
              }}
            />
          </Box>
          {formik.touched.role && formik.errors.role && (
            <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, display: 'block' }}>
              {formik.errors.role}
            </Typography>
          )}
        </Grid>
        <Typography variant="body2" color="text.secondary" >Already have an account? <Link href="/auth/login">Login</Link></Typography>
        <Button sx={button} type="submit" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Grid>
      </form>
    </div>
  );
};

export default SignUpForm;
