import Link from "next/link";

type Props = { eyebrow: string; title: string; count?: number; href?: string; cta?: string };

export default function PageHead({ eyebrow, title, count, href, cta }: Props) {
  return (
    <header className="pagehead rise">
      <p className="mono eyebrow">{eyebrow}</p>
      <h1>{title}{count !== undefined && <sup className="count">{String(count).padStart(2, "0")}</sup>}</h1>
      {href && cta && <Link href={href} className="btn">{cta}</Link>}
    </header>
  );
}
