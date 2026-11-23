import Link from "next/link";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";

/** Les quatre espaces du blog, en cartes. */
export function Espaces() {
  return (
    <div className="espaces">
      {site.rubriques.map((r, i) => (
        <Link key={r} href={`/rubrique/${slugify(r)}`} className="espace">
          <span className="espace__num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{r}</h3>
          <p>{site.descriptions[r]}</p>
          <span className="espace__lien">Explorer →</span>
        </Link>
      ))}
    </div>
  );
}
