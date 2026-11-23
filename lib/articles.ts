import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { slugify } from "./slug";

const DOSSIER = path.join(process.cwd(), "content", "articles");

export type Article = {
  slug: string;
  titre: string;
  chapo: string;
  date: string; // ISO AAAA-MM-JJ — publication
  modifie?: string; // ISO AAAA-MM-JJ — dernière mise à jour (facultatif)
  rubrique: string;
  rubriqueSlug: string;
  image?: string;
  legende?: string;
  etiquette?: string; // badge rouge, ex. « Décryptage »
  auteur: string;
  auteurPhoto?: string;
  une: boolean;
  minutes: number;
};

export type Intertitre = { id: string; texte: string };
export type ArticleComplet = Article & { html: string; sommaire: Intertitre[] };

const enIso = (v: unknown) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v) : "";

/** Ajoute un id à chaque intertitre <h2> et en tire le sommaire. */
function avecSommaire(html: string): { html: string; sommaire: Intertitre[] } {
  const sommaire: Intertitre[] = [];
  const vus = new Set<string>();
  const sortie = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, interieur: string) => {
    const texte = interieur.replace(/<[^>]+>/g, "").replace(/&#39;/g, "’").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").trim();
    let id = slugify(texte) || "section";
    while (vus.has(id)) id += "-2";
    vus.add(id);
    sommaire.push({ id, texte });
    return `<h2 id="${id}">${interieur}</h2>`;
  });
  return { html: sortie, sommaire };
}

function lireFichier(fichier: string): ArticleComplet {
  const brut = fs.readFileSync(path.join(DOSSIER, fichier), "utf8");
  const { data, content } = matter(brut);
  const slug = fichier.replace(/\.md$/, "");
  const rubrique = String(data.rubrique ?? "Vie politique");
  const mots = content.split(/\s+/).filter(Boolean).length;
  const date = enIso(data.date);
  const modifie = enIso(data.modifie);
  const { html, sommaire } = avecSommaire(marked.parse(content, { async: false }));

  return {
    slug,
    titre: String(data.titre ?? slug),
    chapo: String(data.chapo ?? ""),
    date,
    modifie: modifie && modifie !== date ? modifie : undefined,
    rubrique,
    rubriqueSlug: slugify(rubrique),
    image: data.image ? String(data.image) : undefined,
    legende: data.legende ? String(data.legende) : undefined,
    etiquette: data.etiquette ? String(data.etiquette) : undefined,
    auteur: String(data.auteur ?? "La rédaction"),
    auteurPhoto: data.auteurPhoto ? String(data.auteurPhoto) : undefined,
    une: Boolean(data.une),
    minutes: Math.max(1, Math.round(mots / 220)),
    html,
    sommaire,
  };
}

/** Tous les articles, du plus récent au plus ancien. */
export function tousLesArticles(): ArticleComplet[] {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(lireFichier)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function articleParSlug(slug: string): ArticleComplet | undefined {
  return tousLesArticles().find((a) => a.slug === slug);
}

export function articlesDeRubrique(rubriqueSlug: string): ArticleComplet[] {
  return tousLesArticles().filter((a) => a.rubriqueSlug === rubriqueSlug);
}

export function formaterDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Page éditoriale libre (ex. content/pages/a-propos.md). */
export function pageMarkdown(nom: string): string {
  const fichier = path.join(process.cwd(), "content", "pages", `${nom}.md`);
  if (!fs.existsSync(fichier)) return "";
  // Permet d'écrire « ## Titre {#ancre} » pour fixer l'ancre d'un intertitre
  const html = marked.parse(matter(fs.readFileSync(fichier, "utf8")).content, { async: false });
  return html.replace(/<h2>([\s\S]*?)\s*\{#([a-z0-9-]+)\}<\/h2>/g, '<h2 id="$2">$1</h2>');
}
