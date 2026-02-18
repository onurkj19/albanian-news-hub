import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export function LazyImage({ src, alt, className, aspectRatio = "video" }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
