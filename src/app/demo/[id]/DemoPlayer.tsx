"use client";

export default function DemoPlayer({ src }: { src: string }) {
  return (
    <video
      src={src}
      className="w-full h-full object-contain"
      controls
      autoPlay
      playsInline
    />
  );
}
