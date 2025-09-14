"use client";

import Image from "next/image";

const isSignedUrl = (url: string) => url.includes("X-Amz-Signature");

const BASE_URL = "http://localhost:8080/photos"; 

export function SmartImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  children, 
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode; // ✅ added
}) {
  if (!src) {
        return <>{children}</>;;
  }

  // If it's just a filename/UUID -> prefix with backend URL
  if (!src.startsWith("http")) {
    src = `${BASE_URL}/${src}`;
  }

  // If signed URL (S3/MinIO), must use <img>
  
  return (
    
    <div className="relative">
      {isSignedUrl(src) ? (
        <img src={src} alt={alt || ""} className={className} />
      ) : fill ? (
        <Image src={src} alt={alt || ""} fill className={className} unoptimized />
      ) : (
        <Image
          src={src}
          alt={alt || ""}
          width={width || 400}
          height={height || 400}
          className={className}
          unoptimized
        />
      )}

      {/* ✅ Always render children (buttons/overlays) */}
      {children}
    </div>
  );
}
