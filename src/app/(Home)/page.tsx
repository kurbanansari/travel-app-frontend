// app/page.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchFeed } from "@/redux/thunk/feedThunk";
import { updateFeedItem, FeedItem } from "@/redux/slices/feedSlice";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { LuMessageCircleMore } from "react-icons/lu";

import PostCard from "@/components/ui/PostCard";

const FeedPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    items: feed,
    loading,
    error,
    pagination,
  } = useSelector((state: RootState) => state.feed);

  const hasFetched = useRef(false);

  const handleItemUpdate = (updatedItem: FeedItem) => {
    dispatch(updateFeedItem(updatedItem));
  };

  useEffect(() => {
    // ✅ Only fetch if we haven't fetched before AND feed is empty
    if (!hasFetched.current && feed.length === 0) {
      dispatch(fetchFeed({ page: 1, limit: 10 }));
      hasFetched.current = true;
    }
  }, [dispatch, feed.length]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      dispatch(fetchFeed({ page: pagination.page + 1, limit: 10 }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-green-50 px-2 sm:px-4">
      <Card className="w-full max-w-xl mt-6 mb-20 shadow-lg rounded-2xl border bg-green-100 relative">
        <Header />
        <main className="w-full max-w-xl mx-auto pt-3 pb-3  sm:px-0 relative">
          {loading && (
            <div className="p-6 space-y-6">
              {/* Header skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>

              {/* Image skeleton */}
              <Skeleton className="h-48 w-full rounded-lg" />

              {/* Text skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )}

          {!loading && !error && feed.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No posts found.
            </div>
          )}
          <div className="flex flex-col gap-4 ml-2 mr-2 relative">
            {feed &&
              feed?.map((item) => (
                <PostCard
                  key={item.id}
                  item={item}
                  onItemUpdate={handleItemUpdate}
                />
              ))}
          </div>
        

          {/* ✅ Load more button */}
          {pagination && pagination.page < pagination.totalPages && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </main>
      </Card>
        <div className="fixed bottom-22 right-135 z-50">
            <button
              className="w-14 h-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 transition"
              onClick={
                () =>
                  router.push("/chat") /* Add your open chat handler here */
              }
            >
              {/* Use any icon, e.g., Chat icon from lucide-react */}
             <LuMessageCircleMore size={30} color="white"/>
            </button>
          </div>
    </div>
  );
};

export default FeedPage;
