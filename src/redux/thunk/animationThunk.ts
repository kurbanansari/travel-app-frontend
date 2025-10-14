// redux/animationThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createAnimation = createAsyncThunk(
  "animation/create",
  async (
    {
      tripId,
      title,
      styleId,
      musicId,
      photoIds,
    }: {
      tripId: string;
      title: string;
      styleId: string;
      musicId: string;
      photoIds: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token"); // 👈 get token
      if (!token) throw new Error("No auth token found");

      const res = await fetch("http://localhost:8080/animations", {
        method: "POST",
        headers: {
          "accept": "application/json", // 👈 required by curl
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 add token here
        },
        body: JSON.stringify({
          trip_id: tripId,
          animation_style_id: styleId, // 👈 match curl key
          music_track_id: musicId,     // 👈 match curl key
          title,
          photo_ids: photoIds,
        }),
      });
      console.log(res)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return rejectWithValue(errorData.message || "Failed to create animation");
      }
     const data = await res.json();
      return { animationId: data.data.animationId, message: data.message };
      // return await res.json(); // expected: { message, animationId }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


// export const createAnimation = createAsyncThunk(
//   "animation/create",
//   async (
//     {
//       tripId,
//       title,
//       styleId,
//       musicId,
//       photoIds,
//     }: {
//       tripId: string;
//       title: string;
//       styleId: string;
//       musicId: string;
//       photoIds: string[];
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("token"); // 👈 get token
//       if (!token) throw new Error("No auth token found");

//       const res = await fetch("http://localhost:8080/animations/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // 👈 add token here
//         },
//         body: JSON.stringify({
//           trip_id: tripId,
//           title,
//           style_id: styleId,
//           music_id: musicId,
//           photo_ids: photoIds,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         return rejectWithValue(errorData.message || "Failed to create animation");
//       }

//       return await res.json(); // { message, animationId }
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// animation style
export const animationStyles = createAsyncThunk(
  "animations/fetchStyles",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await fetch("http://localhost:8080/animations/styles", {
        method: "GET",
        headers: {
           Accept: "application/json",
          Authorization: `Bearer ${token}`, // ✅ JWT required
        },
      });
      console.log(res)

      if (!res.ok) {
        throw new Error(`Failed to fetch styles: ${res.status}`);
      }

      const data = await res.json();
      return data; // expected: [{ id, name, description, thumbnail_url }]
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

//aniamtion music
export const animationMusic = createAsyncThunk(
  "animations/fetchMusic",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await fetch("http://localhost:8080/animations/music", {
        method: "GET",
        headers: {
           Accept: "application/json",
          Authorization: `Bearer ${token}`, // ✅ add JWT
        },
      });
      console.log(res)

      if (!res.ok) {
        throw new Error(`Failed to fetch music: ${res.status}`);
      }

      const data = await res.json();
      return data; // expected: [{ id, name, description, thumbnail_url }]
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



export const animationStatus = createAsyncThunk(
  "animation/fetchStatus",
  async (animationId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const res = await fetch(`http://localhost:8080/animations/${animationId}/status`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
       const data = await res.json();
      console.log("🟡 Animation Status Response:", data);

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Failed to fetch animation status");
      }

      return data // expected: { status: "pending" | "ready", videoUrl? }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const publishAnimation = createAsyncThunk(
  "animation/publish",
  async (
    { animationId, caption ,status}: { animationId: string; caption: string ;status: "PUBLISHED" | "DRAFT"},
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const res = await fetch(
        `http://localhost:8080/animations/${animationId}/status`,
        {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ must include token
          },
          body: JSON.stringify({
            caption,
            status
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return rejectWithValue(errorData.message || "Failed to publish animation");
      }

      return await res.json(); // { success, data }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



