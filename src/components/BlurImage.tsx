import Image from "next/image";

interface BlurImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

export function BlurImage({ src, alt, sizes, priority }: BlurImageProps) {
  return (
    <>
      {/* Low-res blurred background fill — hides letterbox dead space */}
      <Image
        src={src}
        alt=""
        fill
        aria-hidden
        className="object-cover scale-125 blur-2xl brightness-75 opacity-70"
        sizes="96px"
      />
      {/* Sharp foreground at natural proportions */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-contain z-10"
        sizes={sizes ?? "100vw"}
      />
    </>
  );
}
