"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useSocket } from "@/contexts/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { deleteMessage } from "@/redux/thunk/chatThunk";
import { Trash2 } from "lucide-react";


type ChatMessageProps = {
  otherUserId: string;
   isTyping?: boolean;
};

export default function MessageContainer({otherUserId ,isTyping}: ChatMessageProps) {
      const dispatch = useDispatch<AppDispatch>();
      const {socket} = useSocket();
      const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
    const { messages, loading, error, conversations, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const { user} = useSelector((state: RootState) => state.user);
   
    const myUserId = user?.id 
 const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

 if (!selectedUser?.id) return <div>Select a user to chat</div>;

  const filteredMessages = messages.filter(
  (msg) =>
    (msg.sender.id === otherUserId  && msg.receiver.id === myUserId) ||
    (msg.sender.id === myUserId && msg.receiver.id === otherUserId )
);
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages,isTyping]);
  useEffect(() => {
  const container = containerRef.current;
  if (container) {
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }
}, [messages, isTyping]);
console.log("MessageContainer render:", { messages: filteredMessages.length, isTyping });

 const handleDelete = (messageId: string) => {
    dispatch(deleteMessage({ messageId }));
    setSelectedMessageId(null); // hide trash icon after delete
  };

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId((prev) => (prev === messageId ? null : messageId)); // toggle icon
  };
  return (
    <div 
        //  ref={containerRef}
    className="flex flex-1 flex-col space-y-3 overflow-y-auto w-full py-2 px-4 overflow-x-hidden">
     {filteredMessages.map((msg,index) => (
          <div
          key={msg.id || index}
          onClick={() => msg.sender.id === myUserId && handleMessageClick(msg.id)}
          className={`flex ${
              msg.sender.id === myUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
            className={`px-4 py-2 rounded-2xl relative
                bg-${msg.sender.id === myUserId ? "emerald-500 text-white" : "gray-100 text-black"}
                break-words whitespace-pre-wrap
                max-w-full
              `}
              style={{ wordBreak: "break-word" }}
            >
              <p className="break-words whitespace-pre-wrap">{msg.message}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {new Date(msg.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          {/* 👈 Show trash icon only if this message is selected */}
            {msg.sender.id === myUserId && selectedMessageId === msg.id && (
              <button
                className="absolute top-0 right-1 text-red-500 hover:text-red-700 z-10"
                onClick={() => handleDelete(msg.id)}
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
      
    
      {/* ✅ Modern WhatsApp-style typing indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-1 bg-white border rounded-2xl px-4 py-2 w-fit shadow-sm"
          >
            <div className="flex space-x-1">
              <motion.span
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              />
              <motion.span
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              />
              <motion.span
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>





  );
}
