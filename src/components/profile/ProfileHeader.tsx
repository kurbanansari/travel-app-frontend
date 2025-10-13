"use client";

import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { FcPlus } from "react-icons/fc";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadProfilePic from "@/components/profile/UploadProfilePic";

import { Skeleton } from "@/components/ui/skeleton";

type ProfileHeaderProps = {
  profile: any;
  isOwnProfile: boolean;
  onBack: () => void;
  loading?: boolean;
};

export default function ProfileHeader({
  profile,
  isOwnProfile,
  onBack,
  loading,
}: ProfileHeaderProps) {
  if (loading) {
    return (
      <div className="relative">
        <div className="h-44 bg-gray-200 rounded-b-3xl animate-pulse"></div>
        <div className="absolute left-1/2 -translate-x-1/2 top-24 z-10">
          <Skeleton className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-44 bg-gradient-to-b from-[#D0F5E4] to-[#F0FFF5] rounded-b-3xl" />
      <button
        className="absolute left-4 top-7 text-gray-500 hover:text-gray-700 z-10"
        onClick={onBack}
      >
        <IoIosArrowBack size={30} />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 top-24 z-10">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
          {profile?.profilePic ? (
            <Image
              src={profile.profilePic}
              alt={profile.name}
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <span className="text-4xl text-gray-400 font-bold">
              {profile?.name?.[0] || "?"}
            </span>
          )}
          {isOwnProfile && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1 shadow hover:bg-green-700">
                  <FcPlus size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Upload Profile Picture</DialogTitle>
                </DialogHeader>
                <UploadProfilePic /> {/* ✅ reuse your upload component */}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
