

"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { blockUser, clearChatHistory, deleteMessage, fetchConversation, fetchConversations, fetchOnlineUsers, 
  markMessagesAsRead, sendMessage, unblockUser } from "../thunk/chatThunk";
// import { setSelected } from "./selectedphotosSlice";

interface User {
  id: string;
  name: string;
  profile_pic_url: string | null;
  isOnline?: boolean;
  lastSeen?: string | null;
}

export interface Message {
  id: string;
  message: string;
  sent_at: string;
  sender: User;
  receiver: User;
   timestamp: string | any;
  read?: boolean;
   tempId?: string;
   isTemporary?: boolean;
}

interface Conversation {
  otherUser: User;
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatState {
   blockedUsers: string[];
   currentUserId: string | null;
  conversations: Conversation[];
  messages: Message[];
  selectedUser: User | null;
  onlineUsers: any[];
  loadingOnlineUsers: boolean;
  errorOnlineUsers: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  currentUserId: null,
  blockedUsers: [],
  conversations: [],
  messages: [],
 selectedUser: null,
  onlineUsers: [],
  loadingOnlineUsers: false,
  errorOnlineUsers: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    setCurrentUserId: (state, action: PayloadAction<string>) => {
  state.currentUserId = action.payload;
},
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
      // state.messages = [];
    },
     setUserOnline: (state, action: PayloadAction<{ userId: string; online: boolean }>) => {
      if (action.payload.online) {
        if (!state.onlineUsers.includes(action.payload.userId))
          state.onlineUsers.push(action.payload.userId);
      } else {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload.userId);
      }
    },
    updateOnlineStatus: (
  state,
  action: PayloadAction<{ userId: string; status: boolean; lastSeen?: string }>
) => {
  const { userId, status, lastSeen } = action.payload;
  const user = state.onlineUsers.find((u) => u.id === userId);

  if (user) {
    // Only update if status changed
    if (user.isOnline !== status) {
      user.isOnline = status;
      if (!status) user.lastSeen = lastSeen || new Date().toISOString();
      else user.lastSeen = null;
    }
  } else {
    // Add new user if not exists
    state.onlineUsers.push({
      id: userId,
      name: "Unknown", // replace with API data if available
      isOnline: status,
      lastSeen: status ? null : lastSeen || new Date().toISOString(),
    });
  }
},
    //     updateOnlineStatus: (
    //   state,
    //   action: PayloadAction<{ userId: string; status: boolean; lastSeen?: string }>
    // ) => {
    //   const { userId, status, lastSeen } = action.payload;
    //   const user = state.onlineUsers.find((u) => u.id === userId);

    //   if (user) {
    //     user.isOnline = status;
    //     if (!status) user.lastSeen = lastSeen || null;
    //   } else {
    //     // If user is not in the list, optionally add them
    //     state.onlineUsers.push({
    //       id: userId,
    //       name: "Unknown", // You may replace with actual name if available
    //       isOnline: status,
    //       lastSeen: status ? null : lastSeen || null,
    //     });
    //   }
    // },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
        // remove duplicates
      const uniqueMessages = Array.from(new Map(action.payload.map(m => [m.id, m])).values());
      state.messages = uniqueMessages;
    },
    clearChat: (state) => {
      state.conversations = [];
      state.messages = [];
      state.selectedUser = null;
    },
  
    clearConversations: (state) => {
      state.conversations = [];
      state.error = null;
    },
     // 🚀 handle incoming socket message

