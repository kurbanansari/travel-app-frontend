"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { animationStatus } from "@/redux/thunk/animationThunk";

export default function AnimationPreviewContent() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const animationId = searchParams.get("animationId");

  const { status, videoUrl, loading, error } = useSelector(
    (state: RootState) => state.animation
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!animationId) return;

    dispatch(animationStatus(animationId));

    intervalRef.current = setInterval(() => {
      dispatch(animationStatus(animationId));
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, animationId]);

  useEffect(() => {
    if (status === "ready" || status === "failed") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Animation Preview</h1>

      {(loading || status === "pending") && (
        <p className="text-lg text-gray-700">
          ⏳ Your animation is being generated...
        </p>
      )}

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {status === "ready" && videoUrl && (
        <div className="w-full max-w-2xl mt-4">
          <video src={videoUrl} controls className="w-full rounded-xl shadow-lg" />
        </div>
      )}
    </div>
  );
}
