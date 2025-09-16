// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, requestOtp, verifyOtp } from "../thunk/authThunk";

const tokenFromStorage =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const userFromStorage =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;


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
  token: tokenFromStorage,
  user: userFromStorage,
  isAuthenticated: !!tokenFromStorage,
  //  isAuthenticated: false,
  // token: null,
  // user: null,
  // token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  // isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  // user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
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
      localStorage.removeItem("user");
       state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.step = "phone";
      state.phone = "";
      state.otp = "";
    },
    //  checkAuth: (state) => {
    //   const token = localStorage.getItem("token");
    //   const user = localStorage.getItem("user");
    //   state.isAuthenticated = !!token;
    //   state.token = token;
    //   state.user = user ? JSON.parse(user) : null;
    // },
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
      })
      builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
      
  },
});

export const { setPhone, setOtp, logout } = authSlice.actions;
export default authSlice.reducer;
