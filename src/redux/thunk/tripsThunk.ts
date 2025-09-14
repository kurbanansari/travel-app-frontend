"use client"
// tripThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store"; // adjust path if needed
import {fetchProfile} from "@/redux/thunk/userThunk"
import api from "../services/api"; // 👈 axios instance
// export const fetchTrips = createAsyncThunk(
//   "trips/fetchTrips",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("No token found");
//       }

//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       };

//       // ✅ fetch trips + user in parallel
//       const [tripsRes, userRes] = await Promise.all([
//         fetch("http://localhost:8080/trips/my", { method: "GET", headers }),
//         fetch("http://localhost:8080/users/me", { method: "GET", headers }),
//       ]);

//       if (!tripsRes.ok) throw new Error("Failed to fetch trips");
//       if (!userRes.ok) throw new Error("Failed to fetch user");

//       const trips = await tripsRes.json();
//       const user = await userRes.json();
//       console.log(trips);
//       return { trips, user };
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );


// redux/thunk/tripsThunk.ts


// tripsThunk.ts
export const fetchMyTrips = createAsyncThunk(
  "trips/fetchMyTrips",
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
       const token = localStorage.getItem("token");
       const res = await fetch(`http://localhost:8080/trips/my?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)

      const data = await res.json();

      return {
        trips: data.data || [],        // ✅ only the array
        pagination: data.pagination,  // ✅ pagination object
        page,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch trips");
    }
  }
);



// interface FetchTripsArgs {
//   page: number;
//   limit: number;
// }

// export const fetchMyTrips = createAsyncThunk<
//   { trips: any[]; pagination: any }, // return type
//   FetchTripsArgs                       // arg type ✅ page and limit are required
// >(
//   "trips/fetchMyTrips",
//   async ({ page, limit }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`http://localhost:8080/trips/my?page=${page}&limit=${limit}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(res)

//       if (!res.ok) throw new Error("Failed to fetch trips");

//       const data = await res.json();

//       return {
//         trips: data.data || [],
//         pagination: data.pagination,
//       };
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );



// ✅ Fetch trips of logged-in user
// export const fetchMyTrips = createAsyncThunk(
//   "trips/fetchMyTrips",
//   async (
//     { page = 1, limit = 20 }: { page?: number; limit?: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         return rejectWithValue("No token found");
//       }

//       const res = await api.get(`/trips/my?page=${page}&limit=${limit}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(res)

//       return {
//         trips: res.data.data,
//         pagination: res.data.pagination,
//       };
//     } catch (err: any) {
//       if (err.response && err.response.data) {
//         return rejectWithValue(err.response.data.message);
//       }
//       return rejectWithValue(err.message);
//     }
//   }
// );




// fetch single trip by ID
export const fetchTripById = createAsyncThunk(
  "trips/fetchTripById",
  async (tripId: string, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // 👈 read from localStorage

      if (!token) {
        throw new Error("No token found");
      }
   
     

      const res = await fetch(`http://localhost:8080/trips/${tripId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
       const data = await res.json();
     console.log(res)
    if (!res.ok) {
        // ✅ Forward backend error message
        return rejectWithValue(data?.message || "Failed to fetch trip details");
      }

      return data.data; // ✅ API returns { success, message, data, ... }
    } catch (err: any) {
      return rejectWithValue(err.message || "Unexpected error");
    }
  }
);


export const startTrip = createAsyncThunk(
  "trips/startTrip",
  async  ({ name, description,isDraft = false,}: { name: string; description?: string ,isDraft?: boolean }, { getState, rejectWithValue }) => {
    try {
       const token = localStorage.getItem("token"); // 👈 read from localStorage

      if (!token) {
        throw new Error("No token found");
      }
     
      

      const res = await fetch("http://localhost:8080/trips/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`, // ✅ use token
        },
        credentials: "include",
        
        body: JSON.stringify({ name, description ,isDraft}), // ✅ API expects { "name": "string" }
      });
 const data = await res.json();

      if (!res.ok) {
        // ✅ handle token expired or validation error
        if (data?.error?.code === "TOKEN_EXPIRED") {
          return rejectWithValue("Session expired. Please login again.");
        }
        return rejectWithValue(data.message || "Failed to start trip");
      }

      return data.data; // ✅ return only the trip object
    } catch (err: any) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);


// export const startTrip = createAsyncThunk(
//   "trips/startTrip",
//   async (
//     { title, description }: { title?: string; description?: string },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("No token found");
//       }

//       const res = await fetch("http://localhost:8080/trips/start", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "*/*",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ title, description }), // ✅ must be "title"
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to start trip");
//       }

//       return await res.json(); // returns the created trip
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );


// Stop an active trip
export const stopTrip = createAsyncThunk(
  "trips/stopTrip",
  async (tripId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:8080/trips/${tripId}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "*/*",
        },
       
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to stop trip");
      }

      return { tripId, message: data.message };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);




