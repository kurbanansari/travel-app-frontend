"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // adjust path to your store
import { fetchProfile } from "@/redux//thunk/userThunk";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";



const UserProfileIcon = ()=> {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );
const effectRan = useRef(false);
  // ✅ Fetch profile if not already loaded
  useEffect(() => {
      if (!effectRan.current) { 
      dispatch(fetchProfile());
      effectRan.current = true;
  }
  }, [dispatch, user]);



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
