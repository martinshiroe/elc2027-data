import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { Section } from '../lib/routes';
import { Conteneur, EnTetePage, LienPage, Trait } from './ui';

export const PageIntrouvable: React.FC<{ onNaviguer: (section: Section, jeu?: string) => void }> = ({ onNaviguer }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();
return (
  <EnTetePage className="min-h-[78vh]">
    <Conteneur className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,500px)]">
      <div>
        <p className="surtitre mb-4">{texteSite("Page introuvable")}</p>
        <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.1rem]">{texteSite("Vous avez quitté")}<span className="block">{texteSite("le terrain.")}</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-texte sm:text-lg">{texteSite("Cette page n'existe pas ou n'est plus accessible à cette adresse. Retrouvez l'accueil ou découvrez la ligue.")}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <LienPage section="accueil" onNaviguer={onNaviguer} bouton="plein">{texteSite("Retour à l'accueil")}</LienPage>
          <LienPage section="apropos" onNaviguer={onNaviguer} bouton="contour">{texteSite("À propos")}</LienPage>
        </div>
        <Trait className="mt-8" />
        <p className="mt-5 text-sm leading-relaxed text-doux">{texteSite("ELC · Bertoua, Est Cameroun")}<br />{texteSite("Délégation régionale de l'Est, FECASES.")}</p>
      </div>

      {/* Visuel « 404 », coins coupés et liseré magenta comme sur la maquette */}
      <div className="coins-coupes relative bg-magenta p-0.5" aria-hidden="true">
        <div className="coins-coupes relative isolate flex aspect-[6/5] flex-col items-center justify-center overflow-hidden bg-nuit">
          <ImagePublique src={imageSite("/img/hero-joueur.webp")} alt={texteSite("")} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 -z-10 bg-nuit/25" />
          <p className="titre text-[6.5rem] leading-none drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] sm:text-[9rem]">{texteSite("404")}</p>
          <p className="mt-4 text-sm font-extrabold italic uppercase tracking-[0.2em] text-white">{texteSite("Retour dans la partie")}</p>
        </div>
      </div>
    </Conteneur>
  </EnTetePage>
);};

export default PageIntrouvable;
