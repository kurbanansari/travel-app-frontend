// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { requestOtp, verifyOtp } from "../thunk/authThunk";

interface AuthState {
  loading: boolean;
  message: string | null;
  error: string | null;
  token: string | null;
    isAuthenticated: boolean;
  user: any | null;
  step: "phone" | "otp";
  phone: string;
  otp: string;
}

const initialState: AuthState = {
  loading: false,
  message: null,
  error: null,
   isAuthenticated: false,
  token: null,
  user: null,
  step: "phone",
  phone: "",
  otp: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
       state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.step = "phone";
      state.phone = "";
      state.otp = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // requestOtp
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "OTP sent";
        state.step = "otp";
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.message = "Login successful!";
         state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPhone, setOtp, logout } = authSlice.actions;
export default authSlice.reducer;
