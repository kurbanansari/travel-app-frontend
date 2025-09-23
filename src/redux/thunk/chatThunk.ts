"use client"

// src/redux/thunk/chatThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/redux/services/api";
import { RootState } from "../store";

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
  async ({ toUserId, message }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please log in.");
      const res = await api.post(
        `/chat/send`,
        { toUserId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("sendMessage response:", res.data);
      console.log("sendMessage - sender id:", res.data.data.sender.id); // Debug
      return res.data.data;
    } catch (err: any) {
      console.error("sendMessage error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);
