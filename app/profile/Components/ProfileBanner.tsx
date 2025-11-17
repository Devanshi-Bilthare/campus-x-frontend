'use client';

import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import { button, outlineButton } from "@/app/theme/typography";
import { logout } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { successAlert, errorAlert } from "@/components/ToastGroup";
import ImageUpload from "@/components/ImageUpload";
import { profileService } from "@/app/services/profileService";

interface ProfileBannerProps {
  user: any;
  refreshProfile: () => Promise<void>;
}

const ProfileBanner = ({ user, refreshProfile }: ProfileBannerProps) => {
  const router = useRouter();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageValue, setImageValue] = useState<string>(
    user?.profilePicture || user?.profileImage || ""
  );
  const [isSavingImage, setIsSavingImage] = useState(false);

  useEffect(() => {
    setImageValue(user?.profilePicture || user?.profileImage || "");
  }, [user?.profilePicture, user?.profileImage]);

  const handleLogout = () => {
    logout();
    successAlert("Logged out successfully!", "top-right");
    router.push("/auth/login");
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
    setImageValue(user?.profilePicture || user?.profileImage || "");
  };

  const handleSaveProfileImage = async () => {
    if (!imageValue) {
      errorAlert("Please upload an image before saving.", "top-right");
      return;
    }

    setIsSavingImage(true);
    try {
      const data = await profileService.updateProfile({ profilePicture: imageValue });
      if (data.success && data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
        await refreshProfile();
        successAlert("Profile image updated successfully!", "top-right");
        setIsImageModalOpen(false);
      } else {
        errorAlert(data.message || "Failed to update profile image.", "top-right");
      }
    } catch (error: any) {
      errorAlert(error.message || "Failed to update profile image.", "top-right");
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div>
      <div
        className="h-[200px] md:h-[300px] relative rounded-xl"
        style={{
          backgroundImage: "url(/profile-banner.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#25666e]/70 z-0 rounded-xl"></div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-6 mt-[-50px] md:mt-[-60px] relative z-10 px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]">
            <div className="w-full h-full bg-white rounded-full border-4 border-[#25666e] overflow-hidden">
              <Image
                src={user?.profilePicture || user?.profileImage || "/auth/profile.png"}
                alt="profile"
                width={150}
                height={150}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <IconButton
              size="small"
              onClick={() => setIsImageModalOpen(true)}
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                backgroundColor: "#25666e",
                color: "#fff",
                "&:hover": { backgroundColor: "#1f4f55" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                width: { xs: 28, md: 32 },
                height: { xs: 28, md: 32 },
              }}
              aria-label="Edit profile photo"
            >
              <EditIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
            </IconButton>
          </div>
          <div className="mt-0 sm:mt-10 text-center sm:text-left">
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              {user?.fullName || "User"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              {user?.email || ""}
            </Typography>
          </div>
        </div>
        <Button 
          sx={{ ...button, width: { xs: "100%", sm: "150px" }, mt: { xs: 2, md: "40px" } }} 
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>

      <Dialog
        open={isImageModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: { xs: 1, md: 2 },
            m: { xs: 2, md: 3 },
            maxHeight: { xs: '90vh', md: 'auto' },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, px: { xs: 2, md: 3 } }}>
          Update Profile Photo
        </DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, md: 3 } }}>
          <ImageUpload
            value={imageValue}
            onChange={setImageValue}
            helperText="Upload a square image for best results. Max size 2MB."
            label="Profile Photo"
          />
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, md: 3 }, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            sx={{ ...outlineButton, width: { xs: '100%', sm: 140 } }}
            onClick={handleCloseModal}
            disabled={isSavingImage}
          >
            Cancel
          </Button>
          <Button
            sx={{ ...button, width: { xs: '100%', sm: 160 } }}
            onClick={handleSaveProfileImage}
            disabled={isSavingImage || !imageValue}
          >
            {isSavingImage ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Photo"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileBanner;
