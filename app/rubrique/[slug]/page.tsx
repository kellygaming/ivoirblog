import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articlesDeRubrique } from "@/lib/articles";
import { CarteListe, CarteUne } from "@/components/Cartes";
import { Puces } from "@/components/Puces";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

const nomDe = (slug: string) => site.rubriques.find((r) => slugify(r) === slug);

export function generateStaticParams() {
  return site.rubriques.map((r) => ({ slug: slugify(r) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: nomDe(slug) ?? "Rubrique" };
}

export default async function Rubrique({ params }: Props) {
  const { slug } = await params;
  const nom = nomDe(slug);
  if (!nom) notFound();
  const [une, ...reste] = articlesDeRubrique(slug);

  return (
    <div className="conteneur">
      <section className="section">
        <h1 className="section__titre">{nom}</h1>
        {site.descriptions[nom] && <p className="rubrique__intro">{site.descriptions[nom]}</p>}
        <Puces actif={slug} />
        {une ? (
          <>
            <CarteUne article={une} />
            <ul className="liste grille-liste">
              {reste.map((a) => <CarteListe key={a.slug} article={a} />)}
            </ul>
          </>
        ) : (
          <p className="vide">
            Les premiers textes de cette rubrique arrivent bientôt. En attendant, lisez{" "}
            <Link href="/articles/i-speak-politics">la présentation d’I Speak Politics</Link>.
          </p>
        )}
      </section>
    </div>
  );
}
