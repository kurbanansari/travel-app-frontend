"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProfile, fetchUserProfileById } from "@/redux/thunk/userThunk";
import { followUserProfile, unfollowUserProfile } from "@/redux/thunk/feedThunk";
import { clearUser } from "@/redux/slices/userSlice";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import TravelStats from "@/components/profile/TravelStats";
import ProfilePhotosGrid from "@/components/profile/ProfilePhotosGrid";
import { clearPhotos, setPhotos } from "@/redux/slices/photoSlice";

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string | undefined;
  const dispatch = useDispatch<AppDispatch>();

  const { profile, loading, error, user } = useSelector((state: RootState) => state.user);
  const [followLoading, setFollowLoading] = useState(false);
   const reduxPhotos = useSelector((state: RootState) => state.photos.photos);

  const isOwnProfile = profile?.id === user?.id;
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    if (!userId) {
      dispatch(clearUser());
        dispatch(clearPhotos());
      return;
    }
    if (userId === "me") dispatch(fetchProfile());
    else dispatch(fetchUserProfileById(userId));
    effectRan.current = true;
  }, [userId, dispatch]);


  useEffect(() => {
  if (!profile) return;

  if (profile?.photos?.length) {
    const formattedPhotos = profile.photos.map((p) => ({
      id: p.id,
      url: p.url,
      trip_id: "",
      user_id: profile.id,
      created_at: p.created_at || "",
    }));

    dispatch(setPhotos(formattedPhotos));
  }
}, [dispatch, profile]);





  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white pb-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} onBack={() => router.back()} />
      <TravelStats profile={profile} isOwnProfile={isOwnProfile} /> 
      <div className="mt-6 px-4">
        <h3 className="text-base font-semibold mb-3 text-gray-700 text-center border-b border-gray-200 pb-2">All Published Recaps & Photos</h3>
        <ProfilePhotosGrid  isOwnProfile={isOwnProfile}/>
      </div>
    </div>
  );
};

export default ProfilePage;
