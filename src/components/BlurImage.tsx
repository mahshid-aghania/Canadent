import Image from "next/image";

interface BlurImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

export function BlurImage({ src, alt, sizes, priority }: BlurImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className="object-cover"
      sizes={sizes ?? "100vw"}
    />
  );
}
