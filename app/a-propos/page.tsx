import type { Metadata } from "next";
import Image from "next/image";
import { pageMarkdown } from "@/lib/articles";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "À propos", description: site.description };

export default function APropos() {
  return (
    <article className="conteneur article">
      <div className="presentation">
        <aside>
          <div className="rail">
            <div className="presentation__photo">
              <Image src="/images/portrait-fondatrice.jpg" alt="La fondatrice d’I Speak Politics au pupitre" fill priority sizes="(max-width: 900px) 100vw, 320px" />
            </div>
          </div>
        </aside>
        <div>
          <header className="article__entete">
            <span className="etiquette">À propos</span>
            <h1 className="article__titre">I Speak Politics</h1>
            <p className="article__chapo">{site.slogan}.</p>
          </header>
          <div className="prose" dangerouslySetInnerHTML={{ __html: pageMarkdown("a-propos") }} />
        </div>
      </div>
    </article>
  );
}