messageReceived: (state, action: PayloadAction<Message>) => {
  const incoming = action.payload;

     const index = state.messages.findIndex(
        (m) =>
          m.id === incoming.id ||
          (m.message === incoming.message &&
           m.sender.id === incoming.sender.id &&
           m.receiver.id === incoming.receiver.id &&
           Math.abs(new Date(m.sent_at).getTime() - new Date(incoming.sent_at).getTime()) < 500) // Line 62: Content-based deduplication
      );

      if (index >= 0) {
        console.log("Replacing duplicate message at index:", index); // Line 66: Debug log
        state.messages[index] = incoming;
      } else {
        console.log("Adding new message:", incoming.message); // Line 69: Debug log
        state.messages.push(incoming);
      }

  // Update conversation
  const conv = state.conversations.find(
    (c) =>
      c.otherUser.id === incoming.sender.id ||
      c.otherUser.id === incoming.receiver.id
  );

  const otherUser =
    incoming.sender.id !== state.currentUserId
    //  incoming.sender.id !== state.user?.id
      ? incoming.sender
      : incoming.receiver;

  if (conv) {
    conv.lastMessage = incoming;
    if (incoming.sender.id === conv.otherUser.id) {
      conv.unreadCount += 1;
    }
  } else {
    state.conversations.push({
      otherUser,
      lastMessage: incoming,
      unreadCount: incoming.sender.id === otherUser.id ? 1 : 0,
    });
  }

  // Sort conversations by last message timestamp
  state.conversations.sort(
    (a, b) =>
      new Date(b.lastMessage?.timestamp || 0).getTime() -
      new Date(a.lastMessage?.timestamp || 0).getTime()
  );
},
removeMessage: (state, action: PayloadAction<string>) => { // Line 104: Added removeMessage reducer
     state.messages = state.messages.filter(
        (m) => m.id !== action.payload && m.tempId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
        state.loading = false;
        // Deduplicate conversations in case API still returns duplicates
        const uniqueConversations = Array.from(
          new Map(action.payload.map((c) => [c.otherUser.id, c])).values()
        );
        state.conversations = uniqueConversations;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        
        state.messages = action.payload;
        const uniqueMessages = Array.from(new Map(action.payload.map(m => [m.id, m])).values()); // Line 116: Deduplicate by id
        state.messages = uniqueMessages;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {

         const index = state.messages.findIndex(
          (m) =>
            m.id === action.payload.id ||
            (m.message === action.payload.message &&
             m.sender.id === action.payload.sender.id &&
             m.receiver.id === action.payload.receiver.id &&
             Math.abs(new Date(m.sent_at).getTime() - new Date(action.payload.sent_at).getTime()) < 500) // Line 129: Content-based deduplication
        );

        if (index >= 0) {
          console.log("Replacing duplicate message in sendMessage.fulfilled at index:", index); // Line 133: Debug log
          state.messages[index] = action.payload;
        } else {
          console.log("Adding new message in sendMessage.fulfilled:", action.payload.message); // Line 136: Debug log
          state.messages.push(action.payload);
        }
        // Update conversation
        const conv = state.conversations.find(
          (c) =>
            c.otherUser.id === action.payload.sender.id ||
            c.otherUser.id === action.payload.receiver.id
        );
        const otherUser =
          action.payload.sender.id !== state.currentUserId
            ? action.payload.sender
            : action.payload.receiver;
        if (conv) conv.lastMessage = action.payload;
        else
          state.conversations.push({
            otherUser,
            lastMessage: action.payload,
            unreadCount: 0,
          });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const otherUserId = action.meta.arg.otherUserId;
        const conv = state.conversations.find((c) => c.otherUser.id === otherUserId);
        if (conv) conv.unreadCount = 0;
        state.messages = state.messages.map((m) =>
          m.sender.id === otherUserId ? { ...m, read: true } : m
        );
      
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(fetchOnlineUsers.fulfilled, (state, action) => {
        if (!action.payload || !action.payload.users) return;

  const fetchedUsers = action.payload.users;

  // Merge with existing real-time online data
  const updatedUsers = fetchedUsers.map((user: any) => {
    const existing = state.onlineUsers.find((u) => u.id === user.id);
    return {
      ...user,
      isOnline: existing ? existing.isOnline : user.isOnline ?? false,
      lastSeen: existing && existing.isOnline
        ? null
        : user.lastSeen ?? new Date().toISOString(),
    };
  });

  // Also preserve users who were marked online via socket but not in fetch result
    const extraOnline = state.onlineUsers.filter(
      (u) => u.isOnline && !updatedUsers.some((fu:any) => fu.id === u.id)
     );

      state.onlineUsers = [...updatedUsers, ...extraOnline];
     })
     .addCase(clearChatHistory.fulfilled, (state,action) => {
        state.loading = false;
    
        state.messages = [];
       
   
      })
      .addCase(blockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
         state.blockedUsers.push(action.meta.arg.userId);
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 🔓 Unblock user
      .addCase(unblockUser.pending, (state) => {
       state.loading = true;
      state.error = null;
        })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false;
        state.blockedUsers = state.blockedUsers.filter(
        (id) => id !== action.meta.arg.userId
      );
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 🧨 DELETE MESSAGE
.addCase(deleteMessage.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteMessage.fulfilled, (state, action) => {
  state.loading = false;
  // remove the message from message list
  state.messages = state.messages.filter((msg) => msg.id !== action.payload);
})
.addCase(deleteMessage.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});

  },
});

export const { clearConversations, setSelectedUser,setMessages,updateOnlineStatus,setCurrentUserId,
  clearChat,setUserOnline,removeMessage ,setConversations,messageReceived} = chatSlice.actions;
export default chatSlice.reducer;

