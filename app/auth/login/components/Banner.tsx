import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <div 
      className="w-full md:w-[50%] relative p-4 md:p-8 min-h-[300px] md:min-h-screen"
      style={{
        backgroundImage: 'url(/auth/login-bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
      }}
    >
      <div className="absolute inset-0 bg-[#25666e]/70 z-0 md:rounded-tr-[20px] md:rounded-br-[20px]"></div>
      <div className="relative z-10 flex flex-col h-full">
        <Link href="/">
          <div className="w-[60px] h-[60px] md:w-20 md:h-20 cursor-pointer">
            <Image src="/logo-2.png" alt="logo" width={80} height={80} style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>
        </Link>
        <Typography variant="h1" color="white" sx={{ width: { xs: '100%', md: '60%' }, mt: { xs: 4, md: 8 }, fontSize: { xs: '1.75rem', md: '3rem' } }}>
        Welcome Back to Your Learning Journey
        </Typography>
        <Typography variant="body1" color="white" sx={{ width: { xs: '100%', md: '60%' }, mt: { xs: 2, md: 4 }, fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Continue your path of discovery and connect with a community that shares your passion for knowledge and growth.
        </Typography>
      </div>
    </div>
  );
};

export default Banner;

