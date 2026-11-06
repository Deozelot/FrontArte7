// Duotone photo frame: grayscale image, ink shadows turned vermilion, cream highlights.
export default function Frame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`frame ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs */}
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
