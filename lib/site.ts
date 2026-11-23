/** Toute l'identité du site au même endroit : à personnaliser. */
export const site = {
  nom: "Kitablog",
  // Logo bicolore : 1re partie en couleur du texte, 2e en couleur d'accent
  logo: ["kita", "blog"],
  slogan: "Décrypter les concepts, analyser le pouvoir, éveiller les consciences",
  description:
    "Science politique accessible : fiches de cours, analyses de l'actualité en Côte d'Ivoire, en Afrique et dans le monde, recherche et tribunes.",
  url: "https://ivoirblog.vercel.app",
  // Les quatre espaces du blog = rubriques (ordre d'affichage)
  rubriques: ["Notes d'Amphi", "L'Œil du Politiste", "Politic Lab", "La Tribune"],
  descriptions: {
    "Notes d'Amphi":
      "La démocratisation du savoir : des fiches pédagogiques et structurées sur les concepts fondamentaux de la science politique.",
    "L'Œil du Politiste":
      "Le décryptage stratégique de l'actualité, en Côte d'Ivoire, en Afrique et dans le monde.",
    "Politic Lab":
      "Le laboratoire de la recherche : revues d'articles scientifiques, notes de lecture et travaux de réflexion.",
    "La Tribune":
      "L'espace de co-construction intellectuelle, ouvert aux étudiants, jeunes chercheurs et passionnés.",
  } as Record<string, string>,
  reseaux: {
    facebook: "https://facebook.com/",
    x: "https://x.com/",
    whatsapp: "https://wa.me/",
  },
  // Bandeau d'appel en bas d'écran
  appel: {
    texte: "Étudiant, chercheur ou passionné ?",
    accent: "Écrivez dans La Tribune",
    bouton: "Proposer un texte",
    lien: "/a-propos#contribuer",
  },
};
