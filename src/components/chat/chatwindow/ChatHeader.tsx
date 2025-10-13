"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useRouter } from "next/navigation";
import User from "@/redux/slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { blockUser, clearChatHistory, fetchOnlineUsers, unblockUser } from "@/redux/thunk/chatThunk";

type ChatHeaderProps = {
  otherUserId: string;
  isOnline: boolean;
  lastSeen: string | null;
};

export default function ChatHeader({ otherUserId,isOnline,lastSeen }: ChatHeaderProps) {
  const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();
  const { selectedUser,onlineUsers,loading,error ,blockedUsers} = useSelector((state: RootState) => state.chat);
   const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
    const isBlocked = blockedUsers.includes(otherUserId);
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleClearChat = () => {
  // Directly call the API
  dispatch(clearChatHistory({otherUserId})); // pass userId if needed in backend
  setMenuOpen(false);
};
// const handleBlockUser = () => {
//   dispatch(blockUser({ userId: otherUserId }));
//   setMenuOpen(false);
// };


  const handleBlockToggle = () => {
    if (isBlocked) {
      dispatch(unblockUser({ userId:otherUserId }));
    } else {
      dispatch(blockUser({ userId:otherUserId }));
    }
    setMenuOpen(false);
  };

  // Get the specific user from onlineUsers
  const userStatus = onlineUsers.find((u) => u.id === otherUserId);

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
            {selectedUser?.name || "?"}
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
       {/* Vertical 3-dot menu */}
      <div className="relative" ref={menuRef}>
        <button
          className="p-2 rounded hover:bg-emerald-200"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="block w-1 h-1 bg-emerald-900 rounded-full mb-1"></span>
          <span className="block w-1 h-1 bg-emerald-900 rounded-full mb-1"></span>
          <span className="block w-1 h-1 bg-emerald-900 rounded-full"></span>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-50 bg-white border border-gray-200 rounded shadow-lg z-50">
            <button
              className="w-full text-sm text-left px-4 py-2 hover:bg-gray-100 text-green-600"
              onClick={handleClearChat}
              disabled={loading}
            >
              {loading ? "Clearing..." : "Clear Chat History"}</button>
           <button
              className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={handleBlockToggle}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : isBlocked
                ? "Unblock User"
                : "Block User"}
            </button>
            {error && <p className="px-4 py-1 text-xs text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}


