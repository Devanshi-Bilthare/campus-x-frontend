'use client';

import React from 'react';
import { profileService } from '@/app/services/profileService';
import OfferingsList from './OfferingsList';

interface ProfileOfferingsProps {
  refreshKey?: number;
}

const ProfileOfferings = ({ refreshKey = 0 }: ProfileOfferingsProps) => {
  return <OfferingsList fetchOfferings={profileService.getMyOfferings} refreshKey={refreshKey} showBookingButton={false} />;
};

export default ProfileOfferings;
