"use client"
import { createSlice , PayloadAction  } from "@reduxjs/toolkit";
import{  updateUserProfile, fetchUserProfileById, fetchProfile, uploadProfilePicture } from "../thunk/userThunk";
import { followUserProfile, unfollowUserProfile } from "../thunk/feedThunk";
// ✅ Types
export type HomeLocation = {
  id: string;
  continent: string;
  country: string;
  state: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
};

export type Photo = {
  id: string;
  url: string;
};

export type Profile = {
  id: string;
  name: string;
  profilePic: string;
  bio: string;
  email: string;
  homeLocation: HomeLocation;
  posts: number;
  followers: number;
  following: number;
  totalDistanceKm: number;
  daysSpentTraveling: number;
  photos: Photo[];
  isFollowing?: boolean;
};


interface UserState {
  user: Profile | null;      // logged-in user
  profile: Profile | null;   // another user's profile 
  // users: Record<string, Profile>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token : string | null;
}

const initialState: UserState = {
   user: null,
  profile: null,
  // users: {},
  loading: false,
  error: null,
  isAuthenticated: false,
  token:null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
    },
     setUser: (state, action: PayloadAction<{ user: Profile; token: string }>) => {
      state.user = action.payload.user;
      // state.users[action.payload.user.id] = action.payload.user; 
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      // state.users = {};
      state.token = null;
      state.isAuthenticated = false;
    },
  //   cacheUsers: (state, action: PayloadAction<Profile[]>) => {
  //     action.payload.forEach((u) => {
  //       state.users[u.id] = u;
  //     });
  // },
  //  updateUserInCache: (state, action: PayloadAction<Profile>) => {
  //     state.users[action.payload.id] = {
  //       ...state.users[action.payload.id],
  //       ...action.payload,
  //     };
  //     if (state.user?.id === action.payload.id) state.user = { ...state.user, ...action.payload };
  //     if (state.profile?.id === action.payload.id) state.profile = { ...state.profile, ...action.payload };
  //   },
  },
  extraReducers: (builder) => {
    // ✅ Login
    // builder.addCase(loginUser.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(loginUser.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   state.isAuthenticated = true;
    // });
    // builder.addCase(loginUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });

    // ✅ Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
    state.loading = false;
  if (action.payload) {
    state.user = action.payload;
    state.profile = action.payload;
    //  state.users[action.payload.id] = action.payload; // ✅ cache
  }
    // state.user = action.payload;
    //   state.profile = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
     builder.addCase(fetchUserProfileById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfileById.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.loading = false;
      state.profile = action.payload;
      //  state.users[action.payload.id] = action.payload; // ✅ cache
    });
    builder.addCase(fetchUserProfileById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(followUserProfile.fulfilled, (state, action) => {
  if (state.profile && state.profile.id === action.payload.id) {
    state.profile.isFollowing = true;
  }
  //  if (state.profile?.id === action.payload.id) {
  //         state.profile.isFollowing = true;
  //       }
  //       if (state.users[action.payload.id]) {
  //         state.users[action.payload.id] = {
  //           ...state.users[action.payload.id],
  //           isFollowing: true,
  //         };
  //       }
})  
.addCase(unfollowUserProfile.fulfilled, (state, action) => {
  if (state.profile && state.profile.id === action.payload.id) {
    state.profile.isFollowing = false;
  }
  //  if (state.profile?.id === action.payload.id) {
  //         state.profile.isFollowing = false;
  //       }
  //       if (state.users[action.payload.id]) {
  //         state.users[action.payload.id] = {
  //           ...state.users[action.payload.id],
  //           isFollowing: false,
  //         };
  //       }
});
    // ✅ Update Profile
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload };
    })
    // if (state.user?.id === action.payload.id) {
    //       state.user = { ...state.user, ...action.payload };
    //     }
    //     state.users[action.payload.id] = {
    //       ...state.users[action.payload.id],
    //       ...action.payload,
    //     };
    //   })
      // ✅ Upload profile picture
    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.loading = false;
      // backend usually returns updated user object
     state.user = { ...state.user, ...action.payload }; // expects user fields
  if (state.user?.id === state.profile?.id) {
    state.profile = state.user;
  }
  // if (state.user?.id === action.payload.id) {
  //         state.user = { ...state.user, ...action.payload };
  //       }
  //       if (state.profile?.id === action.payload.id) {
  //         state.profile = { ...state.profile, ...action.payload };
  //       }
  //       state.users[action.payload.id] = {
  //         ...state.users[action.payload.id],
  //         ...action.payload,
  //       };
    });
    builder.addCase(uploadProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout ,setUser , clearUser } = userSlice.actions;
export default userSlice.reducer;
