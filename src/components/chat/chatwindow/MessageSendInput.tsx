"use client";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { sendMessage } from "@/redux/thunk/chatThunk";
import { useSocket } from "@/contexts/SocketContext";
import { Message, messageReceived, removeMessage } from "@/redux/slices/chatSlice";
type MessageInputProps = {
  otherUserId: string;
};

export default function MessageInput({ otherUserId }: MessageInputProps) {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const [newMessage, setNewMessage] = useState("");
    const { user } = useSelector((state: RootState) => state.user);
   

// const handleSend = () => {
//   if (!newMessage.trim() || !otherUserId) return;

//   const tempId = Date.now().toString();

//   const tempMessage: Message = {
//     id: tempId,
//     tempId,
//     message: newMessage,
//     sender: { id: user?.id || "", name: user?.name || "You", profile_pic_url: user?.profilePic || null },
//     receiver: { id: otherUserId, name: "User", profile_pic_url: null },
//     read: false,
//     sent_at: new Date().toISOString(),
//     timestamp: new Date().toISOString(),
//   };

//   // Emit via socket instead of dispatching directly
//   socket?.emit("sendMessage", {
//     toUserId: otherUserId,
//     message: newMessage,
//     fromUserId: user?.id,
//     tempId, // Include tempId for deduplication
//   });

//   // Optimistic UI update: dispatch temp message
//   dispatch(messageReceived(tempMessage));

//   // Send to backend via thunk
//   dispatch(sendMessage({ toUserId: otherUserId, message: newMessage, tempId }));

//   setNewMessage("");
// };

//  const handleSend = async () => {
//     if (!newMessage.trim() || !otherUserId) return;

//     // Optimistic message
//     const tempMessage: Message = {
//       id: Date.now().toString(),
//       message: newMessage,
//       sender: { id: user?.id || "", name: user?.name || "You", profile_pic_url: user?.profilePic || null },
//       receiver: { id: otherUserId, name: "User", profile_pic_url: null },
//       read: false,
//       sent_at: new Date().toISOString(),
//       timestamp: new Date().toISOString(),
//     };

//     dispatch(messageReceived(tempMessage));

//     // Emit via socket
//     socket?.emit("sendMessage", {
//       toUserId: otherUserId,
//       message: newMessage,
//       fromUserId: user?.id,
//     });

//     // Save to backend
//     dispatch(sendMessage({ toUserId: otherUserId, message: newMessage }));

//     setNewMessage("");
//   };


  // const handleSend =  () => {
  //   if (!newMessage.trim() || !otherUserId) return;
  //    dispatch(
  //     sendMessage({ toUserId: otherUserId, message: newMessage,tempId })
  //   ).unwrap();
  //    // Optionally, immediately update Redux for instant UI
   
  //   // Also tell socket user stopped typing
  //   socket?.emit("typing", { toUserId: otherUserId, isTyping: false });
  //   setNewMessage("");
  // };

const handleSend = async () => {
    if (!newMessage.trim() || !otherUserId || !user?.id) return;

    const tempId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; // Line 21: Temporary id for optimistic update
    const tempMessage: Message = {
      id: tempId,
      message: newMessage,
      sender: { id: user.id, name: user.name || "You", profile_pic_url: user.profilePic || null },
      receiver: { id: otherUserId, name: "User", profile_pic_url: null },
      read: false,
      sent_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message with temp id:", tempId); // Line 31: Debug log

    // Optimistic UI update
    dispatch(messageReceived(tempMessage));

    // Emit via socket for real-time delivery
    socket?.emit("sendMessage", {
      toUserId: otherUserId,
      message: newMessage,
      fromUserId: user.id,
    });

    // Stop typing event
    socket?.emit("typing", { toUserId: otherUserId, isTyping: false });

    try {
      // Send to backend
      await dispatch(sendMessage({ toUserId: otherUserId, message: newMessage })).unwrap();
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(removeMessage(tempId)); // Line 48: Rollback with temp id
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // emit typing event
   socket?.emit("typing", {
    userId: user?.id,
    toUserId: otherUserId,
    isTyping: value.length > 0,
  });
  };

  return (
    <div className="p-3 border-t bg-white flex items-center">
      <Input
        type="text"
        placeholder="Type a message"
         autoComplete="off"
        value={newMessage}
        onChange={handleChange}
        name="chatMessage"
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
  );
}
