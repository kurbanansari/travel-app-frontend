"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link, { useRouter, useParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { SmartImage } from "@/components/ui/SmartImage";
import { Skeleton } from "@/components/ui/skeleton";
import EditProfileForm from "@/components/EditProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {fetchProfile, fetchUserProfileById} from '@/redux/thunk/userThunk'
import { followUserProfile, unfollowUserProfile} from '@/redux/thunk/feedThunk'


const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string | undefined;
  const [followLoading, setFollowLoading] = useState(false);
   const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error,user } = useSelector((state: RootState) => state.user);
  // const { user } = useSelector((state: RootState) => state.auth);
  // const [currentProfile, setCurrentProfile] = useState(user || null);
  const isOwnProfile = profile?.id === user?.id;
  const effectRan = useRef(false);
 
  // const loggedInUserId =
  //   typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  // const token =
  //   typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // useEffect(() => {
  //   if (!token) {
  //     router.push("/login");
  //   }
  // }, [token, router]);

  // useEffect(() => {
  //   if (userId) dispatch(fetchUserProfileById(userId));
  // }, [userId, dispatch]);

  // useEffect(() => {
  //   if (!userId) return;

  //   // If visiting own profile, use /users/me
  //   if (userId === "me") {
  //     if (!profile?.id) {
  //       dispatch(fetchProfile());
  //     }
  //   } else {
  //     // Visiting another user's profile
  //     dispatch(fetchUserProfileById(userId as string));
  //   }
  // }, [userId, profile?.id, dispatch]);
   
   useEffect(() => {
    if (!userId) return;
    

    if (userId === "me") {
      dispatch(fetchProfile());
    } else {
      dispatch(fetchUserProfileById(userId));
    }
  }, [userId, dispatch]);

  // useEffect(() => {
  //   if (!userId) return;

  //   if (userId === "me") {
  //     // Viewing own profile
  //     if (!user) dispatch(fetchProfile());
  //   } else {
  //     // Viewing another user's profile
  //     dispatch(fetchUserProfileById(userId));
  //   }
  // }, [userId, user?.id, dispatch]);

  // useEffect(() => {
  //   setCurrentProfile(profile);
  // }, [profile]);

  // useEffect(() => {
  //   if (!userId) return;

  //   if (userId === "me") {
  //     if (!user?.id) dispatch(fetchProfile());
  //   } else {
  //     if (!user || user?.id !== userId) dispatch(fetchUserProfileById(userId));
  //   }
  // }, [userId, user?.id, dispatch]);

const handleFollow = () => {
  if (profile) {
    dispatch(followUserProfile({ item: profile }));
  }
};

const handleUnfollow = () => {
  if (profile) {
    dispatch(unfollowUserProfile({ item: profile }));
  }
};

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white pb-8">
        {/* Header skeleton */}
        <div className="relative">
          <div className="h-44 bg-gradient-to-b from-gray-200 to-gray-100 rounded-b-3xl animate-pulse"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-24 z-10">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="mt-20 flex flex-col items-center px-4">
          <div className="flex gap-8 mb-2">
            <Skeleton className="w-10 h-5 rounded" />
            <Skeleton className="w-10 h-5 rounded" />
            <Skeleton className="w-10 h-5 rounded" />
          </div>

          {/* Name + bio */}
          <Skeleton className="w-32 h-6 rounded mt-2" />
          <Skeleton className="w-48 h-4 rounded mt-2" />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
            <Skeleton className="h-9 rounded-full" />
            <Skeleton className="h-9 rounded-full" />
          </div>
        </div>

        {/* Travel stats */}
        <div className="flex gap-3 justify-center mt-6 mb-6 px-4">
          <Skeleton className="flex-1 h-16 rounded-xl" />
          <Skeleton className="flex-1 h-16 rounded-xl" />
        </div>

        {/* Photos grid */}
        <div className="mt-6 px-4">
          <Skeleton className="w-40 h-5 mx-auto mb-4 rounded" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error || "Profile not found."}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-8">
      {/* Header background */}
      <div className="relative">
        <div className="h-44 bg-gradient-to-b from-[#D0F5E4] to-[#F0FFF5] rounded-b-3xl"></div>
        {/* Back button */}
        <button
          className="absolute left-4 top-7 text-gray-500 hover:text-gray-700 z-10"
          onClick={() => router.back()}
        >
          <svg
            width={28}
            height={28}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-24 z-10">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {profile.profilePic ? (
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
          </div>
        </div>
      </div>
       {/* {userId === "me" && ( */}
        {isOwnProfile && (
      <div className="relative p-6">
        <Dialog>
          {/* ✅ Trigger button */}
          <DialogTrigger asChild>
            <Button variant={"outline"} className="absolute right-4 top-7">
              Edit Profile
            </Button>
          </DialogTrigger>

          {/* ✅ Modal Content */}
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <EditProfileForm />
          </DialogContent>
        </Dialog>
      </div>
  )}
      {/* Card with stats, name, bio, buttons */}
      <div className="mt-20 flex flex-col items-center px-4">
        {/* Stats */}
        <div className="flex gap-8 mb-2">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">
              {profile.posts.toString().padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-500">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">
              {profile.followers.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">
              {profile.following.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">Following</span>
          </div>
        </div>
        {/* Name and bio */}
        <div className="font-semibold text-xl mt-1">{profile.name}</div>
        <div className="text-gray-500 text-sm text-center mt-1">
          {profile.bio}
        </div>

        {/* Buttons */}
        {/* {profile.id !== userId && ( */}
        {/* {userId !== "me" && ( */}
         {!isOwnProfile && (
          <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
            {profile.isFollowing ? (
              <button
                className="bg-green-600 text-white py-2 text-sm w-full rounded-full font-semibold shadow hover:bg-green-700 transition"
                onClick={handleUnfollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : "Following"}
              </button>
            ) : (
              <button
                className="bg-green-600 text-white py-2 w-full rounded-full font-semibold text-sm shadow hover:bg-green-700 transition"
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : "Follow"}
              </button>
            )}
            <button
              className="bg-white border border-green-600 text-green-600 py-2w-full rounded-full font-semibold text-sm shadow hover:bg-green-50 transition"
              disabled
            >
              Send Message
            </button>
          </div>
        )}
      </div>

      {/* Travel Stats */}
      <div className="flex gap-3 justify-center mt-6 mb-6 px-4">
        <div className="flex-1 bg-[#FFF4CC] rounded-xl py-4 flex flex-col items-center shadow">
          <span className="font-bold text-lg">{profile.totalDistanceKm}KM</span>
          <span className="text-xs text-gray-600">Total Distance Traveled</span>
        </div>
        <div className="flex-1 bg-[#FFF4CC] rounded-xl py-4 flex flex-col items-center shadow">
          <span className="font-bold text-lg">
            {profile.daysSpentTraveling}
          </span>
          <span className="text-xs text-gray-600">Days Spent Traveling</span>
        </div>
      </div>

      {/* Section Title */}
      <div className="mt-6 px-4">
        <h3 className="text-base font-semibold mb-3 text-gray-700 text-center border-b border-gray-200 pb-2">
          All Published Recaps & Photos
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {profile.photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square bg-gray-100 rounded-xl overflow-hidden p-1"
            >
              <SmartImage
                src={photo.url}
                alt="User photo"
                width={300}
                height={300}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default ProfilePage;
