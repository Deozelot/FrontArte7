import { hashOf } from "@/lib/format";

const isPlaceholder = (src: string) => /dummyimage\.com|placehold|placeholder/i.test(src);
const TONES = ["red", "paper", "rust", "film", "tan"] as const;

function initials(label: string) {
  const parts = label.replace(/[(),.]/g, " ").split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "7").slice(0, 2)).toUpperCase();
}

// Placeholder URLs get a typographic halftone card instead of a blurry image; real photos get a duotone.
export default function Frame({ src, alt, label = "", kind = "person", className = "" }: {
  src: string; alt: string; label?: string; kind?: "person" | "title"; className?: string;
}) {
  if (isPlaceholder(src) || !src) {
    const h = hashOf(label || alt);
    const words = label.replace(/[(),]/g, " ").split(/\s+/).filter(Boolean).slice(0, 3);
    return (
      <div className={`frame card ${className}`} data-tone={TONES[h % TONES.length]} data-kind={kind} role="img" aria-label={alt} style={{ "--ang": `${(h % 5) * 7 - 14}deg` } as React.CSSProperties}>
        <div className="card-dots" />
        {kind === "person" ? (
          <b className="card-init" aria-hidden="true">{initials(label || alt)}</b>
        ) : (
          <b className="card-words" aria-hidden="true">{words.map((w, i) => <span key={i}>{w}</span>)}</b>
        )}
        <span className="card-no mono" aria-hidden="true">{String((h % 89) + 10)}</span>
      </div>
    );
  }
  return (
    <div className={`frame ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs */}
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
