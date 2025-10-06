// "use client";

// import { useState, useEffect, useRef } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/store";
// import {
//   fetchConversation,
//   markMessagesAsRead,
//   sendMessage,
// } from "@/redux/thunk/chatThunk";
// import { useSocket } from "@/contexts/SocketContext";
// import { messageReceived } from "@/redux/slices/chatSlice";

// import ChatHeader from "./ChatHeader";
// import MessageContainer from "./MessageContainer";
// import MessageInput from "./MessageSendInput";

// type ChatWindowProps = {
//   otherUserId: string | null;
// };

// export default function ChatWindow({ otherUserId }: ChatWindowProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { socket } = useSocket();
//   const processedRead = useRef<Set<string>>(new Set());
//   const lastMarkedRef = useRef<string[]>([]);
//   const processedMessages = useRef<Set<string>>(new Set());
//   const { messages, loading, error, conversations, selectedUser } = useSelector(
//     (state: RootState) => state.chat
//   );

//   const bottomRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (!socket || !otherUserId) return;

//     // join chat room
//     socket.emit("subscribeToChat", otherUserId);

//     // mark messages as read when opening
//     socket.emit("markMessageRead", { otherUserId });

//     return () => {
//       socket.emit("unsubscribeFromChat", otherUserId);
//     };
//   }, [socket, otherUserId]);

//   useEffect(() => {
//     if (!socket) return;

//     // 📩 Receive new messages
//     //   socket.on("newMessage", (data) => {
//     //   // data.message ke andar actual message object hoga
//     //   const messageData = data.message;

//     //   // Agar ye message current chat ka hai tabhi dispatch karo
//     //   if (messageData.from_user === otherUserId || messageData.to_user === otherUserId) {
//     //     console.log("📩 socket newMessage:", messageData);
//     //     dispatch(messageReceived(messageData));
//     //   }
//     // });
//    socket.on("newMessage", (data) => {
//   const messageData = data.message;

//   // Avoid duplicates
//   if (processedMessages.current.has(messageData.id)) return;
//   processedMessages.current.add(messageData.id);

//   // Only process if message belongs to this chat
//   if (
//     messageData.sender.id === otherUserId ||
//     messageData.receiver.id === otherUserId
//   ) {
//     dispatch(messageReceived(messageData));
//   }
// });
//     // 👤 Online/Offline status
//     socket.on("userStatusChanged", ({ userId, status }) => {
//       console.log("status update:", userId, status);
//       // optional: dispatch to store if you track status
//     });

//     // ✍️ Typing
//     socket.on("userTyping", ({ userId, isTyping }) => {
//       if (userId === otherUserId) {
//         console.log(`${userId} is typing:`, isTyping);
//         // optional: set local state for typing indicator
//       }
//     });

//     // ✅ Read receipts
//     socket.on("messageRead", ({ messageId, readBy }) => {
//       if (processedRead.current.has(messageId)) return; // skip duplicate

//       processedRead.current.add(messageId);
//       console.log("✅ message read:", messageId, readBy);
//       // optional: dispatch to update Redux message state
//     });

//     return () => {
//       socket.off("newMessage");
//       socket.off("userStatusChanged");
//       socket.off("userTyping");
//       socket.off("messageRead");
//     };
//   }, [socket, otherUserId, dispatch]);

//   //Find the other user's profile from selectedUser or conversations
//   const otherUser =
//     selectedUser && selectedUser.id === otherUserId
//       ? selectedUser
//       : conversations.find((c) => c.otherUser.id === otherUserId)?.otherUser;

//   // useEffect(() => {
//   //   if (otherUserId) {
//   //     if(messages.length ===0){

//   //       dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
//   //     }
//   //     dispatch(markMessagesAsRead({ otherUserId })).unwrap();
//   //   }
//   // }, [otherUserId, dispatch]);
//   useEffect(() => {
//     if (!otherUserId) return;

//     // Pehle conversation fetch karo agar empty hai
//     if (messages.length === 0) {
//       dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
//       return; // fetch hone ke baad hi read check karega
//     }

