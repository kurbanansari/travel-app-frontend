"use client"// src/redux/thunks/authThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {isValidPhone} from '@/lib/utils'
import toast from "react-hot-toast";

const API_URL = "http://localhost:8080/auth";

export const requestOtp = createAsyncThunk(
  "auth/request-otp",
  async (phone: string, { rejectWithValue }) => {
    try {
         // ✅ validate before API call
      if (!isValidPhone(phone)) {
        return rejectWithValue("Invalid phone number. Please enter a 10-digit number starting with 6-9.");
      }
      const res = await axios.post(`${API_URL}/request-otp`, { phone });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to request OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verify-otp",
  async ({ phone, otp }: { phone: string; otp: string }, { rejectWithValue }) => {
    try {
         // ✅ validate phone again (extra safety)
      if (!isValidPhone(phone)) {
        return rejectWithValue("Invalid phone number.");
      }

      const res = await axios.post(`${API_URL}/verify-otp`, { phone, otp });

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
