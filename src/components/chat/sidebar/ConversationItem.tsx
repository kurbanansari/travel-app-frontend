import { Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { setSelectedUser } from "@/redux/slices/chatSlice";
import { useDispatch } from "react-redux";
import { fetchConversation } from "@/redux/thunk/chatThunk";

export default function ConversationItem({
  conversation,
  selectedUser,
  onSelectConversation,
  onToggleMarkAsRead,
  onMarkAsRead,
  showMarkAsRead,
}: any) {
  const dispatch = useDispatch();
  //  const displayUser = conversation.otherUser;
const displayUser =
    selectedUser?.id === conversation.otherUser.id
      ? selectedUser
      : conversation.otherUser;
  return (
    <div
      onClick={() => {
        dispatch(setSelectedUser(conversation.otherUser));
        onSelectConversation(conversation.otherUser.id);
        //  dispatch(fetchConversation({ otherUserId, page: 1, limit: 20 }));
      }}
      className={`flex overflow-x-hidden w-full items-center gap-3 px-4 py-3 border-b border-emerald-100 hover:bg-emerald-50 cursor-pointer transition-all duration-200 ${
        selectedUser?.id === displayUser.id ? "bg-emerald-100" : ""
      }`}
    >
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={displayUser.profile_pic_url || undefined}
            alt={displayUser.name}
          />
          <AvatarFallback>
            {displayUser.name?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
        {displayUser.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center w-full">
          <span className="font-medium text-emerald-900 flex-1 truncate">
            {displayUser.name}
          </span>
          {conversation.unreadCount > 0 && (
            <span
              className="text-xs bg-emerald-500 text-white rounded-full px-2 py-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMarkAsRead(displayUser.id);
              }}
            >
              {conversation.unreadCount}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {conversation.lastMessage?.message || "No messages yet"}
        </p>

        {showMarkAsRead === displayUser.id && (
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(displayUser.id);
            }}
            disabled={conversation.unreadCount === 0}
            className={`
    flex items-center gap-1 text-[11px] font-medium
    px-2.5 py-1 rounded-full
    transition-all duration-200 ease-in-out
    border
    ${
      conversation.unreadCount === 0
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-emerald-600 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 active:scale-95 shadow-sm"
    }
  `}
          >
            <Check className="w-3 h-3" />
            <span>Mark As Read</span>
          </Button>
        )}
      </div>
    </div>
  );
}
