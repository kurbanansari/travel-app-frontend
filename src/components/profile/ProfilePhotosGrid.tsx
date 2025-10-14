"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import DeletePhotoButton from "./DeletePhotoButton";


// type ProfilePhotosGridProps = {
//   photos?: Array<{ id: string; url: string }>;
//    videos?: Array<{ id: string; url: string }>;
   
// };

export default function ProfilePhotosGrid() {
const dispatch = useDispatch<AppDispatch>();
 const { videoUrl} = useSelector(
    (state: RootState) => state.animation
  );
   const photos = useSelector((state: RootState) => state.photos.photos);



  if (!photos?.length) {
    return <div className="text-center text-gray-500">No photos available</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo) => (
        <div key={photo?.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden p-1">
          <Image src={photo?.url} alt="User photo" width={300} height={300} className="object-cover w-full h-full rounded-lg" />
           {/* ✅ Delete button component */}
          <DeletePhotoButton photoId={photo.id} />
        </div>
      ))}
      {/* {videos.map((video) => (
        <div key={video.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden p-1">
          <video
            src={video.url}
            controls
            className="w-full h-full rounded-lg object-cover"
          />
        </div>
      ))} */}
    </div>
  );
}
