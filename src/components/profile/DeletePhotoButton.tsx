// src/components/profile/DeletePhotoButton.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { deletePhoto } from "@/redux/thunk/photoThunk";
import { setPhotos } from "@/redux/slices/photoSlice";
import { removeProfilePhoto } from "@/redux/slices/userSlice";

type DeletePhotoButtonProps = {
  photoId: string;
};

export default function DeletePhotoButton({ photoId }: DeletePhotoButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showIcon, setShowIcon] = useState(false);
  const { loading ,photos} = useSelector((state: RootState) => state.photos);

//   const handleDelete = () => {
//       dispatch(deletePhoto(photoId));
//       dispatch(setPhotos(photos.filter(p => p.id !== photoId)));
    
//   };

const handleDelete = async () => {
    const originalPhotos = [...photos]; // backup for rollback

    // Optimistic update
    dispatch(setPhotos(photos.filter((p) => p.id !== photoId)));
    dispatch(removeProfilePhoto(photoId));

    try {
      await dispatch(deletePhoto(photoId)).unwrap();
    //   toast.success("Photo deleted successfully");
    } catch (err) {
    //   toast.error("Failed to delete photo. Restoring...");
      // Rollback
      dispatch(setPhotos(originalPhotos));
    }
  };

  return (
    <div
    //   className="absolute top-2 right-2 z-10"
    //   onMouseEnter={() => setShowIcon(true)}
    //   onMouseLeave={() => setShowIcon(false)}
    >
      {/* {showIcon && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="absolute top-2 right-2 bg-red-600 p-2 rounded-full opacity-0 
                 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
        >
          <Trash2 size={18} color="white" />
        </button>
      )} */}
       <button
      onClick={handleDelete}
      disabled={loading}
      className="absolute top-2 right-2 bg-red-600 p-2 rounded-full 
                 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                 hover:bg-red-700 z-10"
    >
      <Trash2 size={18} color="white" />
    </button>
    </div>
  );
}
