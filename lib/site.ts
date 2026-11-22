/** Toute l'identité du site au même endroit : à personnaliser. */
export const site = {
  nom: "Kitablog",
  // Logo bicolore : 1re partie en couleur du texte, 2e en couleur d'accent
  logo: ["kita", "blog"],
  slogan: "L'actualité politique, expliquée clairement",
  description:
    "Kitablog : actualités, analyses et prises de position sur la vie politique.",
  url: "https://ivoirblog.vercel.app",
  // Rubriques affichées en puces (ordre d'affichage)
  rubriques: [
    "Vie politique",
    "Programme",
    "Terrain",
    "Économie",
    "Société",
    "Communiqués",
  ],
  reseaux: {
    facebook: "https://facebook.com/",
    x: "https://x.com/",
    whatsapp: "https://wa.me/",
  },
  // Bandeau d'appel en bas d'écran (façon « deux mois offerts »)
  appel: {
    texte: "Vous partagez ces idées ?",
    accent: "Rejoignez l'équipe",
    bouton: "Je m'engage",
    lien: "/a-propos#rejoindre",
  },
} as const;
