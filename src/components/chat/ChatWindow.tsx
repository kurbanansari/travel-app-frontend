
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchConversation, markMessagesAsRead, sendMessage } from "@/redux/thunk/chatThunk";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type ChatWindowProps = {
  otherUserId: string | null;
};

export default function ChatWindow({ otherUserId }: ChatWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { messages, loading, error, conversations, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const { user} = useSelector((state: RootState) => state.user);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const myUserId = user?.id 

  // Find the other user's profile from selectedUser or conversations
  const otherUser  =
    selectedUser && selectedUser.id === otherUserId
      ? selectedUser
      : conversations.find((c) => c.otherUser.id === otherUserId)?.otherUser;

  useEffect(() => {
    if (otherUserId) {
      dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
     dispatch(markMessagesAsRead({ otherUserId }))
        .unwrap()
    }
  }, [otherUserId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !otherUserId) return;
    dispatch(sendMessage({ toUserId: otherUserId, message: newMessage }));
    setNewMessage("");
  };

  if (!otherUserId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-emerald-50">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-emerald-200 bg-emerald-100">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push(`/profile/${otherUserId}`)}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage
               src={otherUser?.profile_pic_url || undefined}
               alt={otherUser?.name || "User"}
              className="h-full w-full object-cover border-emerald-200 bg-emerald-100"
            />
          <AvatarFallback>
        {otherUser?.name?.[0] || "?"}
      </AvatarFallback>
    </Avatar>
          <div>
            <span className="font-semibold text-emerald-900">{otherUser?.name || "Unknown"}</span>
            {otherUser?.online && (
              <span className="block text-xs text-emerald-500">Online</span>
            )}
          </div>
        </div>
        {/* Mark as Read Button */}
        
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <p className="text-sm text-emerald-400">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-emerald-400">No messages yet</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender.id === myUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender.id === myUserId
                  ? "bg-emerald-500 text-white"
                  : "bg-white border"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs opacity-70 block">
                {new Date(msg.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t bg-white flex items-center">
        <Input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-emerald-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none transition-all duration-200"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          className="ml-2 bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-all duration-200 hover:scale-105"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
