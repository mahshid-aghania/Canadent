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
      <div className="absolute inset-0" style={{ background: "#0f2150" }} />
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
