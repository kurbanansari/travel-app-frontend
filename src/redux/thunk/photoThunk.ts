
"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateTripCover } from "@/redux/slices/tripSlice";

export const uploadPhoto = createAsyncThunk(
  "photos/upload",
  async (
    {
      tripId,
      file,
      caption,
      taken_at,
      lat,
      lng,
    }: {
      tripId: string;
      file: File;
      caption?: string;
      taken_at?: string;
      lat?: number;
      lng?: number;
    },
    { dispatch, rejectWithValue } // ✅ get dispatch here from thunkAPI
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
       // ✅ Validate tripId
      if (!tripId) throw new Error("Trip ID is required");

      const formData = new FormData();
      formData.append("photo", file);
      formData.append("trip_id", tripId);
      formData.append("caption", caption || "");
      formData.append("taken_at", taken_at || new Date().toISOString());
      formData.append("lat", String(lat || 0));
      formData.append("lng", String(lng || 0));

      const res = await fetch("http://localhost:8080/photos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to upload photo");
      }

     

      // ✅ Dispatch to update trip cover in state
     const url = data.data?.url;
      if (url) {
        dispatch(updateTripCover({ tripId, coverUrl: data.url }));
         
      }

      // ✅ Refresh photos for the trip
      dispatch(fetchTripPhotos(tripId));
    
     return data || data; // ✅ normalize return

     
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchTripPhotos = createAsyncThunk(
  "photos/fetchByTrip",
  async (tripId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:8080/photos/trip/${tripId}?page=1&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   console.log(res)
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch photos");
      }

      const data = await res.json();

      // Normalize response: return array of photos
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch photos");
      }

      return data.data || []; // data.data contains array of photos
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



export const deletePhoto = createAsyncThunk(
  "photos/deletePhoto",
  async (photoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // replace with your auth method
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:8080/photos/${photoId}`, {
         method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      console.log(res)
       const data = await res.json();
       if (!res.ok) {
        return rejectWithValue(data); // handle error from server
      }
      return data.data; // return deleted photo data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);





// export const uploadBulkPhotos = createAsyncThunk(

//   "photos/uploadBulk",
//   async (
//     {
//       tripId,
//       files,
//       metadata,
//     }: { tripId: string; files: File[]; metadata: any[] },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");

//       const formData = new FormData();
//       formData.append("trip_id", tripId);

//       // append files
//       files.forEach((file) => {
//         formData.append("photos", file);
//       });

//       // append metadata array
//       formData.append("metadata", JSON.stringify(metadata));

//       const res = await fetch("http://localhost:8080/photos/bulk", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // 👈 pass token
//         },
//         body: formData,
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || "Upload failed");
//       }

//       return await res.json();
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );




