
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/chat/SideBar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    setIsMobileChatOpen(true);
  };

  const handleBack = () => {
    setIsMobileChatOpen(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileChatOpen(false);
        if (!selectedUserId) {
          setSelectedUserId(null);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUserId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 sm:p-6 pb-20 sm:pb-24">
      <Card
        className="w-full max-w-xl shadow-2xl rounded-2xl border border-emerald-100 bg-white flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center p-3 bg-gradient-to-r from-emerald-100 to-teal-100 border-b border-emerald-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-emerald-800 hover:bg-emerald-200/50 rounded-full transition-all duration-200 ease-in-out hover:scale-110"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="ml-3 text-lg font-semibold text-emerald-900 tracking-tight">
            Messages
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col sm:flex-row min-h-[70vh]">
          {/* Sidebar */}
          <div
            className={`${
              isMobileChatOpen ? "hidden" : "flex"
            } sm:flex w-full sm:w-64 bg-emerald-50/50 border-r border-emerald-100 transition-all duration-300 ease-in-out`}
          >
            <Sidebar onSelectConversation={handleSelectConversation} />
          </div>

          {/* Chat Window */}
          <div
            className={`${
              isMobileChatOpen ? "flex" : "hidden"
            } sm:flex flex-1 bg-white min-h-[60vh] sm:min-h-[70vh] transition-all duration-300 ease-in-out`}
          >
            {selectedUserId ? (
              <ChatWindow
                otherUserId={selectedUserId}
                key={selectedUserId}
              />
            ) : (
              <div className="flex items-center justify-center w-full text-emerald-600 text-base font-medium animate-fade-in">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}