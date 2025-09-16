"use client";

import React from "react";
import { Home, Users, Heart, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "./card";
import Link from "next/link";
import UserProfileIcon from "../UserProfileIcon";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/redux/thunk/userThunk";
// import { fetchProfile } from "@/redux/thunk/authThunk";

const Footer = () => {
   const { profile} = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  //  const handleProfileClick = () => {
    //  dispatch(fetchProfile());
      // router.push(`/profile/${user?.id}`);
    // if (user?.id) {
    //   router.push(`/profile/${user.id}`);
    // }
      
    
  // };
  const handleProfileClick = () => {
    
      
      router.push("/profile/me"); // 👈 fallback if not logged in
    
  };



  return (
    <Card className="w-full max-w-xl fixed bottom-6 left-0 right-0 mx-auto bg-green-100 rounded-t-lg shadow-lg">
      <CardContent className="p-2 sm:p-4 flex items-center justify-between text-gray-500 pb-2 sm:pb-4">
        <div className="flex w-full justify-between items-center gap-2 sm:gap-4">
          {/* Home */}
          <Link href="/" className="flex-1 flex justify-center">
            <Home className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
          </Link>

          {/* Users */}
          <Link href="/users" className="flex-1 flex justify-center">
            <Users className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
          </Link>

          {/* Start New Trip */}
          <Link href="/trips" className="flex-1 flex justify-center">
            <LayoutDashboard className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
          </Link>

          {/* Likes */}
          <Link href="/likes" className="flex-1 flex justify-center">
            <Heart className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
          </Link>

           {/* User Profile */}
           <button onClick={handleProfileClick} className="flex-1 flex justify-center">
            <UserProfileIcon />
          </button>
      
        </div>
      </CardContent>
    </Card>
  );
};

export default Footer
