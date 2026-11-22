import Link from "next/link";
import { site } from "@/lib/site";

/** Logo bicolore façon « jeune|afrique » : « kita » en couleur du texte, « blog » en accent. */
export function Logo() {
  const [debut, fin] = site.logo;
  return (
    <Link href="/" className="logo" aria-label={`${site.nom} — accueil`}>
      {debut}
      <span>{fin}</span>
    </Link>
  );
}
