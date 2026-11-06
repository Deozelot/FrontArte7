import Link from "next/link";

type Props = {
  eyebrow: string; title: string; count?: number; href?: string; cta?: string;
  variant?: "actors" | "movies" | "form";
};

// Each route gets its own hero composition (see [data-variant] in globals.css).
export default function PageHead({ eyebrow, title, count, href, cta, variant = "form" }: Props) {
  return (
    <header className="pagehead rise" data-variant={variant}>
      <p className="mono eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {count !== undefined && <p className="count" aria-label={`${count} en total`}>{String(count).padStart(3, "0")}<small className="mono">en archivo</small></p>}
      {href && cta && <Link href={href} className="btn">{cta}</Link>}
    </header>
  );
}
