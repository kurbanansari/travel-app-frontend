"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { animationStatus, createAnimation, publishAnimation } from "@/redux/thunk/animationThunk";
import { resetPublishState } from "@/redux/slices/animationSlice";
import { Card,CardContent,CardHeader } from "./ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";

export default function AnimationPreviewContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const animationId = searchParams.get("animationId");

  const tripId = searchParams.get("tripId");
  
  const photoIdsParam = searchParams.get("photos");
  const selectedPhotos = photoIdsParam ? photoIdsParam.split(",") : [];
  const { status, videoUrl, loading, error,successMessage} = useSelector(
    (state: RootState) => state.animation
  );
  const [caption, setCaption] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
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
    if (status === "COMPLETED" || status === "failed") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [status]);
   const handleCreateAnimation = async () => {
      if (!tripId || !selectedStyle || !selectedMusic || selectedPhotos.length === 0) return;
  
      try {
        setCreating(true);
  
        const res = await dispatch(
          createAnimation({
            tripId,
            title: "",
            styleId: selectedStyle,
            musicId: selectedMusic,
            photoIds: selectedPhotos,
          })
        ).unwrap();
  
        router.push(`/animation/preview?animationId=${res.animationId}`);
        
      } catch (err) {
        console.error("Animation creation failed:", err);
      } finally {
        setCreating(false);
      }
    };
  
  // Handle publish animation
  const handlePublish = async (status: "PUBLISHED" | "DRAFT") => {
    if (!animationId) return;

    try {
      await dispatch(
        publishAnimation({
          animationId,
          caption,
          status
        })
      ).unwrap();
       // ✅ Navigate to home after successful publish
   if (status === "PUBLISHED") {
      // Redirect after publish
      router.push("/");
    } else if (status === "DRAFT") {
      // Show temporary success message for draft
      toast("Saved as draft!"); // or use a toast component
    }
    } catch (err) {
      console.error("Publish failed:", err);
    }
  };

  // Reset publish state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetPublishState());
    };
  }, [dispatch]);

  return (
  
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6 overflow-hidden">
  <Card className="w-full max-w-xl mb-8 shadow-2xl rounded-3xl border border-green-200 bg-white/90 backdrop-blur-md relative transition-transform duration-300 hover:scale-[1.01]">
    
    {status === "FAILED" && (
  <div className="flex flex-col items-center justify-center py-10">
    <img src="/error-animation.gif" alt="Error" className="w-20 h-20 mb-4" />
    <p className="text-red-600 font-semibold mb-3">
      Oops! Animation generation failed.
    </p>
    <button
     onClick={handleCreateAnimation}
      className="px-6 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold"
    >
      Retry
    </button>
  </div>
)}

     {/* ✅ Loader while animation generating */}
        {(status === "PENDING" || status === "PROCESSING" || loading) && (
          <div className="absolute flex flex-col items-center justify-center py-10 animate-pulse">
            <img
              src="/loader-animation.webp"
              alt="Generating animation"
              className="w-20 h-20 mb-4"
            />
            <p className="text-gray-700 text-lg font-medium text-center">
              We’re generating the animation for you... <br />
              <span className="text-green-600 font-semibold">Almost there!</span>
            </p>
          </div>
        )}

    
    {/* Preview Title */}
        
    {/* Completed Video */}
    {status === "COMPLETED" && videoUrl && (
      <div className="relative w-full h-full">
      <CardHeader className="text-center mb-4">
          <h2 className="text-2xl font-bold text-green-800 tracking-wide">
            🌿 Preview
          </h2>
        </CardHeader>
      <div className="">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover shadow-md border border-green-200"
        />
      </div>
      </div>
    )}

    {/* Publish Section */}
    {status === "COMPLETED" && (
      <div className="mt-6 flex flex-col items-center px-6 pb-6 ">
        

        <CardContent className="flex flex-col items-center gap-3 w-full h-full">
           
              <Textarea
                
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full text-xl max-w-sm border border-green-300 rounded-xl 
                px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm
                 placeholder-gray-400"
              />
              <div className="flex w-full gap-4">
         

  <button
    onClick={() => handlePublish("DRAFT")}
    disabled={loading}
    className={`w-full max-w-sm px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
      loading
        ? " cursor-pointer bg-white border border-green-600 text-green-600"
        : "border-emerald-500 hover:border-emerald-600 "
    }`}
  >
    {loading ? "Saving..." : "Save as Draft"}
  </button>
  <button
    onClick={() => handlePublish("PUBLISHED")}
    disabled={loading}
    className={`w-full max-w-sm px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-700 hover:bg-green-800 text-white"
    }`}
  >
    {loading ? "Publishing..." : "Publish Animation"}
  </button>
  </div>

          {error && (
            <p className="text-red-500 mt-2 text-sm font-medium">{error}</p>
          )}
          {successMessage && (
            <p className="text-green-600 mt-2 text-sm font-medium">
              {successMessage}
            </p>
          )}
        </CardContent>
      </div>
    )}
  </Card>
</div>

  );
}
