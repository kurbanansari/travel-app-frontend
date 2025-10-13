

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchConversations, markMessagesAsRead } from "@/redux/thunk/chatThunk";
import { messageReceived } from "@/redux/slices/chatSlice";
import { useSocket } from "@/contexts/SocketContext";
import ConversationItem from "./ConversationItem";

type Props = {
  onSelectConversation: (userId: string) => void;
};

export default function ConversationList({ onSelectConversation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const { conversations, loading, error, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [showMarkAsRead, setShowMarkAsRead] = useState<string | null>(null);

  // Listen to socket messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (data: { message: any }) => {
      const msg = data.message;

      if (msg.sender.id === user.id || msg.receiver.id === user.id) {
        dispatch(messageReceived(msg));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user, dispatch]);

  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleToggleMarkAsRead = (userId: string) => {
    setShowMarkAsRead((prev) => (prev === userId ? null : userId));
  };

  const handleMarkAsRead = (userId: string) => {
    dispatch(markMessagesAsRead({ otherUserId: userId }))
      .unwrap()
      .then(() => setShowMarkAsRead(null))
      .catch((err) => console.error(err));
  };
  
  // if (loading) return <p className="p-4 text-sm text-gray-400">Loading...</p>;
  // if (error) return <p className="p-4 text-sm text-red-500">{error}</p>;
  // if (!loading && conversations.length === 0)
    // return <p className="p-4 text-sm text-gray-400">No conversations yet</p>;

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((c, index) => (
        <ConversationItem
          key={`${c.otherUser.id}-${index}`}
          conversation={c}
          selectedUser={selectedUser}
          onSelectConversation={onSelectConversation}
          onToggleMarkAsRead={handleToggleMarkAsRead}
          onMarkAsRead={handleMarkAsRead}
          showMarkAsRead={showMarkAsRead}
        />
      ))}
    </div>
  );
}
