
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "@/redux/thunk/chatThunk";
import { searchUsers } from "@/redux/thunk/userThunk";
import { setSelectedUser } from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Input } from "../ui/input";
import { UserListItem } from "@/redux/thunk/userThunk";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SidebarProps = {
  onSelectConversation: (userId: string) => void;
};

export default function Sidebar({ onSelectConversation }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading: conversationsLoading, error: conversationsError } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { results, loading: searchLoading } = useSelector((state: RootState) => state.search);
  const [query, setQuery] = useState("");
  // Debug
  useEffect(() => {
    console.log("Sidebar - user:", user);
    console.log("Sidebar - conversations:", conversations);
  }, [user, conversations]);

  // Fetch conversations on load
  useEffect(() => {
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Search users
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(() => {
      dispatch(searchUsers({ search: query }));
    }, 400);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleSelectUser = (user: UserListItem) => {
    dispatch(
      setSelectedUser({
        id: user.id,
        name: user.name,
        profile_pic_url: user.profile_pic_url,
      })
    );
    onSelectConversation(user.id);
    setQuery("");
  };

  return (
    <div className="w-full md:w-80 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b">
        <span className="font-semibold">My Chats</span>
      </div>

      {/* Search bar */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent px-2 py-1 text-sm outline-none"
          />
        </div>

        {/* Search results */}
        {query && (
          <div className="mt-2">
            {searchLoading && <p className="text-sm text-gray-400">Searching...</p>}
            {!searchLoading && results.length > 0 && (
              <ul className="max-h-48 overflow-y-auto bg-white rounded-lg border shadow">
                {results.map((u) => (
                  <li
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className="px-3 py-2 hover:bg-green-50 cursor-pointer"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={u.profile_pic_url || undefined} alt={u.name} />
                      <AvatarFallback>{u.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    {u.name}
                  </li>
                ))}
              </ul>
            )}
            {!searchLoading && results.length === 0 && (
              <p className="text-sm text-gray-400">No users found</p>
            )}
          </div>
        )}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversationsLoading && <p className="text-sm text-gray-400 p-4">Loading...</p>}
        {conversationsError && (
          <p className="text-sm text-red-500 p-4">{conversationsError}</p>
        )}
        {!conversationsLoading && conversations.length === 0 && (
          <p className="text-sm text-gray-400 p-4">No conversations yet</p>
        )}
        {conversations.map((c, index) => (
          <div
            key={`${c.otherUser.id}-${index}`}
            onClick={() => {
              dispatch(setSelectedUser(c.otherUser));
              onSelectConversation(c.otherUser.id);
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className="relative">
              
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={c.otherUser.profile_pic_url || undefined}
                  alt={c.otherUser.name}
                />
                <AvatarFallback>{c.otherUser.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              {c.otherUser.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{c.otherUser.name}</span>
                {c.unreadCount > 0 && (
                  <span className="text-xs bg-green-500 text-white rounded-full px-2">
                    {c.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">
                {c.lastMessage?.message || "No messages yet"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}