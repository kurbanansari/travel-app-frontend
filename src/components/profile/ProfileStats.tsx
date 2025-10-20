"use client";

import { Button } from "@/components/ui/button";

type ProfileStatsProps = {
  profile?: any;
  isOwnProfile: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onSendMessage: () => void;
  followLoading: boolean;
};

export default function ProfileStats({ profile, isOwnProfile, onFollow, onUnfollow, onSendMessage, followLoading }: ProfileStatsProps) {
  return (
    <div className=" flex flex-col mt-10">
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


      {!isOwnProfile && (
        <div className=" flex flex-cols-2 gap-3 cursor-pointer mt-4 max-w-xs">
          {profile.isFollowing ? (
            <Button
              className="bg-green-600 text-white text-sm rounded-full font-semibold shadow hover:bg-green-700 transition"
              onClick={onUnfollow}
              disabled={followLoading}
            >
              {followLoading ? "..." : "Following"}
            </Button>
          ) : (
            <Button
              className="bg-green-600 text-white rounded-full font-semibold text-sm shadow hover:bg-green-700 transition"
              onClick={onFollow}
              disabled={followLoading}
            >
              {followLoading ? "..." : "Follow"}
            </Button>
          )}
          <Button
            className="bg-white border border-green-600 text-green-600 rounded-full font-semibold text-sm shadow hover:bg-green-50 transition"
            onClick={onSendMessage}
          >
            Send Message
          </Button>
        </div>
      )}
    </div>
  );
}
