"use client"
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ✅ Login user
// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (credentials: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/auth/login", credentials);
//       const { token, user } = res.data;

//       // save token in localStorage
//       localStorage.setItem("token", token);

//       return {user, token};
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data || "Login failed");
//     }
//   }
// );

// ✅ Fetch profile
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
       const token = localStorage.getItem("token");

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      console.log(res);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to load profile");
    }
  }
);

// ✅ Fetch another user's profile
export const fetchUserProfileById = createAsyncThunk(
  "profile/fetchUserProfileById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No token found");

      const res = await api.get(`/feed/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// // ✅ Update profile
// export const updateProfile = createAsyncThunk(
//   "user/updateProfile",
//   async (payload: { name: string; bio: string }, { rejectWithValue }) => {
//     try {
//       const res = await api.put("/users/update", payload);
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data || "Profile update failed");
//     }
//   }
// );


export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const res = await api.patch("/users/me", profileData, {
     
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     console.log(res)
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);
