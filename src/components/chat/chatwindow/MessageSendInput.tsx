"use client";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { sendMessage } from "@/redux/thunk/chatThunk";
import { useSocket } from "@/contexts/SocketContext";
import { Send, Smile, Paperclip } from "lucide-react";
import { Message, messageReceived, removeMessage } from "@/redux/slices/chatSlice";
type MessageInputProps = {
  otherUserId: string;
};

export default function MessageInput({ otherUserId }: MessageInputProps) {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [newMessage, setNewMessage] = useState("");
    const { user } = useSelector((state: RootState) => state.user);
   const { blockedUsers ,selectedUser} = useSelector((state: RootState) => state.chat);
const isBlocked = blockedUsers.includes(otherUserId);

 const handleSend = async () => {
    if (isBlocked) return;
    if (!newMessage.trim() || !otherUserId || !user?.id) return;

    const messageToSend = newMessage;
    setNewMessage("");

    // Stop typing event
    socket?.emit("typing", { toUserId: otherUserId, isTyping: false });

    try {
      // 1️⃣ Send message to backend
      const sentMessage = await dispatch(
        sendMessage({ toUserId: otherUserId, message: messageToSend })
      ).unwrap();

      // 2️⃣ Emit socket event to receiver
      socket?.emit("sendMessage", {
        toUserId: otherUserId,
        message: messageToSend,
        fromUserId: user.id,
      });

      // 3️⃣ Add message to Redux (after success)
      dispatch(messageReceived(sentMessage));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

// const handleSend = async () => {
//   if (isBlocked) return;
//     if (!newMessage.trim() || !otherUserId || !user?.id) return;
     
//    // --- Clear immediately like WhatsApp ---
//     const messageToSend = newMessage;
//     setNewMessage("");
//     // const tempId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; // Line 21: Temporary id for optimistic update
//     // const tempMessage: Message = {
//     //   id: tempId,
//     //   message: messageToSend,
//     //   sender: { id: user.id, name: user.name || "You", profile_pic_url: user.profilePic || null },
//     //   receiver: { id: otherUserId,name: selectedUser?.name ?? "Unknown",  profile_pic_url: selectedUser?.profile_pic_url ?? null,},
//     //   read: false,
//     //   sent_at: new Date().toISOString(),
//     //   timestamp: new Date().toISOString(),
//     // };

//     // console.log("Sending message with temp id:", tempId); // Line 31: Debug log

//     // Optimistic UI update
//     const msg : {Message}
//     dispatch(messageReceived(Message));

//     // Emit via socket for real-time delivery
//     socket?.emit("sendMessage", {
//       toUserId: otherUserId,
//       message: newMessage,
//       fromUserId: user.id,
//       tempId,
//     });

//     // Stop typing event
//     socket?.emit("typing", { toUserId: otherUserId, isTyping: false });

//     try {
//       // Send to backend
//       await dispatch(sendMessage({ toUserId: otherUserId, message: newMessage})).unwrap();
//       setNewMessage("");
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       dispatch(removeMessage(tempId)); // Line 48: Rollback with temp id
//     }
//   };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
if (!user?.id || !otherUserId) return;
    

    const isTyping = value.length > 0;
    console.log("Emitting typing event:", { userId: user.id, toUserId: otherUserId, isTyping }); // Line 59: Debug log
    socket?.emit("typing", {
      userId: user.id,
      toUserId: otherUserId,
      isTyping,
    });
   
  // Stop typing 2s after user stops typing
if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
if (isTyping) {
  typingTimeoutRef.current = setTimeout(() => {
    socket?.emit("typing", { userId: user.id, toUserId: otherUserId, isTyping: false }); // added userId
  }, 2000);
}
  };

  return (

    <div className="w-full bg-white overflow-hidden  px-1 flex items-center gap-1">

     {isBlocked && (
        <p className="text-xs text-gray-500 mb-1">
          You’ve blocked this user. You can’t send messages.
        </p>
      )}

      {/* Message Input */}
      <div className="flex-1 relative">
        <Input
          type="text"
          // placeholder="Type a message"
           placeholder={
            isBlocked ? "You cannot send messages" : "Type a message"
          }
            disabled={isBlocked} 
          value={newMessage}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          spellCheck={false}
          autoComplete="off"
          name="chatMessage"
          className={`w-full rounded-full border border-gray-200 px-4 py-2 pr-10 text-sm transition-all duration-200 ${
            isBlocked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "focus:ring-2 focus:ring-emerald-400 focus:bg-white"
          }`}
          // className="w-full rounded-full border border-gray-200 bg-gray-100 px-4 py-2 pr-10 focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all duration-200 outline-none text-sm"
        />
      </div>

      {/* Send Button (icon like WhatsApp) */}
      <Button
        onClick={handleSend}
        disabled={isBlocked}
        size="icon"
        className={`rounded-full text-white transition-all duration-200 shadow-md ${
            isBlocked
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 hover:scale-110"
          }`}
        // className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 hover:scale-110 shadow-md"
      >
        <Send size={20} className="rotate-45" /> 
      </Button>
    </div>
  );
}
