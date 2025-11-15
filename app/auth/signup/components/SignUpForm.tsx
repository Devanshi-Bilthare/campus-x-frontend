"use client";
import { Button, Grid, Link, Typography } from "@mui/material";
import InputField from "@/components/InputField";
import { useFormik } from "formik";
import { button } from "@/app/theme/typography";

const SignUpForm = () => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className="w-[50%] p-8 text-center">
      <Typography variant="h3">Sign Up</Typography>
      <Typography variant="body1">Create Your Free Account</Typography>

      <form onSubmit={formik.handleSubmit} className="text-start px-20">
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
        <Typography variant="body2" color="text.secondary" >Already have an account? <Link href="/auth/login">Login</Link></Typography>
        <Button sx={button} type="submit">Sign Up</Button>
      </Grid>
      </form>
    </div>
  );
};

export default SignUpForm;
