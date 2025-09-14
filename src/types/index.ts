// src/types/index.ts

export type FeedItem = {
  id: string;
  type: "PHOTO" | "ANIMATION";
  url?: string;          // for PHOTO
  title?: string;        // for ANIMATION
  video_url?: string;    // for ANIMATION
  caption?: string;      // for PHOTO
  created_at: string;
  taken_at?: string;
  status?: string;
  isLiked: boolean;
  likeId?: string | null;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    name: string;
    profile_pic_url?: string;
    isFollowing?: boolean;
  };
};

export type Comment = {
  id: string;
  text: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
};

//
// 🔥 Socket Event Types
//

// For likes/unlikes
export type LikeUpdateEvent = {
  action: "LIKE" | "UNLIKE";
  targetId: string;   // feed item id
  userId: string;     // who liked/unliked
  likeId?: string;    // only for LIKE
};

// For new comments
export type CommentUpdateEvent = {
  action: "COMMENT";
  targetId: string;   // feed item id
  comment: Comment;
};
