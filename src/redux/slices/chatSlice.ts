"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchConversation, fetchConversations, markMessagesAsRead, sendMessage } from "../thunk/chatThunk";

interface User {
  id: string;
  name: string;
  profile_pic_url: string | null;
  online?: boolean;
}

interface Message {
  id: string;
  message: string;
  sent_at: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  otherUser: User;
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  selectedUser: User | null;
  // selectedUser: Partial<UserListItem> | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
      console.log("chatSlice - setSelectedUser:", action.payload); // Debug
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
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.messages.push(action.payload);
        const existingConversation = state.conversations.find(
          (c) => c.otherUser.id === action.payload.receiver.id
        );
        if (existingConversation) {
          existingConversation.lastMessage = action.payload;
          existingConversation.unreadCount = 0;
        } else if (state.selectedUser) {
          state.conversations.push({
            otherUser: state.selectedUser,
            lastMessage: action.payload,
            unreadCount: 0,
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Update unreadCount for the conversation
        const otherUserId = action.meta.arg.otherUserId;
        const conversation = state.conversations.find((c) => c.otherUser.id === otherUserId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearConversations, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
