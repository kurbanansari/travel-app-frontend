"use client";

import { Button } from "@/components/ui/button";

type ProfileStatsProps = {
  profile?: any;
  
};

export default function ProfileStats({ profile}: ProfileStatsProps) {
  return (
    <div className=" flex flex-col mt-10 ">
      <div className="flex gap-8 mb-3 cursor-pointer">
        <div className="flex flex-col items-center">
          <span className="font-bold text-xl">{profile?.posts.toString().padStart(2, "0")}</span>
          <span className="text-xs text-gray-500 hover:text-gray-600">Posts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-xl">{profile?.followers.toLocaleString()}</span>
          <span className="text-xs text-gray-500 hover:text-gray-600">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-xl">{profile?.following.toLocaleString()}</span>
          <span className="text-xs text-gray-500 hover:text-gray-600">Following</span>
        </div>
      </div>

    </div>
  );
}
