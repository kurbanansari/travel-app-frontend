"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useSocketListeners from "@/hooks/useSocketListeners";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/chat/sidebar/SideBar";
import ChatWindow from "@/components/chat/chatwindow/ChatWindow";
import { useParams } from "next/navigation";

import { RootState, AppDispatch } from "@/redux/store";

import ChatHeader from "@/components/chat/ChatMainHeader";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUserId } from "@/redux/slices/chatSlice";

export default function ChatPage() {
   useSocketListeners();
  const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
 const { user } = useSelector((state: RootState) => state.user);
 // 1️⃣ Set currentUserId in chatSlice when user loads
  useEffect(() => {
    if (user?.id) {
      dispatch(setCurrentUserId(user.id));
    }
  }, [user, dispatch]);

  // Sync local state with Redux selectedUser
  useEffect(() => {
    if (selectedUser) setSelectedUserId(selectedUser.id);
  }, [selectedUser]);

  // Sync with URL params
  useEffect(() => {
    setSelectedUserId(params.otherUserId as string | null);
    setIsMobileChatOpen(!!params.otherUserId && window.innerWidth < 640);
  }, [params.otherUserId]);

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
  // Sync selectedUserId with URL params
  useEffect(() => {
    setSelectedUserId(params.otherUserId as string | null);
    setIsMobileChatOpen(!!params.otherUserId && window.innerWidth < 640);
  }, [params.otherUserId]);

  return (
        // < className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 sm:p-6 pb-20 sm:pb-24">
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 sm:p-6">
     <Card className="w-full max-w-xl pb-10 shadow-2xl rounded-xl border border-emerald-100 bg-white flex flex-col h-[90vh]">
       <ChatHeader onBack={handleBack} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col sm:flex-row min-h-[70vh] w-full overflow-hidden">
          {/* Sidebar */}
          <div
           className={`${
      isMobileChatOpen ? "hidden" : "flex"
    } sm:flex w-full sm:w-64 flex-shrink-0 bg-emerald-50/50 border-r border-emerald-100 transition-all duration-300 ease-in-out`}
  >
            <Sidebar onSelectConversation={handleSelectConversation} />
          </div>

          {/* Chat Window */}
          <div
            className={`${
              isMobileChatOpen ? "flex" : "hidden"
            } sm:flex flex-1 bg-white min-h-[70vh] sm:min-h-[70vh] transition-all duration-300 ease-in-out`}
          >
            {selectedUserId ? (
              <ChatWindow otherUserId={selectedUserId} key={selectedUserId} />
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
