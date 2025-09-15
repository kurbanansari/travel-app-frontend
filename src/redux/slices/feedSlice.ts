// src/redux/slices/feedSlice.ts
"use client";

import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { fetchFeed, toggleLike, sharePost,fetchComments,postComment, followUserProfile, unfollowUserProfile } from "@/redux/thunk/feedThunk";

//
// --- Types ---
export type User = {
  id: string;
  name: string;
  profilePic: string | null;
  isFollowing?: boolean;
};

export type AnimationFeed = {
  type: "ANIMATION";
  id: string;
  title: string;
  video_url: string;
  user: User;
  likesCount: number;
  shareCount: number;
  commentsCount: number;
  isLiked: boolean;
  isShare?: string[];
  likeId?: string | null;
};

export type PhotoFeed = {
  type: "PHOTO";
  id: string;
  url: string;
  caption: string;
  user: User;
  likesCount: number;
  shareCount: number;
  commentsCount: number;
  isLiked: boolean;
  isShare?: string[];
  likeId?: string | null;
};

export type FeedItem = AnimationFeed | PhotoFeed;

export type Comment = {
  id: string;
  text: string;
  user: User;
  created_at: string;
};

//
// --- State ---
interface FeedState {
  items: FeedItem[];
  comments: { [feedId: string]: Comment[] }; // store comments by post ID
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  } | null;
 
}

const initialState: FeedState = {
  items: [],
  comments: {},
  loading: false,
  error: null,
  pagination: null,
  
};

//
// --- Slice ---
const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    updateFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    resetFeed: (state) => {
      state.items = [];
      state.pagination = null;
    },
    setComments: (state, action: PayloadAction<{ feedId: string; comments: Comment[] }>) => {
      state.comments[action.payload.feedId] = action.payload.comments;
    },
    addComment: (state, action: PayloadAction<{ feedId: string; comment: Comment }>) => {
      if (!state.comments[action.payload.feedId]) {
        state.comments[action.payload.feedId] = [];
      }
      state.comments[action.payload.feedId].push(action.payload.comment);
    
   
    },
  },
  extraReducers: (builder) => {
    // ✅ Fetch Feed
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchFeed.fulfilled, (state, action: any) => {
        state.loading = false;

        if (action.payload.page === 1) {
          // First page → replace items
          state.items = action.payload.items;
        } else {
          // Subsequent pages → append items
          state.items.push(...action.payload.items);
        }

        state.pagination = action.payload.pagination;
        
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ Likes, Follow, Share
    builder
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.items = state.items.map((i) => (i.id === action.payload.id ? action.payload : i));
      })
      // .addCase(followUser.fulfilled, (state, action) => {
      //   state.items = state.items.map((i) => (i.id === action.payload.id ? action.payload : i));
      // })
      // .addCase(unfollowUser.fulfilled, (state, action) => {
      //   state.items = state.items.map((i) => (i.id === action.payload.id ? action.payload : i));
      // })
//       .addCase(followUserProfile.fulfilled, (state, action) => {
//   state.items = state.items.map((item) =>
//     item.user.id === action.payload.id
//       ? { ...item, user: { ...item.user, isFollowing: true } }
//       : item
//   );
// })
//   .addCase(unfollowUserProfile.fulfilled, (state, action) => {
//   state.items = state.items.map((item) =>
//     item.user.id === action.payload.id
//       ? { ...item, user: { ...item.user, isFollowing: false } }
//       : item
//   );
//   })
// In feedSlice.ts extraReducers
builder.addCase(followUserProfile.fulfilled, (state, action) => {
  const userId = action.payload.id;
  state.items = state.items.map((item) =>
    item.user.id === userId ? { ...item, user: { ...item.user, isFollowing: true } } : item
  );
});

builder.addCase(unfollowUserProfile.fulfilled, (state, action) => {
  const userId = action.payload.id;
  state.items = state.items.map((item) =>
    item.user.id === userId ? { ...item, user: { ...item.user, isFollowing: false } } : item
  );
})

      .addCase(sharePost.fulfilled, (state, action) => {
        state.items = state.items.map((i) => (i.id === action.payload.id ? action.payload : i));
      })
      // Fetch Comments
  .addCase(fetchComments.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchComments.fulfilled, (state, action) => {
    state.loading = false;
    state.comments[action.payload.feedId] = action.payload.comments;
  })
  .addCase(fetchComments.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })

  // Post Comment
  .addCase(postComment.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(postComment.fulfilled, (state, action) => {
    state.loading = false;

    // Add comment to feed comments map
    if (!state.comments[action.payload.feedId]) {
      state.comments[action.payload.feedId] = [];
    }
    state.comments[action.payload.feedId].unshift(action.payload.comment);

    // Increment comment count in feed item
    state.items = state.items.map((i) =>
      i.id === action.payload.feedId ? { ...i, commentsCount: (i.commentsCount || 0) + 1 } : i
    );
  })
  .addCase(postComment.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
  },
});

export const {resetFeed, setComments, addComment, updateFeedItem } = feedSlice.actions;
export default feedSlice.reducer;


// --- Selectors ---
import type { RootState } from "@/redux/store";
// import { createSelector } from "@reduxjs/toolkit";

const selectCommentsState = (state: RootState) => state.feed.comments;


// ✅ Memoized selector
export const makeSelectCommentsById = (feedId: string) =>
  createSelector([selectCommentsState], (comments) => comments[feedId] ?? []);