//     // Sirf unread messages ko read mark karo
//     const unread = messages.filter(
//       (m) => m.sender.id === otherUserId && !m.read
//     );
//     const newUnread = unread.filter(
//       (m) => !lastMarkedRef.current.includes(m.id)
//     );
//     if (newUnread.length > 0) {
//       dispatch(markMessagesAsRead({ otherUserId }))
//         .unwrap()
//         .then(() => {
//           lastMarkedRef.current = [
//             ...lastMarkedRef.current,
//             ...newUnread.map((m) => m.id),
//           ];
//           console.log("✅ Marked once for:", otherUserId);
//         });
//     }
//   }, [otherUserId, messages, dispatch]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (!otherUserId) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-gray-500">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-emerald-50">
//       <ChatHeader otherUserId={otherUserId} />

//       {/* Messages area */}
//       <MessageContainer otherUserId={otherUserId} />

//       {/* Input box */}
//       <MessageInput otherUserId={otherUserId} />
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/store";
// import {
//   fetchConversation,
//   markMessagesAsRead,
// } from "@/redux/thunk/chatThunk";
// import { messageReceived } from "@/redux/slices/chatSlice";
// import { useSocket } from "@/contexts/SocketContext";

// import ChatHeader from "./ChatHeader";
// import MessageContainer from "./MessageContainer";
// import MessageInput from "./MessageSendInput";

// type ChatWindowProps = {
//   otherUserId: string | null;
// };

// export default function ChatWindow({ otherUserId }: ChatWindowProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { socket } = useSocket();
//   const processedRead = useRef<Set<string>>(new Set());
//   const lastMarkedRef = useRef<string[]>([]);
//   const processedMessages = useRef<Set<string>>(new Set());
//   const { messages, conversations, selectedUser } = useSelector(
//     (state: RootState) => state.chat
//   );
//   const { user } = useSelector((state: RootState) => state.user);
//      const myUserId = user?.id 
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // Join / leave chat room
//   useEffect(() => {
//     if (!socket || !otherUserId) return;

//     socket.emit("subscribeToChat", otherUserId);
//     socket.emit("markMessageRead", { otherUserId });

//     return () => {
//       socket.emit("unsubscribeFromChat", otherUserId);
//     };
//   }, [socket, otherUserId]);

//   // Socket listeners
//   useEffect(() => {
//     if (!socket || !user) return;

//     const handleNewMessage = (data: { message: any }) => {
//       const messageData = data.message;

//       // Avoid duplicates
//       if (processedMessages.current.has(messageData.id)) return;
//       processedMessages.current.add(messageData.id);

//       // Only handle messages where current user is sender or receiver
//       if (
//         messageData.sender.id === user.id ||
//         messageData.receiver.id === user.id
//       ) {
//         dispatch(messageReceived(messageData));
//       }
//     };

//     socket.on("newMessage", handleNewMessage);

//     socket.on("userStatusChanged", ({ userId, status }) => {
//       console.log("status update:", userId, status);
//     });

//     socket.on("userTyping", ({ userId, isTyping }) => {
//       if (userId === otherUserId) console.log(`${userId} is typing:`, isTyping);
//     });

//     socket.on("messageRead", ({ messageId, readBy }) => {
//       if (processedRead.current.has(messageId)) return;
//       processedRead.current.add(messageId);
//       console.log("✅ message read:", messageId, readBy);
//     });

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//       socket.off("userStatusChanged");
//       socket.off("userTyping");
//       socket.off("messageRead");
//     };
//   }, [socket, otherUserId, user, dispatch]);

//   // Fetch conversation whenever user changes
// // Fetch conversation only on user change
// useEffect(() => {
//   if (!otherUserId) return;

//   dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
// }, [otherUserId, dispatch]);

// // Mark unread messages as read whenever messages update
// useEffect(() => {
//   if (!otherUserId) return;

//   const unread = messages.filter(
//     (m) => m.sender.id === otherUserId && !m.read
//   );
//   const newUnread = unread.filter(
//     (m) => !lastMarkedRef.current.includes(m.id)
//   );

