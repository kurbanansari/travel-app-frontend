// components/PostCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams ,useRouter} from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { FaShare } from "react-icons/fa";
import { DropdownMenu , DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from "./dropdown-menu";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  toggleLike,
  
  sharePost,
  postComment as postCommentThunk,
  fetchComments,
  unfollowUserProfile,
  followUserProfile,
} from "@/redux/thunk/feedThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectCommentsById } from "@/redux/slices/feedSlice";
import toast from "react-hot-toast";
import { useSocket } from "@/contexts/SocketContext";
import type { FeedItem } from "@/redux/slices/feedSlice";
import { Input } from "./input";

const PostCard = ({ item, onItemUpdate }: { item: FeedItem; onItemUpdate: (updatedItem: FeedItem) => void }) => {
  const searchParams = useSearchParams();
   const userId = searchParams.get("userId");
   const dispatch = useDispatch<AppDispatch>();
    const { socket } = useSocket(); 
   const likeInProgress = useRef(false);
  const [token, setToken] = useState<string | null>(null);
  const [openCommentsForId, setOpenCommentsForId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [followLoadingId, setFollowLoadingId] = useState<string | null>(null);
  const commentsMap = useSelector((state: RootState) => state.feed.comments);
  const commentLoading = useSelector((state: RootState) =>
    openCommentsForId === item.id ? state.feed.loading : false
  );

  const selectComments = makeSelectCommentsById(item.id);
  const comments = useSelector(selectComments);
  const currentUserId = useSelector((state: RootState) => state.user.user?.id);

   const router = useRouter(); 
// useEffect(() => {
//   const token = localStorage.getItem("token");
//     setToken(token);
//     if (!token) {
//        router.push("/login");
//       return;
//     }
// }, []);


useEffect(() => {
  if (!socket) return;

  // Handle like updates
  const handleLikeUpdate = (data: any) => {
    if (item.id !== data.targetId) return;

    const isCurrentUser = data.userId === userId;

    const updatedItem: FeedItem = {
      ...item,
      likesCount:
        data.action === "LIKE"
          ? item.likesCount + 1
          : data.action === "UNLIKE"
          ? Math.max(0, item.likesCount - 1)
          : item.likesCount,
      isLiked: isCurrentUser
        ? data.action === "LIKE"
          ? true
          : false
        : item.isLiked,
      likeId: isCurrentUser
        ? data.action === "LIKE"
          ? data.likeId // backend must send this
          : null
        : item.likeId,
    };

    onItemUpdate(updatedItem);
  };

const handleShareUpdate = (data: any) => {
  if (item.id !== data.targetId) return;

  const updatedItem: FeedItem = {
    ...item,
    shareCount: data.shareCount, // backend exact count
    isShare:
      data.userId === localStorage.getItem("userId")
        ? [...(item.isShare || []), data.platform]
        : item.isShare,
  };

  onItemUpdate(updatedItem);
};
 
  const handleCommentUpdate = (data: any) => {
      if (item.id !== data.targetId || data.action !== "ADD") return;
      onItemUpdate({ ...item, commentsCount: item.commentsCount + 1 });
    };

  // ✅ Register listeners
  socket.on("likeUpdate", handleLikeUpdate);
  socket.on("shareUpdate", handleShareUpdate);
  socket.on("commentUpdate", handleCommentUpdate);

  // ✅ Cleanup listeners
  return () => {
    socket.off("likeUpdate", handleLikeUpdate);
    socket.off("shareUpdate", handleShareUpdate);
    socket.off("commentUpdate", handleCommentUpdate);
  };
}, [socket, item, onItemUpdate]);


  useEffect(() => {
    if (!socket) return;
    socket.emit("subscribeToTarget", item.id);
  }, [socket, item.id]);
   // Fetch comments from Redux

// --- Open comments ---
const handleOpenComments = async () => {
  try {
    await dispatch(fetchComments({
      type: item.type.toUpperCase(),
      feedId: item.id,
      page: 1,
      limit: 10,
    })).unwrap();
    setOpenCommentsForId(item.id);
  } catch (err) {
    toast.error("Failed to load comments");
  }
};

// --- Post comment ---
const handlePostComment = async () => {
  if (!commentText.trim()) return;
  try {
    await dispatch(postCommentThunk({
      feedId: item.id,
      type: item.type.toUpperCase(),
      text: commentText,
    })).unwrap();
    setCommentText(""); // ✅ clear input
  } catch (err) {
    toast.error("Failed to post comment");
  }
};

  const handleLike = async () => {
    if (likeInProgress.current) return;
    likeInProgress.current = true;
    try {
      const result = await dispatch(toggleLike({ item })).unwrap();
      onItemUpdate(result);
    } catch (err: any) {
      console.error("Like error:", err);
    } finally {
      likeInProgress.current = false;
    }
  };

  const handleShare = async (
  platform: "instagram" | "facebook" | "whatsapp" | "twitter"
) => {
  if (!token || item.isShare?.includes(platform)) return;

  try {
    const updatedItem = await dispatch(sharePost({ item, platform })).unwrap();
    onItemUpdate(updatedItem); // update local feed state
  } catch (err) {
    console.error("Share error:", err);
    toast.error("Failed to share post");
  }
};


const handleFollow = async () => {
  // if (!token) return;
  setFollowLoadingId(item.user.id);
  try {
    await dispatch(followUserProfile({ item })).unwrap();
    onItemUpdate({ ...item, user: { ...item.user, isFollowing: true } }); // ✅ update local PostCard item
  } catch (err) {
    console.error(err);
    toast.error("Failed to follow user");
  } finally {
    setFollowLoadingId(null);
  }
};

const handleUnfollow = async () => {
  // if (!token) return;
  setFollowLoadingId(item.user.id);
  try {
    await dispatch(unfollowUserProfile({ item })).unwrap();
    onItemUpdate({ ...item, user: { ...item.user, isFollowing: false } }); // ✅ update local PostCard item
  } catch (err) {
    console.error(err);
    toast.error("Failed to unfollow user");
  } finally {
    setFollowLoadingId(null);
  }
};


  return (
  
<Card className="overflow-hidden w-full max-w-full sm:max-w-md md:max-w-lg mx-auto">
  {/* User Header */}
  <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4 flex-wrap gap-2">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
        <AvatarImage src={item.user.profile_pic_url || ""} alt="{item.user.name}" />
        <AvatarFallback>
            {/* {item.user.name[0]}  */}
            {/* {item.user?.name?.[0] ?? "?"} */}
             <Link href={`/profile/${item.user.id}`} className="hover:underline">
                  <span className="font-medium text-sm sm:text-base truncate">{item.user.name?.[0] ?? "?"}</span>
          </Link>
        </AvatarFallback>
      </Avatar>
      <Link href={`/profile/${item.user.id}`} className="hover:underline">
                  <span className="font-medium text-sm sm:text-base truncate">{item.user.name}</span>
          </Link>

    </div>

   {item.user.id !== localStorage.getItem("userId") && (
  item.user.isFollowing ? (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUnfollow}
      disabled={followLoadingId === item.user.id}
      className="text-xs sm:text-sm"
    >
      {followLoadingId === item.user.id ? "..." : "Following"}
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFollow}
      disabled={followLoadingId === item.user.id}
      className="text-xs sm:text-sm"
    >
      {followLoadingId === item.user.id ? "..." : "Follow"}
    </Button>
  )
)}

  
  </CardHeader>

  {/* Image */}
  <div className="relative w-full h-40 xs:h-48 sm:h-60 md:h-80">
    {item.type === "ANIMATION" ? (
      <video src={item.video_url} controls className="w-full h-full object-cover" />
    ) : (
      <Image src={item.url} alt={item.caption} fill className="object-cover" unoptimized  />
    )}
  </div>

  {/* Stats */}
 <CardContent className="flex items-center gap-4 sm:gap-6 text-gray-600 text-xs sm:text-sm py-2 sm:py-3 flex-wrap border-t">
  {/* Like */}
  <span className="flex items-center gap-1">
    <Heart
      size={16}
      fill={item.isLiked ? "currentColor" : "none"}
      onClick={handleLike}
      className={`cursor-pointer ${
        item.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
      }`}
    />
    {item.likesCount}
  </span>

  {/* Comment */}
  <span className="flex items-center gap-1">
    <MessageCircle
      size={16}
      onClick={() =>
        openCommentsForId === item.id
          ? setOpenCommentsForId(null)
          : handleOpenComments()
      }
      className="cursor-pointer text-gray-400 hover:text-blue-500"
    />
    {item.commentsCount}
  </span>

  {/* Share */}
<div className="flex items-center gap-2 relative">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="p-2 rounded-full hover:bg-gray-200 transition-colors shadow-md"
        aria-label="Share post"
      >
        <FaShare className="text-gray-700 w-4 h-4" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="center"
      className="bg-white rounded-2xl shadow-xl border border-gray-200 py-4 px-6 w-64 animate-dropdown-scale relative"
    >
      {/* Pointer triangle */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-md border-t border-l border-gray-200"></div>

      <DropdownMenuLabel className="text-gray-500 text-sm text-center mb-3">
        Share to
      </DropdownMenuLabel>

      {/* Grid of platforms */}
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        <button
          onClick={() => handleShare("instagram")}
          className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-pink-50 transition"
        >
          <FaInstagram className="text-pink-500 w-6 h-6" />
          <span className="text-xs text-gray-700">Instagram</span>
        </button>

        <button
          onClick={() => handleShare("facebook")}
          className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-blue-50 transition"
        >
          <FaFacebook className="text-blue-600 w-6 h-6" />
          <span className="text-xs text-gray-700">Facebook</span>
        </button>

        <button
          onClick={() => handleShare("twitter")}
          className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-blue-100 transition"
        >
          <FaTwitter className="text-blue-400 w-6 h-6" />
          <span className="text-xs text-gray-700">Twitter</span>
        </button>

        <button
          onClick={() => handleShare("whatsapp")}
          className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-green-50 transition"
        >
          <FaWhatsapp className="text-green-500 w-6 h-6" />
          <span className="text-xs text-gray-700">WhatsApp</span>
        </button>

        <button
          onClick={() => {
            const mediaUrl = item.type === "ANIMATION" ? item.video_url : item.url;
            if (mediaUrl) {
              navigator.clipboard.writeText(mediaUrl);
              alert("Link copied to clipboard ✅");
            }
          }}
          className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-gray-100 transition"
        >
          <FaShare className="text-gray-600 w-6 h-6" />
          <span className="text-xs text-gray-700">Copy Link</span>
        </button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>

  {/* Share count badge */}
  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
    {item.shareCount || 0}
  </span>

  {/* Animation */}
  <style jsx>{`
    .animate-dropdown-scale {
      transform-origin: top center;
      animation: dropdown-scale 0.15s ease-out forwards;
    }

    @keyframes dropdown-scale {
      0% {
        opacity: 0;
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `}</style>
</div>

</CardContent>

  {/* Caption */}
  <CardFooter>
    <p className="text-xs sm:text-sm break-words pb-6">
      {item.type === "ANIMATION" ? item.title : item.caption}
    </p>
  </CardFooter>

  {/* Inline Comments Section */}
  {openCommentsForId === item.id && (
    <CardContent className="px-3 sm:px-4 pb-4">
      <div className="max-h-32 sm:max-h-40 overflow-y-auto mb-2 space-y-3">
        {commentLoading ? (
          <div className="text-center text-gray-400 text-sm">Loading...</div>
        ) : (comments?.length ?? 0) === 0 ? (
          <div className="text-center text-gray-400 text-sm">No comments yet.</div>
        ) : (
          comments.map((c,index) => (
            <div key={`${c.id}-${index}`} className="flex items-start gap-2">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage src={c?.user?.profile_pic_url || ""} />
                <AvatarFallback>
                     {c?.user?.name?.[0] || "?"}
        
                  </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-semibold text-xs sm:text-sm truncate">
                  <Link href={`/profile/${c.user.id}`} className="hover:underline">
                    {c.user.name}
                  </Link>
                </div>
                <div className="text-gray-700 text-xs sm:text-sm break-words">{c.text}</div>
                <div className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* {token && ( */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border border-gray-300 rounded-lg p-1 sm:p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
            placeholder="Add a comment..."
            disabled={commentLoading}
          />
          <Button
             onClick={handlePostComment}
            disabled={commentLoading || !commentText.trim()}
            className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition"
          >
            Post
          </Button>
        </div>
      {/* )} */}
      
    </CardContent>
  )}
</Card>


  );
};

export default PostCard;