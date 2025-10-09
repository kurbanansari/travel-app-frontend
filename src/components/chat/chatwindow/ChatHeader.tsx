"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useRouter } from "next/navigation";
import User from "@/redux/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchOnlineUsers } from "@/redux/thunk/chatThunk";

type ChatHeaderProps = {
  otherUserId: string;
  isOnline: boolean;
  lastSeen: string | null;
};

export default function ChatHeader({ otherUserId,isOnline,lastSeen }: ChatHeaderProps) {
  const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();
  const { selectedUser,onlineUsers } = useSelector((state: RootState) => state.chat);
  


  // Get the specific user from onlineUsers
  const userStatus = onlineUsers.find((u) => u.id === otherUserId);
  console.log(userStatus)
// const isOnline = userStatus?.isOnline ?? false;
// const lastSeen = userStatus?.lastSeen ?? null;

  // Format last seen text

  const lastSeenText = lastSeen
    ? `Last seen at ${new Date(lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "";




  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-emerald-200 bg-emerald-100">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push(`/profile/${otherUserId}`)}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={selectedUser?.profile_pic_url || undefined}
            alt={selectedUser?.name || "User"}
            className="h-full w-full object-cover border-emerald-200 bg-emerald-100"
          />
          <AvatarFallback>{selectedUser?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <span className="font-semibold text-emerald-900">
            {selectedUser?.name || "Unknown"}
          </span>
          {isOnline ? (
            <span className="block text-xs text-emerald-500">Online</span>
          ) : (
            lastSeen   && (
              <span className="block text-xs text-gray-500">Last seen at {new Date(lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