//   if (newUnread.length > 0) {
//     dispatch(markMessagesAsRead({ otherUserId }))
//       .unwrap()
//       .then(() => {
//         lastMarkedRef.current = [
//           ...lastMarkedRef.current,
//           ...newUnread.map((m) => m.id),
//         ];
//       });
//   }
// }, [otherUserId, messages, dispatch]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (!otherUserId)
//     return (
//       <div className="flex-1 flex items-center justify-center text-gray-500">
//         Select a chat to start messaging
//       </div>
//     );

//   return (
//     <div className="flex-1 flex flex-col bg-emerald-50">
//       <ChatHeader otherUserId={otherUserId} />

//       <MessageContainer otherUserId={otherUserId} />
//       <div ref={bottomRef} />

//       <MessageInput otherUserId={otherUserId} />
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchConversation,
  markMessagesAsRead,
} from "@/redux/thunk/chatThunk";
import { messageReceived,Message } from "@/redux/slices/chatSlice";
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
  const { messages, selectedUser } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.user);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // -----------------------------
  // Join / leave chat room
  // -----------------------------
  useEffect(() => {
    if (!socket || !otherUserId) return;

    socket.emit("subscribeToChat", otherUserId);
    socket.emit("markMessageRead", { otherUserId });

    return () => {
      socket.emit("unsubscribeFromChat", otherUserId);
    };
  }, [socket, otherUserId]);

  // -----------------------------
  // Socket listeners
  // -----------------------------
  
  // ✅ Listen for socket events
  useEffect(() => {
    if (!socket || !user) return;

//     const handleNewMessage = (data: { message: Message }) => {
//   const msg = data.message;

//   // Only process messages from other users or server-confirmed messages
//   if (msg.sender.id !== user?.id || (msg.id && !msg.tempId)) {
//     const exists = messages.some((m) => m.id === msg.id || (msg.tempId && m.tempId === msg.tempId));
//     if (!exists) {
//       dispatch(messageReceived(msg));
//     }
//   }
// };
// const handleNewMessage = (data: { message: Message }) => {
//   console.log("Received newMessage:", data.message);
//   const msg = data.message;
//   if (msg.sender.id !== user?.id || (msg.id && !msg.tempId)) {
//     const exists = messages.some((m) => m.id === msg.id || (msg.tempId && m.tempId === msg.tempId));
//     console.log("Message exists:", exists);
//     if (!exists) {
//       dispatch(messageReceived(msg));
//     }
//   }
// };

const handleNewMessage = (data: { message: Message }) => {
      const msg = data.message;
      console.log("Received newMessage:", { id: msg.id, message: msg.message, sender: msg.sender.id, receiver: msg.receiver.id }); // Line 39: Debug log
      // Process messages from other users; rely on deduplication for sender's messages
      if (msg.sender.id !== user.id) {
        dispatch(messageReceived(msg)); // Line 42
      } else {
        console.log("Skipped newMessage from sender:", msg.id); // Line 44: Debug log
      }
    };
  //   const handleNewMessage = (data: { message: any }) => {
  //     const msg = data.message;
      
  //        const exists = messages.some(m => m.id === msg.id || (msg.tempId && m.tempId === msg.tempId));
  //   if (!exists) dispatch(messageReceived(msg));
  // };

  const handleTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
    if (userId === otherUserId) setIsTyping(isTyping);
  };

    const handleMessageRead = ({ messageId, readBy }: { messageId: string; readBy: string }) => {
      if (processedRead.current.has(messageId)) return;
      processedRead.current.add(messageId);
      console.log("✅ Message read:", messageId, readBy);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
      socket.off("messageRead", handleMessageRead);
    };
  }, [socket, otherUserId, user, dispatch]);

  // -----------------------------
  // Fetch conversation only when user changes
  // -----------------------------
  const fetchedRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!otherUserId) return;

    if (!fetchedRef.current.has(otherUserId)) {
      dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
      fetchedRef.current.add(otherUserId);
    }
  }, [otherUserId, dispatch]);

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

  return (
    <div className="flex-1 flex flex-col bg-emerald-50">
      <ChatHeader otherUserId={otherUserId} />

      <MessageContainer otherUserId={otherUserId} isTyping={isTyping} />
      <div ref={bottomRef} />

      <MessageInput otherUserId={otherUserId} />
    </div>
  );
}
