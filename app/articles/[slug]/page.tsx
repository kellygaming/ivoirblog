import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleParSlug, formaterDate, tousLesArticles } from "@/lib/articles";
import { CarteListe } from "@/components/Cartes";
import { Partage } from "@/components/Partage";
import { ProgressionLecture } from "@/components/ProgressionLecture";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tousLesArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articleParSlug(slug);
  if (!a) return {};
  return {
    title: a.titre,
    description: a.chapo,
    authors: [{ name: a.auteur }],
    openGraph: {
      type: "article",
      title: a.titre,
      description: a.chapo,
      publishedTime: a.date,
      modifiedTime: a.modifie,
      authors: [a.auteur],
      images: a.image ? [a.image] : undefined,
    },
  };
}

const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]!.toUpperCase())
    .join("");

export default async function PageArticle({ params }: Props) {
  const { slug } = await params;
  const a = articleParSlug(slug);
  if (!a) notFound();

  const autres = tousLesArticles().filter((x) => x.slug !== a.slug);
  const recents = autres.slice(0, 4);
  const aLire = [...autres]
    .sort((x, y) => Number(y.rubrique === a.rubrique) - Number(x.rubrique === a.rubrique))
    .slice(0, 3);
  const url = `${site.url}/articles/${a.slug}`;

  return (
    <>
      <ProgressionLecture />
      <article className="article">
        <div className="article__grille">
          {/* Colonne gauche : auteur, dates, partage (ordinateur) */}
          <aside className="article__gauche" aria-label="Informations sur l’article">
            <div className="rail">
              <div className="auteur">
                <span className="auteur__avatar" aria-hidden>{initiales(a.auteur)}</span>
                <div>
                  <span className="rail__libelle">Publié par</span>
                  <strong className="auteur__nom">{a.auteur}</strong>
                </div>
              </div>
              <dl className="dates">
                <div>
                  <dt className="rail__libelle">Publié le</dt>
                  <dd><time dateTime={a.date}>{formaterDate(a.date)}</time></dd>
                </div>
                {a.modifie && (
                  <div>
                    <dt className="rail__libelle">Mis à jour le</dt>
                    <dd><time dateTime={a.modifie}>{formaterDate(a.modifie)}</time></dd>
                  </div>
                )}
                <div>
                  <dt className="rail__libelle">Lecture</dt>
                  <dd>{a.minutes} min</dd>
                </div>
              </dl>
              <Partage titre={a.titre} url={url} colonne />
            </div>
          </aside>

          <div className="article__centre">
            <header className="article__entete">
              <div className="article__fil">
                {a.etiquette && <span className="etiquette">{a.etiquette}</span>}
                <Link href={`/rubrique/${a.rubriqueSlug}`} className="rubrique-lien">{a.rubrique}</Link>
              </div>
              <h1 className="article__titre">{a.titre}</h1>
              {a.chapo && <p className="article__chapo">{a.chapo}</p>}
              {/* Sur mobile, les infos de la colonne gauche s'affichent ici */}
              <div className="article__meta">
                <span>Par <strong>{a.auteur}</strong></span>
                <time dateTime={a.date}>{formaterDate(a.date)}</time>
                {a.modifie && <span>Mis à jour le {formaterDate(a.modifie)}</span>}
                <span>{a.minutes} min de lecture</span>
              </div>
            </header>

            {a.image && (
              <figure className="article__figure">
                <div className="couverture">
                  <Image src={a.image} alt={a.legende ?? a.titre} fill priority sizes="(max-width: 900px) 100vw, 720px" />
                </div>
                {a.legende && <figcaption>{a.legende}</figcaption>}
              </figure>
            )}

            <div className="prose" dangerouslySetInnerHTML={{ __html: a.html }} />

            <div className="article__pied">
              <Partage titre={a.titre} url={url} />
            </div>
          </div>

          {/* Colonne droite : sommaire + derniers articles (grand écran) */}
          <aside className="article__droite" aria-label="Navigation">
            <div className="rail">
              {a.sommaire.length >= 2 && (
                <nav className="sommaire" aria-label="Sommaire">
                  <p className="rail__titre">Sommaire</p>
                  <ol>
                    {a.sommaire.map((s) => (
                      <li key={s.id}><a href={`#${s.id}`}>{s.texte}</a></li>
                    ))}
                  </ol>
                </nav>
              )}
              {recents.length > 0 && (
                <div className="recents">
                  <p className="rail__titre">Les plus récents</p>
                  <ul>
                    {recents.map((x) => (
                      <li key={x.slug}>
                        <Link href={`/articles/${x.slug}`}>{x.titre}</Link>
                        <span>{x.rubrique}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {aLire.length > 0 && (
        <div className="conteneur">
          <div className="hachures" />
          <h2 className="section__titre section__titre--centre">À lire aussi</h2>
          <ul className="liste grille-liste">
            {aLire.map((x) => <CarteListe key={x.slug} article={x} />)}
          </ul>
        </div>
      )}
    </>
  );
}
