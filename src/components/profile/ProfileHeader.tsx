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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import EditProfileForm from "./EditProfile";
import ProfileStats from "./ProfileStats";
import TravelStats from "./TravelStats";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { followUserProfile, unfollowUserProfile } from "@/redux/thunk/feedThunk";
import { useState } from "react";

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
    const router = useRouter();
  
 const dispatch = useDispatch<AppDispatch>();
 const [followLoading, setFollowLoading] = useState(false);
    const handleFollow = () => profile && dispatch(followUserProfile({ item: profile }));
    const handleUnfollow = () => profile && dispatch(unfollowUserProfile({ item: profile }));
    // const handleSendMessage = () => profile?.id && router.push(`/chat?userId=${profile.id}`);
     const handleSendMessage = () => {
      if (profile?.id) {
        router.push(`/chat?userId=${profile.id}`);
      }
    };
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
    <div className="h-50 relative bg-[red] rounded-b-3xl">
     <div className=" h-55 bg-gradient-to-b from-[#D0F5E4] to-[#F0FFF5] rounded-b-3xl">
            {/* {userId === "me" && ( */}
      {isOwnProfile && (
           <div className="relative p-6">
          <Sheet>
  <SheetTrigger asChild>
    {/* <Button variant="outline" className="absolute right-4 top-7">
      ...
    </Button> */}
    <Button
  variant="outline"
  size="icon"
  className="absolute right-4 top-7 rounded-full"
>
  <MoreVertical className="h-5 w-5" />
</Button>
  </SheetTrigger>

  <SheetContent side="right" className="w-full sm:w-[500px]">
    <SheetHeader>
      <SheetTitle className="">Edit Profile</SheetTitle>
    </SheetHeader>
    <div className="">
      <EditProfileForm />
    </div>
  </SheetContent>
</Sheet>

        </div>
      )}
        </div>
     
      <button
        className="absolute left-2 top-4 text-gray-500 hover:text-gray-700 z-10"
        onClick={onBack}
      >
        <IoIosArrowBack size={30} />
      </button>

      <div className="absolute left-8 flex items-center justify-between top-10 w-[70%]">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center 
        justify-center overflow-hidden border-4 border-white shadow-lg relative">
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
        
         <ProfileStats profile={profile}/>
      </div>
      <div className="absolute top-40 left-8">
      <h3 className="font-bold text-xl">{profile?.name}</h3>
      <p className="text-gray-500 text-sm ">{profile?.bio}</p>
      </div>
     {!isOwnProfile && (
  <div className="flex justify-center w-full mt-2 mb-2">
    <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
      {profile.isFollowing ? (
        <Button
          
          className="!py-4 bg-emerald-600 px-8 text-white text-sm rounded-full  font-semibold shadow hover:bg-emerald-700 transition"
          onClick={handleUnfollow}
          disabled={followLoading}
        >
          {followLoading ? "..." : "Following"}
        </Button>
      ) : (
        <Button
          className="!py-4 bg-white border border-green-600 text-green-600 rounded-full  font-semibold text-sm shadow hover:bg-green-50 transition"
          onClick={handleFollow}
          disabled={followLoading}
        >
          {followLoading ? "..." : "Follow"}
        </Button>
      )}
      <Button
        className="!py-4 bg-white border border-green-600 text-green-600 rounded-full font-semibold text-sm shadow hover:bg-green-50 transition"
        onClick={handleSendMessage}
      >
        Send Message
      </Button>
    </div>
  </div>
)}

    </div>

  );
}
