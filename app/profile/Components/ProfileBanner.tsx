'use client';

import { Button, Typography } from "@mui/material"
import Image from "next/image"
import { button } from "@/app/theme/typography"
import { logout } from "@/app/utils/auth"
import { useRouter } from "next/navigation"
import { successAlert } from "@/components/ToastGroup"

interface ProfileBannerProps {
  user: any;
}

const ProfileBanner = ({ user }: ProfileBannerProps) => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    successAlert('Logged out successfully!', 'top-right');
    router.push('/auth/login');
  };

  return (
    <div>
    <div 
      className="h-[300px] relative rounded-xl"
      style={{
        backgroundImage: 'url(/profile-banner.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-[#25666e]/70 z-0 rounded-xl"></div>

    </div>
    <div className="flex justify-between items-center mt-[-60px] relative z-10 px-8">
      <div className="flex items-center gap-8">
      <div className="w-[150px] h-[150px] bg-white rounded-full border-4 border-[#25666e]">
      <Image 
        src={user?.profileImage || "/auth/profile.png"} 
        alt="profile" 
        width={150} 
        height={150} 
        style={{ borderRadius: '50%', objectFit: 'cover' }} 
      />
      </div>
      <div className="mt-10">
        <Typography variant="h6">{user?.fullName || 'User'}</Typography>
        <Typography variant="body1">{user?.email || ''}</Typography>
      </div>
      </div>
      <Button sx={{ ...button, width: "150px", mt:"40px" }} onClick={handleLogout}>Log Out</Button>
    </div>
    </div>
  )
}

export default ProfileBanner
