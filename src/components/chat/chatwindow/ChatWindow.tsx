

"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchConversation,
  fetchOnlineUsers,
  markMessagesAsRead,
} from "@/redux/thunk/chatThunk";
import { messageReceived,Message, updateOnlineStatus, setSelectedUser } from "@/redux/slices/chatSlice";
import { useSocket } from "@/contexts/SocketContext";

import ChatHeader from "./ChatHeader";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageSendInput";

type ChatWindowProps = {
  otherUserId: string | null;
  isTyping?: boolean;
};

export default function ChatWindow({ otherUserId }: ChatWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const processedRead = useRef<Set<string>>(new Set());
  const lastMarkedRef = useRef<string[]>([]);
  const processedMessages = useRef<Set<string>>(new Set());
  const { messages, selectedUser,onlineUsers } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.user);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);


  // 1️⃣ Initial fetch of online users
  // -----------------------------
  useEffect(() => {
    if (!otherUserId) return;
    dispatch(fetchOnlineUsers({ page: 1, limit: 50 }));
  }, [dispatch, otherUserId]);
  // -----------------------------
  // Join / leave chat room
  // -----------------------------
  useEffect(() => {
    if (!socket || !otherUserId) return;
console.log("Joining room for:", user?.id, otherUserId);
    socket.emit("subscribeToChat", otherUserId);
    socket.emit("markMessageRead", { otherUserId });

    return () => {
      socket.emit("unsubscribeFromChat", otherUserId);
    };
  }, [socket, otherUserId]);

  useEffect(() => {
    if (!socket || !user) return;
    const handleNewMessage = (data: { message: Message }) => {
      const msg = data.message;
      if (msg.sender.id !== user.id) {
        dispatch(messageReceived(msg)); // Line 42
      }
    };

   const handleTyping = ({ userId: typingUserId, isTyping }: { userId: string; isTyping: boolean }) => {
  // Show typing if it's not me
  if (typingUserId !== user?.id) {
    setIsTyping(isTyping);
  }
};
   
   
     const handleUserStatus = (data: { userId: string; status: boolean; timestamp: string }) => {
    console.log("📡 userStatusChanged:", data);
    dispatch(updateOnlineStatus({ 
      userId: data.userId, 
      status: data.status, 
      lastSeen: data.timestamp 
    }));
  };
  
    const handleMessageRead = ({ messageId, readBy }: { messageId: string; readBy: string }) => {
      if (processedRead.current.has(messageId)) return;
      processedRead.current.add(messageId);
      console.log("✅ Message read:", messageId, readBy);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);
    socket.on("messageRead", handleMessageRead);
    socket.on("userOnline", handleUserStatus);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
      socket.off("messageRead", handleMessageRead);
        socket.off("userOnline", handleUserStatus);
    };
  }, [socket, otherUserId, user, dispatch]);

  // -----------------------------
  // Fetch conversation only when user changes
  // -----------------------------
  const fetchedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!otherUserId) return;
   dispatch(setSelectedUser({
    id: otherUserId,
    name: selectedUser?.name || "Unknown",
    profile_pic_url: selectedUser?.profile_pic_url || null,
  })); 
    if (!fetchedRef.current.has(otherUserId)) {
      dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
      fetchedRef.current.add(otherUserId);
    }
  }, [otherUserId, dispatch]);

// useEffect(() => {
//   if (!otherUserId) return;
//   const userToSet = selectedUser?.id === otherUserId
//     ? selectedUser
//     : { id: otherUserId, name: selectedUser?.name || "Unknown", profile_pic_url: selectedUser?.profile_pic_url || null };

//   dispatch(setSelectedUser(userToSet));
// }, [otherUserId, selectedUser, dispatch]);

  // -----------------------------
  // Mark unread messages as read whenever messages update
  // -----------------------------
  useEffect(() => {
    if (!otherUserId) return;

    const unread = messages.filter(
      (m) => m.sender.id === otherUserId && !m.read
    );
    const newUnread = unread.filter(
      (m) => !lastMarkedRef.current.includes(m.id)
    );

    if (newUnread.length > 0) {
      dispatch(markMessagesAsRead({ otherUserId }))
        .unwrap()
        .then(() => {
          lastMarkedRef.current = [
            ...lastMarkedRef.current,
            ...newUnread.map((m) => m.id),
          ];
        });
    }
  }, [otherUserId, messages, dispatch]);

  // -----------------------------
  // Scroll to bottom on new messages
  // -----------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!otherUserId)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );

     const userStatus = onlineUsers.find((u) => u.id === otherUserId);
  const isOnline = userStatus?.isOnline ?? false;
  const lastSeen = userStatus?.lastSeen ?? null;

  return (
    // <div className="flex-1 flex flex-col bg-emerald-50 h-full mx-auto">
       <div className="flex-1 flex flex-col overflow-y-auto">
      <ChatHeader otherUserId={otherUserId} isOnline={isOnline} lastSeen={lastSeen} />
      <div className="flex-1 overflow-hidden overflow-y-auto ">
      <MessageContainer otherUserId={otherUserId} isTyping={isTyping} />
      <div ref={bottomRef} />
      </div>
      
      <MessageInput otherUserId={otherUserId} />
    </div>
   
  );
}
