"use client"

// src/redux/thunk/chatThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/redux/services/api";

import { messageReceived } from "../slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";



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
   timestamp: string;
  read?: boolean;
}

interface Conversation {
  otherUser: User;
  lastMessage: Message | null;
  unreadCount: number;
}

export const fetchConversations = createAsyncThunk<
  Conversation[],
  { page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "chat/fetchConversations",
  async ({ page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const response = await api.get(`/chat/conversations?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetchConversations response:", response.data);

      // Deduplicate conversations by otherUser.id
      const conversations = response.data.data;
      const uniqueConversations = Array.from(
        new Map(conversations.map((c: Conversation) => [c.otherUser.id, c])).values()
      );

      return uniqueConversations as Conversation[];
    } catch (err: any) {
      console.error("fetchConversations error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

export const fetchConversation = createAsyncThunk<
  Message[],
  { otherUserId: string; page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "chat/fetchConversation",
  async ({ otherUserId, page = 1, limit = 20 }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      const response = await api.get(`/chat/conversation/${otherUserId}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetchConversation response:", response.data);
      return response.data.data || [];
    } catch (err: any) {
      console.error("fetchConversation error:", err);
      if (err.response?.status === 404) {
        return [];
      }
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversation");
    }
  }
);

export const sendMessage = createAsyncThunk<
  Message,
  { toUserId: string; message: string },
  { state: RootState; rejectValue: string }
>(
  "chat/sendMessage",
  async ({ toUserId, message}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please log in.");
      const res = await api.post(
        `/chat/send`,
        { toUserId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      //  dispatch(messageReceived(res.data.data));
     console.log("sendMessage response:", { data: res.data }); // Line 13: Debug log
      console.log("sendMessage - sender id:", res.data.data.sender.id);
      return res.data.data;
    } catch (err: any) {
      console.error("sendMessage error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

export const markMessagesAsRead = createAsyncThunk<
  void,
  { otherUserId: string },
  { state: RootState; rejectValue: string }
>(
  "chat/markMessagesAsRead",
  async ({ otherUserId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }

      await api.put(
        `/chat/conversation/${otherUserId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Messages marked as read for user ${otherUserId}`);
    } catch (err: any) {
      console.error("markMessagesAsRead error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to mark messages as read");
    }
  }
);


export const fetchOnlineUsers = createAsyncThunk(
  "chat/fetchOnlineUsers",
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }, { getState, rejectWithValue }) => {
    try {
      // Get token from Redux state
      const state: any = getState();
       const token = state.auth.token || localStorage.getItem("token");

      if (!token) return rejectWithValue("No auth token found");

      const response = await api.get(`/chat/online-users?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clear all chat history
// export const clearChatHistory = createAsyncThunk(
//   "chat/clearHistory",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token"); // if you need auth
//       const response = await api.delete(`/chat/clear-history`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           data: {
//             confirmation: "DELETE_ALL_MESSAGES",
//           },
//         }
//       );
//       return response.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

export const clearChatHistory = createAsyncThunk(
  "chat/clearChatHistory",
  async ({ otherUserId }: { otherUserId: string }, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const response = await fetch("http://localhost:8080/chat/clear-history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          confirmation: "DELETE_ALL_MESSAGES",
          otherUserId, // ✅ Send this
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to clear chat history");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const blockUser = createAsyncThunk(
  "chat/blockUser",
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing auth token");

      const response = await api.post(`/chat/block/${userId}`,{}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  console.log(response)
      return response.data.data; // blockedUserId, blockedAt
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const unblockUser = createAsyncThunk(
  "chat/unblockUser",
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing auth token");

      const response = await api.delete(`/chat/block/${userId}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
  console.log(response)
      return response.data.data; // blockedUserId, blockedAt
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🧨 DELETE MESSAGE
export const deleteMessage = createAsyncThunk<
  string, // ✅ return deleted messageId
  { messageId: string },
  { rejectValue: string }
>(
  "chat/deleteMessage",
  async ({ messageId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing auth token");

      const response = await api.delete(`/chat/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete message");
      }

      console.log("✅ Message deleted:", messageId);
      return messageId; // return the deleted message id
    } catch (error: any) {
      console.error("❌ deleteMessage error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




