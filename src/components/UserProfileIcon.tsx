"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // adjust path to your store
// import { fetchProfile } from "@/redux//thunk/userThunk";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchProfile } from "@/redux/thunk/userThunk";



const UserProfileIcon = ()=> {
  const dispatch = useDispatch<AppDispatch>();
   const { user} = useSelector((state: RootState) => state.user);
const effectRan = useRef(false);
  // ✅ Fetch profile if not already loaded
  // useEffect(() => {
  //     if (!effectRan.current) { 
  //     dispatch(fetchProfile());
  //     effectRan.current = true;
  // }
  // }, [dispatch]);
  // useEffect(() => {
  
  //   if (!user?.id) {
  //     dispatch(fetchProfile());
  //   }
  // }, [user?.id, dispatch]);
useEffect(() => {
    if (!user?.id) {
      dispatch(fetchProfile());
    }
  }, [user?.id, dispatch]);


  return (
   
    <Avatar>
      <AvatarImage
  src={user?.profilePic}
  alt={user?.name || "User"}
/>
      <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
    </Avatar>
 
  );
};

export default UserProfileIcon;
