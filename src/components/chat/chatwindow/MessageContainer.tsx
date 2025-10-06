"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useSocket } from "@/contexts/SocketContext";


type ChatMessageProps = {
  otherUserId: string;
   isTyping?: boolean;
};

export default function MessageContainer({otherUserId ,isTyping}: ChatMessageProps) {
      const dispatch = useDispatch<AppDispatch>();
      const {socket} = useSocket();
  const bottomRef = useRef<HTMLDivElement>(null);
    const { messages, loading, error, conversations, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const { user} = useSelector((state: RootState) => state.user);
   
    const myUserId = user?.id 



  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages,isTyping]);


  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
     {messages.map((msg,index) => (
          <div
           
            key={msg.id || `${msg.message}-${msg.sender.id}-${msg.sent_at}-${index}`}// Line
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
      
      {isTyping && (
        <div className="italic text-gray-500 text-sm px-4 py-1">
          Typing...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
