import { Typography } from "@mui/material";
import Image from "next/image";

const Banner = () => {
  return (
    <div 
      className="w-[50%] relative p-8"
      style={{
        backgroundImage: 'url(/auth/signup-bg.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderTopRightRadius: '20px',
        borderBottomRightRadius: '20px',
      }}
    >
      <div className="absolute inset-0 bg-[#25666e]/70 z-0 rounded-tr-[20px] rounded-br-[20px]"></div>
      <div className="relative z-10">
        <Image src="/logo-2.png" alt="logo" width={80} height={80} style={{ borderRadius: '50%' }}/>
        <Typography variant="h1" color="white" width="60%" mt={8}>
        Teach What You Know. Learn What You Love
        </Typography>
        <Typography variant="body1" color="white" width="60%" mt={4}>
        Whether you're here to guide or to grow, this platform connects you with learners and teachers who share your passion.
        </Typography>
      </div>
    </div>
  );
};

export default Banner;
