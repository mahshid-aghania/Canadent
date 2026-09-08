import Image from "next/image";

interface BlurImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Poster image that is always shown in full (object-contain, so embedded text
 * and faces are never cropped). To keep the letterbox area from reading as flat
 * bars, we fill it with a blurred, zoomed copy of the same poster so the edges
 * become a soft continuation of the artwork rather than a hard navy band.
 */
export function BlurImage({ src, alt, sizes, priority }: BlurImageProps) {
  return (
    <>
      {/* Base colour (only visible if the poster has transparency). */}
      <div className="absolute inset-0" style={{ background: "#0f2150" }} />

      {/* Blurred, zoomed fill behind the poster — softens the letterbox bars. */}
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes ?? "100vw"}
        style={{
          objectFit: "cover",
          transform: "scale(1.2)",
          filter: "blur(28px)",
          opacity: 0.7,
          zIndex: 5,
        }}
      />

      {/* Sharp, fully-visible poster. */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        style={{ objectFit: "contain", objectPosition: "center center", zIndex: 10 }}
        sizes={sizes ?? "100vw"}
      />
    </>
  );
}
