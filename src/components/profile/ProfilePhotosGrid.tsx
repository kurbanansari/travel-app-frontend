

"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import DeletePhotoButton from "./DeletePhotoButton";
import { useEffect, useMemo, useState } from "react";
import { deleteAnimation, fetchAnimationById, fetchUserAnimations } from "@/redux/thunk/animationThunk";
import { clearSelectedAnimation } from "@/redux/slices/animationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { clearPhotos } from "@/redux/slices/photoSlice";
import { HiDotsVertical } from "react-icons/hi";
import toast from "react-hot-toast";
import { deletePhoto } from "@/redux/thunk/photoThunk";

type ProfilePhotosGridProps = {
  isOwnProfile: boolean;
};

export default function ProfilePhotosGrid({ isOwnProfile }: ProfilePhotosGridProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { animations, loading, pagination, selectedAnimation, loadingSelected } = useSelector(
    (state: RootState) => state.animation
  );
  const { photos } = useSelector((state: RootState) => state.photos);
  const { profile } = useSelector((state: RootState) => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false); 
  
  // Fetch animations
  useEffect(() => {
    if (!profile?.id) return;
    dispatch(fetchUserAnimations({ page: 1, limit: 100 }));
  }, [dispatch, profile?.id]);

  const userAnimations = animations.filter(a => a.user_id === profile?.id);

  const combinedMedia = useMemo(() => {
    const photoItems = photos?.map(photo => ({
      id: photo.id,
      type: "photo" as const,
      url: photo.url,
      created_at: photo.created_at || new Date().toISOString(),
    })) || [];

    const animationItems = userAnimations?.map(anim => ({
      id: anim.id,
      type: "video" as const,
      url: anim.video_url,
      title: anim.title,
      status: anim.status,
      created_at: anim.created_at,
    })) || [];

    return [...photoItems, ...animationItems].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [photos, userAnimations]);
  const openModalAt = async (index: number) => {
    setCurrentIndex(index);
    const item = combinedMedia[index];
    if (item.type === "video") {
      setModalOpen(true);
      await dispatch(fetchAnimationById(item.id));
    } else {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setMenuOpen(false);
    dispatch(clearSelectedAnimation());
    // dispatch(clearPhotos())
  };
const prevItem = () => {
  setCurrentIndex((i) => {
    if (!combinedMedia.length) return 0;
    const newIndex = i > 0 ? i - 1 : combinedMedia.length - 1;

    // Fetch animation safely
    const prev = combinedMedia[newIndex];
    if (prev?.type === "video") {
      setTimeout(() => dispatch(fetchAnimationById(prev.id)), 0);
    }

    return newIndex;
  });
};

const nextItem = () => {
  setCurrentIndex((i) => {
    if (!combinedMedia.length) return 0;
    const newIndex = i < combinedMedia.length - 1 ? i + 1 : 0;

    const next = combinedMedia[newIndex];
    if (next?.type === "video") {
      setTimeout(() => dispatch(fetchAnimationById(next.id)), 0);
    }

    return newIndex;
  });
};

  //  const handleDeleteAnimation = async (id: string) => {
  //    if (!isOwnProfile) return;
  //    await dispatch(deleteAnimation(id));
  //    closeModal();
  //   };
    
 const handleDelete = async () => {
  const item = combinedMedia[currentIndex];
  if (!isOwnProfile) return;

  try {
    if (item.type === "photo") {
      await dispatch(deletePhoto(item.id));
    } else if (item.type === "video" && selectedAnimation?.id) {
      await dispatch(deleteAnimation(selectedAnimation.id));
      await dispatch(fetchUserAnimations({ page: 1, limit: 100 })); // 🔁 refresh animations
    }
    closeModal();
  } catch (error) {
    toast.error("Failed to delete item");
  }
};
    const currentItem = combinedMedia[currentIndex];

  if (!combinedMedia.length) {
    return <div className="text-center text-gray-500 py-10">No media available</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {combinedMedia.map((item, idx) => (
          <div
            key={item.id}
            className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openModalAt(idx)}
          >
            {item.type === "photo" ? (
              <div className="relative w-full h-full">
    <Image
      src={item.url}
      alt="media"
      width={300}
      height={300}
      className="w-full h-full object-cover rounded-lg"
    />
  </div>
            ) : (
              <video src={item.url} className="w-full h-full object-cover rounded-lg" muted loop playsInline />
              
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
     
<AnimatePresence>
  {modalOpen && currentItem && (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white rounded-lg p-4 max-w-2xl w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-xl"
          onClick={closeModal}
        >
          &times;
        </button>

        {/* 3-dot menu button */}
         {/* 3-dot menu (⋮) */}
              {isOwnProfile && (
                <div className="absolute top-2 right-12">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((prev) => !prev);
                    }}
                    className="text-white bg-black/50 rounded-full p-1"
                  >
                    <HiDotsVertical size={20} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-20">
                      <button
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          handleDelete();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

        {/* Navigation */}
        <button
          onClick={prevItem}
          className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 text-white bg-black/40 rounded-r-lg"
          disabled={combinedMedia.length <= 1}
        >
          ‹
        </button>
        <button
          onClick={nextItem}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 text-white bg-black/40 rounded-l-lg"
          disabled={combinedMedia.length <= 1}
        >
          ›
        </button>

        {/* Media display */}
        {currentItem.type === "photo" && (
          <div className="relative w-full mt-8">
            <Image
              src={currentItem.url}
              width={600}
              height={600}
              className="w-full max-h-[80vh] object-contain rounded-lg"
              alt="photo"
            />
          </div>
        )}

        {currentItem.type === "video" && (
          <>
            {loadingSelected ? (
              <p className="text-white text-center py-10">Loading...</p>
            ) : selectedAnimation ? (
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-center">{selectedAnimation.title}</h2>
                <video
                  src={selectedAnimation.video_url}
                  controls
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
                <p className="text-sm text-gray-300">
                  Style: {selectedAnimation?.animation_style?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  Music: {selectedAnimation.music_track?.title || "N/A"} - {selectedAnimation.music_track?.artist || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  Trip: {selectedAnimation.trip?.title || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-red-500">Failed to load animation</p>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}
