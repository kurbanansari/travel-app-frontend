// redux/thunks/feedThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../services/api";
import { RootState } from "../store";

export const fetchFeed = createAsyncThunk(
  "feed/fetchFeed",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue,getState}
  ) => {
    try {
       const state = getState() as RootState;

      // ✅ If we already have data for this page, don’t fetch again
      const existingPage = state.feed.pagination?.page;
      if (existingPage === page && state.feed.items.length > 0) {
        return rejectWithValue("Feed already loaded");
      }
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Unauthorized - No token");
      }

      const res = await fetch(
        `http://localhost:8080/feed?page=${page}&limit=${limit}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch feed");
      }

      return {
        items: data.data,
        pagination: data.pagination,
        page, // current page we requested
      };
    
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// export const fetchFeed = createAsyncThunk(
//   "feed/fetchFeed",
//   async ({ page = 1, limit = 10,append = false }: { page?: number; limit?: number, append?: boolean }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return rejectWithValue("Unauthorized - No token");
//       }

//       const res = await fetch(`http://localhost:8080/feed?page=${page}&limit=${limit}`, {
//         headers: {
//           accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log(res)

//       const data = await res.json();

//       if (!res.ok) {
//         return rejectWithValue(data.message || "Failed to fetch feed");
//       }

//       return { ...data, append }; // { success, message, data, pagination }
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Network error");
//     }
//   }
// );


// ✅ Like / Unlike
export const toggleLike = createAsyncThunk(
  "feed/toggleLike",
  async (
    { item }: { item: any },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to like/unlike.");
      return rejectWithValue("Not logged in");
    }

    try {
      if (!item.isLiked) {
        const res = await fetch("http://localhost:8080/feed/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            targetId: item.id,
            targetType: item.type.toUpperCase(),
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data?.message || "Item liked successfully");
          return { ...item, isLiked: true, likeId: data?.data?.likeId, likesCount: item.likesCount + 1 };
        } else {
          toast.error(data?.message || "Failed to like item");
          return rejectWithValue(data);
        }
      } else {
        if (!item.likeId) return rejectWithValue("Missing likeId");

        const res = await fetch(`http://localhost:8080/feed/like/${item.likeId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data?.message || "Item unliked successfully");
          return { ...item, isLiked: false, likeId: null, likesCount: Math.max(0, item.likesCount - 1) };
        } else {
          toast.error(data?.message || "Failed to unlike item");
          return rejectWithValue(data);
        }
      }
    } catch (err) {
      console.error("LIKE ERROR:", err);
      toast.error("Something went wrong.");
      return rejectWithValue(err);
    }
  }
);

// export const followUserProfile = createAsyncThunk(
//   "user/followUserProfile",
//   async ({ userId }: { userId: string },{ rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");

//       const res = await fetch("http://localhost:8080/feed/follow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ following_id: userId }),
//       });
//    console.log(res)
//       const data = await res.json();

//       if (!res.ok) {
//         return rejectWithValue(data.message || "Failed to follow user");
//       }

//       // Return the user id so slices can update state
//       return { id: userId, isFollowing: true };
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Network error");
//     }
//   }
// );

// ✅ Unfollow user
// export const unfollowUserProfile = createAsyncThunk(
//   "user/unfollowUserProfile",
//   async ({ userId }: { userId: string }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");

//       const res = await fetch(`http://localhost:8080/feed/unfollow/${userId}`, {
//         method: "DELETE",
//         headers: {
//           accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//      console.log(res)
//       const data = await res.json();

//       if (!res.ok) {
//         return rejectWithValue(data.message || "Failed to unfollow user");
//       }

//       return { id: userId, isFollowing: false };
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Network error");
//     }
//   }
// );

// --- Follow User ---


export const followUserProfile = createAsyncThunk(
  "feed/followUser",
  async ({ item }: { item: any }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/feed/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ followingId: item.user.id }),
      });
    console.log(res)
      const data = await res.json();
      if (res.ok && data.success) {
        return { ...item, user: { ...item.user, isFollowing: true } };
      } else {
        toast.error(data.message || "Failed to follow");
        return rejectWithValue(data);
      }
    } catch (err) {
      toast.error("Something went wrong");
      return rejectWithValue(err);
    }
  }
);

// // ✅ Unfollow
export const unfollowUserProfile = createAsyncThunk(
  "feed/unfollowUser",
  async ({ item }: { item: any }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/feed/unfollow/${item.user.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
   console.log(res)
      const data = await res.json();
      if (res.ok && data.success) {
        return { ...item, user: { ...item.user, isFollowing: false } };
      } else {
        toast.error(data.message || "Failed to unfollow");
        return rejectWithValue(data);
      }
    } catch (err) {
      toast.error("Something went wrong");
      return rejectWithValue(err);
    }
  }
);

// ✅ Share
export const sharePost = createAsyncThunk(
  "feed/sharePost",
  async (
    { item, platform }: { item: any; platform: "instagram" | "facebook" | "whatsapp" | "twitter" },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Not logged in");

    const mediaUrl = item.type === "ANIMATION" ? item.video_url : item.url;
    if (!mediaUrl) return rejectWithValue("Media not found");

    try {
      const res = await fetch("http://localhost:8080/feed/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetId: item.id,
          targetType: item.type.toUpperCase(),
          platform: platform.toUpperCase(),
        }),
      });
      console.log(res)

      if (!res.ok) throw new Error("Failed to share");
      
    const data = await res.json(); 
      // Open platform link
      const encodedUrl = encodeURIComponent(mediaUrl);
      const text = encodeURIComponent(item.type === "ANIMATION" ? item.title : item.caption);
      switch (platform) {
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
          break;
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`, "_blank");
          break;
        case "whatsapp":
          window.open(`https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`, "_blank");
          break;
        case "instagram":
          alert("Instagram sharing must be done manually in app.");
          break;
      }
   
     return { 
  ...item, 
   shareCount: (item.shareCount || 0) + 1,
  isShare: [...(item.isShare || []), platform] 
};
    } catch (err) {
      console.error("Error sharing:", err);
      return rejectWithValue(err);
    }
  }
);

// Fetch comments
export const fetchComments = createAsyncThunk(
  "feed/fetchComments",
  async (
    { type, feedId, page = 1, limit = 10 }: { type: string; feedId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Not logged in");

    try {
      const res = await fetch(`http://localhost:8080/feed/comments/${type}/${feedId}?page=${page}&limit=${limit}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)

      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();
      return { feedId, comments: data.data || [] };
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// Post comment
export const postComment = createAsyncThunk(
  "feed/postComment",
  async (
    { type, feedId, text }: { type: string; feedId: string; text: string },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("Not logged in");

    try {
      const res = await fetch("http://localhost:8080/feed/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetId: feedId, targetType: type, text }),
      });
      console.log(res)

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();

      if (!data.data) throw new Error("No comment returned");

      return { feedId, comment: data.data };
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

