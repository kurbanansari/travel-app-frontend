
"use client"
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // adjust path to your slice
import  authReducer from './slices/authSlice';
import tripsReducer from './slices/tripSlice';
import photoReducer from './slices/photoSlice';
import animationReducer from './slices/animationSlice'
import feedReducer from './slices/feedSlice';
import searchReducer from "./slices/searchSlice";
import chatReducer from './slices/chatSlice'



// Create store
export const store = configureStore({
  reducer: {
    user: userReducer, // you can add more slices here
     auth: authReducer,
     trips:tripsReducer,
     photos: photoReducer,
      animation: animationReducer,
      feed :feedReducer,
      search:searchReducer,
     chat:chatReducer
     
  },
});


// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
