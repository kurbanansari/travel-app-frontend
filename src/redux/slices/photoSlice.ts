"use client"

import { createSlice ,PayloadAction} from "@reduxjs/toolkit";
import {  deletePhoto, fetchTripPhotos, uploadPhoto} from "@/redux/thunk/photoThunk";
import toast from "react-hot-toast";


export interface Photo {
  id: string;
  trip_id: string;
  user_id: string;
  url: string;
  caption?: string;
  taken_at?: string;
  lat?: number;
  lng?: number;
  location_id?: string;
  created_at?: string;
  updated_at?: string | null;
  created_by?: string;
  updated_by?: string | null;
  locations?: {
    country?: string;
    state?: string;
    city?: string;
    area?: string;
  };
}

interface PhotoState {
  loading: boolean;
  error: string | null;
  photos: any[];
  
}

const initialState: PhotoState = {
  loading: false,
  error: null,
  photos: [],

};

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.photos = action.payload;
    },
     clearPhotos(state) {
      state.photos = [];
      state.error = null;
      state.loading = false;
     }
  },

  extraReducers: (builder) => {
    builder
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
        state.error = null; // reset error on new upload
      })
      .addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.loading = false;
        state.photos.push(action.payload);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Something went wrong while uploading photo.";
      });
       // 📸 Fetch Photos
    builder.addCase(fetchTripPhotos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTripPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
      state.loading = false;
      state.photos = action.payload;
    });
    builder.addCase(fetchTripPhotos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || action.error.message || "Failed to fetch photos.";;
    })
    .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        // state.photos = state.photos.filter((p) => p.id !== action.payload.id);
          const deletedId = action.payload?.id; // ✅ directly from payload
  if (deletedId) {
    state.photos = state.photos.filter((p) => p.id !== deletedId);
  }
         toast.success("Photo deleted successfully");
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        // ✅ Safely handle payload type
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
        ) {
          state.error = (action.payload as any).message;
        } else {
          state.error = "Failed to delete photo";
        }
        toast.error("Failed to delete photo");
      });

    //   .addCase(uploadBulkPhotos.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(uploadBulkPhotos.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.photos.push(...action.payload.photos || []);
    //   })
    //   .addCase(uploadBulkPhotos.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
});
export const { setPhotos,clearPhotos } = photoSlice.actions;
export default photoSlice.reducer;
