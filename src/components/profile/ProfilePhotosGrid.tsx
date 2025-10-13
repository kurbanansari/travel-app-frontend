"use client";

import Image from "next/image";

type ProfilePhotosGridProps = {
  photos?: Array<{ id: string; url: string }>;
};

export default function ProfilePhotosGrid({ photos }: ProfilePhotosGridProps) {
  if (!photos?.length) {
    return <div className="text-center text-gray-500">No photos available</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((photo) => (
        <div key={photo.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden p-1">
          <Image src={photo.url} alt="User photo" width={300} height={300} className="object-cover w-full h-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
