"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // adjust path to your store
import { fetchProfile } from "@/redux//thunk/userThunk";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";



const UserProfileIcon = ()=> {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );

  // ✅ Fetch profile if not already loaded
  useEffect(() => {
       const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchProfile());
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
