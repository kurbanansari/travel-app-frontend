"use client"// tripSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMyTrips , fetchTripById , startTrip, stopTrip } from "@/redux/thunk/tripsThunk";
import { fetchProfile } from "@/redux/thunk/userThunk";

// tripSlice.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface Trip {
  id: string;
  title: string;
  description: string;
  status: string;
  isDraft: boolean;
  coverPhoto: string | null;
  country: string;
  createdAt: string;
   start_date?: string;
  end_date?: string;
  photos: {
    url: string;
    locations: {
      country: string;
    };
  }[];
}

interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  offset: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


type TripState = {
list: Trip[];
  pagination: Pagination | null;
   fetchedPages: number[];  
  loading: boolean;
  error: string | null;
  currentTrip: Trip | null;
  user: User | null;
};

const initialState: TripState = {
list: [],
  pagination: null,
  fetchedPages: [], 
  loading: false,
  error: null,
   currentTrip: null,
    user: null,
};

const tripSlice = createSlice({
  name: "trips",
   
  initialState,
  reducers: {
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },

    updateTripCover: (state, action) => {
      const { tripId, coverUrl } = action.payload;
      const index = state.list.findIndex((t) => t.id === tripId);
      if (index !== -1) {
        state.list[index].coverPhoto = coverUrl;
      }
      if (state.currentTrip && state.currentTrip.id === tripId) {
        state.currentTrip.coverPhoto = coverUrl;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // all trips
      .addCase(fetchMyTrips.pending, (state,action) => {
    const { page } = action.meta.arg;

        // ✅ skip loading if page already fetched
        if (state.fetchedPages.includes(page)) {
          state.loading = false;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchMyTrips.fulfilled, (state, action) => {
      state.loading = false;
  const { trips, pagination } = action.payload;
  const currentPage = action.meta.arg.page;

  if (currentPage > 1) {
    state.list = [...state.list, ...trips].filter(
      (t, i, arr) => arr.findIndex(x => x.id === t.id) === i
    ); // append
  } else {
    state.list = trips; // replace
  }

  state.pagination = pagination;
  state.fetchedPages.push(currentPage);
      })
      .addCase(fetchMyTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // single trip
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentTrip = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentTrip = null;
      })

      // startTrip
      .addCase(startTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTrip.fulfilled, (state, action: PayloadAction<Trip>)  => {
        state.loading = false;
        // push the new trip into trips array
        state.list.unshift(action.payload);
        state.currentTrip = action.payload;
      })
      .addCase(startTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  .addCase(stopTrip.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(stopTrip.fulfilled, (state, action) => {
  state.loading = false;
  const { tripId } = action.payload;
  // Update trip status in trips array
  const index = state.list.findIndex((t) => t.id === tripId);
  if (index !== -1) {
    state.list[index].status = "completed";
  }
})
.addCase(stopTrip.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});

  },
});

export const { clearCurrentTrip, updateTripCover } = tripSlice.actions;
export default tripSlice.reducer;
