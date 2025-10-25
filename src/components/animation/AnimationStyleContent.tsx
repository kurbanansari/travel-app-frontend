
"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  animationStyles,
  animationMusic,
  createAnimation,
} from "@/redux/thunk/animationThunk";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AnimationStylesContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tripId = searchParams.get("tripId");
  const animationId = searchParams.get("animationId");
  const photoIdsParam = searchParams.get("photos");
  const selectedPhotos = photoIdsParam ? photoIdsParam.split(",") : [];

  const { styles, loading, error, music } = useSelector(
    (state: RootState) => state.animation
  );

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(animationStyles());
    dispatch(animationMusic());
  }, [dispatch]);

  // ✅ Handle Create Animation
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

  {loading && (
  <div className="flex flex-col items-center justify-center py-10">
    {/* Spinner */}
    <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-green-800 font-medium text-lg">Loading...</p>
  </div>
)}

{error && (
  <div className="flex items-center justify-center py-6 px-4 bg-red-100 border border-red-300 rounded-lg">
    <p className="text-red-700 font-semibold">{error}</p>
  </div>
)}

  return (
    // <div className="flex items-center justify-center min-h-screen bg-emerald-50 px-2 sm:px-4">
    //   <Card className="w-full max-w-xl mt-8 rounded-2xl shadow-lg bg-emerald-100 relative">
    //     <CardHeader className="flex justify-between items-center">
    //       <h1 className="text-xl font-bold">Choose an Animation Style</h1>
    //       <h1 className="text-xl font-bold">Choose Music Track</h1>
    //     </CardHeader>

    //     <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //       {/* Styles */}
    //       <div>
    //         {styles.map((style) => (
    //           <div
    //             key={style.id}
    //             onClick={() => setSelectedStyle(style.id)}
    //             className={`border rounded-xl p-4 shadow cursor-pointer bg-white ${
    //               selectedStyle === style.id ? "border-blue-600" : ""
    //             }`}
    //           >
    //             {style.thumbnail_url && (
    //               <img
    //                 src={style.thumbnail_url}
    //                 alt={style.name}
    //                 className="w-full h-28 object-cover rounded-md mb-2"
    //               />
    //             )}
    //             <h3 className="font-semibold">{style.name}</h3>
    //             <p className="text-sm text-gray-600">{style.description}</p>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Music */}
    //       <div>
    //         {music.map((track: any) => (
    //           <div
    //             key={track.id}
    //             onClick={() => setSelectedMusic(track.id)}
    //             className={`border rounded-xl p-4 shadow cursor-pointer bg-white ${
    //               selectedMusic === track.id ? "border-blue-600" : ""
    //             }`}
    //           >
    //             <h3 className="font-semibold">{track.title}</h3>
    //             <p className="text-sm text-gray-600">by {track.artist}</p>
    //             <p className="text-xs text-gray-500">
    //               Duration: {Math.floor(track.duration / 60)}:
    //               {(track.duration % 60).toString().padStart(2, "0")}
    //             </p>
    //             <audio controls className="w-full mt-2">
    //               <source src={track.url} type="audio/mp3" />
    //               Your browser does not support the audio element.
    //             </audio>
    //           </div>
    //         ))}
    //       </div>
    //     </CardContent>

    //     {/* ✅ Proceed Button */}
    //     <div className="p-6 flex justify-center">
    //       <button
    //         disabled={!selectedStyle || !selectedMusic || creating}
    //         onClick={handleCreateAnimation}
    //         className={`px-6 py-3 rounded-xl font-semibold ${
    //           !selectedStyle || !selectedMusic
    //             ? "bg-gray-400 cursor-not-allowed"
    //             : "bg-green-700 hover:bg-green-800 text-white"
    //         }`}
    //       >
    //         {creating ? "Creating..." : "Create Animation"}
    //       </button>
    //     </div>
    //   </Card>
    // </div>
     <div className="flex justify-center min-h-screen bg-emerald-50 px-4 py-8">
      <Card className="w-full max-w-xl rounded-2xl shadow-xl bg-emerald-100">
        <CardHeader className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4 border-b border-emerald-200">
          <h1 className="text-xl md:text-2xl font-bold text-green-900 text-center md:text-left">
            Choose an Animation Style
          </h1>
          <h1 className="text-xl md:text-2xl font-bold text-green-900 text-center md:text-left">
            Choose Music Track
          </h1>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6">
          {/* Styles */}
          <div className="grid grid-cols-1 gap-4">
            {styles.map((style) => (
              <div
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`cursor-pointer rounded-xl shadow-md border p-4 bg-white hover:scale-105 transition-transform duration-200 ${
                  selectedStyle === style.id ? "border-emerald-600 ring-2 ring-emerald-400" : ""
                }`}
              >
                {style.thumbnail_url && (
                  <img
                    src={style.thumbnail_url}
                    alt={style.name}
                    className="w-full h-32 md:h-36 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-green-900">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.description}</p>
              </div>
            ))}
          </div>

          {/* Music */}
          <div className="grid grid-cols-1 gap-4">
            {music.map((track: any) => (
              <div
                key={track.id}
                onClick={() => setSelectedMusic(track.id)}
                className={`cursor-pointer rounded-xl shadow-md border p-4 bg-white hover:scale-105 transition-transform duration-200 ${
                  selectedMusic === track.id ? "border-emerald-600 ring-2 ring-emerald-400" : ""
                }`}
              >
                <h3 className="font-semibold text-green-900">{track.title}</h3>
                <p className="text-sm text-gray-600">by {track.artist}</p>
                <p className="text-xs text-gray-500">
                  Duration: {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, "0")}
                </p>
                <audio controls className="w-full mt-2 rounded-md">
                  <source src={track.url} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Proceed Button */}
        <div className="flex justify-center px-6 py-6">
          <button
            disabled={!selectedStyle || !selectedMusic || creating}
            onClick={handleCreateAnimation}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-colors ${
              !selectedStyle || !selectedMusic
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {creating ? "Creating..." : "Create Animation"}
          </button>
        </div>
      </Card>
    </div>
  );
}