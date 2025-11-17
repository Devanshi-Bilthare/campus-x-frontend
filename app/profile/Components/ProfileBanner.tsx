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
        className="h-[300px] relative rounded-xl"
        style={{
          backgroundImage: "url(/profile-banner.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#25666e]/70 z-0 rounded-xl"></div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mt-[-60px] relative z-10 px-8">
        <div className="flex items-center gap-6">
          <div className="relative w-[150px] h-[150px]">
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
              }}
              aria-label="Edit profile photo"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="mt-10">
            <Typography variant="h6">{user?.fullName || "User"}</Typography>
            <Typography variant="body1">{user?.email || ""}</Typography>
          </div>
        </div>
        <Button sx={{ ...button, width: "150px", mt: { xs: 0, md: "40px" } }} onClick={handleLogout}>
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
          },
        }}
      >
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent dividers>
          <ImageUpload
            value={imageValue}
            onChange={setImageValue}
            helperText="Upload a square image for best results. Max size 2MB."
            label="Profile Photo"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            sx={{ ...outlineButton, width: 140 }}
            onClick={handleCloseModal}
            disabled={isSavingImage}
          >
            Cancel
          </Button>
          <Button
            sx={{ ...button, width: 160 }}
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
