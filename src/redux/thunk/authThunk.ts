"use client"// src/redux/thunks/authThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {isValidPhone} from '@/lib/utils'
import toast from "react-hot-toast";
import { RootState } from "../store";

const API_URL = "http://localhost:8080";

export const requestOtp = createAsyncThunk(
  "auth/request-otp",
  async (phone: string, { rejectWithValue }) => {
    try {
         // ✅ validate before API call
      if (!isValidPhone(phone)) {
        return rejectWithValue("Invalid phone number. Please enter a 10-digit number starting with 6-9.");
      }
      const res = await axios.post(`${API_URL}/auth/request-otp`, { phone });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to request OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verify-otp",
  async ({ phone, otp }: { phone: string; otp: string }, { rejectWithValue,getState }) => {
    try {
       const state = getState() as RootState;
      // ✅ If user already exists in state, skip API call
      if (state.auth.user?.id) {
        return state.auth.user;
      }
  

         // ✅ validate phone again (extra safety)
      if (!isValidPhone(phone)) {
        return rejectWithValue("Invalid phone number.");
      }

      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });

      // Save token & user in localStorage
      if (res.data?.data?.token) {
        localStorage.setItem("token", res.data?.data.token);
        localStorage.setItem("userId", res.data?.data.user?.id);
        localStorage.setItem("user", JSON.stringify(res.data?.data.user));
      }
      
      console.log(res);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to verify OTP");
    }
  }
);
// ✅ Login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = res.data;

      // save token in localStorage
      localStorage.setItem("token", token);

      return {user, token};
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);
// // ✅ Fetch profile
// export const fetchProfile = createAsyncThunk(
//   "user/fetchProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//        const token = localStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/users/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }); 
//       console.log(res);
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data || "Failed to load profile");
//     }
//   }
// );
