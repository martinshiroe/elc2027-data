import { ImagePublique } from './ImagePublique';
import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { contenuDe } from '../data/contenu';
import {
  Conteneur,
  EnTetePage,
  BandePlanete,
  Carte,
  TitreCarte,
  TitreSection,
  LienPage,
  initiales,
} from './ui';
import { reseauxRenseignes } from './ReseauxSociaux';
import { CarteFaitMarquant } from './CarteFaitMarquant';

interface PageAProposProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
}

export const PageAPropos: React.FC<PageAProposProps> = ({ data, onNaviguer }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const { apropos, faitMarquant } = contenuDe(data);
  const email = data.meta.contact?.email;
  const reseaux = reseauxRenseignes(data.meta.reseaux);

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <h1 className="titre max-w-3xl text-[1.6rem] sm:text-5xl lg:text-[3.4rem]">{texteSite("Ligue régionale d'esport de l'Est Cameroun")}<span className="mt-2 block">{texteSite("ELC — East League of Cameroun")}</span>
          </h1>
          <p className="mt-6 text-lg font-semibold italic text-white sm:text-xl">{texteSite("Délégation Régionale de l'Est, FECASES")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LienPage section="classements" onNaviguer={onNaviguer} bouton="plein" className="uppercase tracking-[0.12em]">{texteSite("Voir les classements")}</LienPage>
            <LienPage section="contact" onNaviguer={onNaviguer} bouton="contour" className="uppercase tracking-[0.12em]">{texteSite("Nous contacter")}</LienPage>
          </div>
        </Conteneur>
      </EnTetePage>

      {/* ---------- Qui nous sommes ---------- */}
      <BandePlanete className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre={"Qui nous sommes"} titre={apropos.accroche} className="mb-6 sm:mb-8">
            {texteSite(apropos.presentation)}
          </TitreSection>
          <ul className="grid gap-5 md:grid-cols-3">
            {texteSite(apropos.piliers.map((p) => (
              <li key={p.titre}>
                <Carte className="h-full p-5 sm:p-6">
                  <TitreCarte className="mb-4">{texteSite(p.titre)}</TitreCarte>
                  <p className="leading-relaxed text-texte">{texteSite(p.texte)}</p>
                </Carte>
              </li>
            )))}
          </ul>
        </Conteneur>
      </BandePlanete>

      {/* ---------- Ce que nous faisons ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre={"Ce que nous faisons"} titre={"Compétitions, diffusion et suivi des résultats."} className="mb-6 sm:mb-8" />
          <ul className="grid gap-5 md:grid-cols-3">
            {texteSite(apropos.activites.map((a) => (
              <li key={a.titre}>
                <Carte className="h-full p-5 sm:p-6">
                  <TitreCarte className="mb-4">{texteSite(a.titre)}</TitreCarte>
                  <p className="leading-relaxed text-texte">{texteSite(a.texte)}</p>
                </Carte>
              </li>
            )))}
          </ul>
          <Carte className="mt-5 p-5 sm:p-6">
            <TitreCarte className="mb-4">{texteSite(apropos.competition.titre)}</TitreCarte>
            <p className="leading-relaxed text-texte">{texteSite(apropos.competition.texte)}</p>
            {texteSite(apropos.competition.projet && <p className="mt-4 text-sm leading-relaxed text-doux">{texteSite(apropos.competition.projet)}</p>)}
          </Carte>
        </Conteneur>
      </section>

      {/* ---------- Bureau exécutif ---------- */}
      <section className="py-10 sm:py-16" aria-labelledby="titre-bureau">
        <Conteneur>
          <TitreSection
            id="titre-bureau"
            surtitre={"L'équipe / bureau exécutif"}
            titre={"Des noms, des rôles, une même ambition."}
            className="mb-6 sm:mb-8"
          >{texteSite("Le bureau exécutif, selon la liste du ")}{texteSite(apropos.dateBureau)}{texteSite(".")}</TitreSection>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {texteSite(apropos.bureau.map((m) => (
              <li key={m.nom}>
                <Carte className="flex h-full flex-col p-5">
                  {texteSite(m.photo ? (
                    <ImagePublique
                      src={imageSite(m.photo)}
                      alt={texteSite(`Portrait de ${m.nom}`)}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="mb-5 aspect-[4/3] w-full border border-bord object-cover object-top"
                    />
                  ) : (
                    <div className="mb-5 flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="titre flex h-16 w-16 items-center justify-center border border-bord-fort bg-carte-haute text-2xl text-doux"
                       
                      >
                        {texteSite(initiales(m.nom))}
                      </span>
                      <span className="text-xs text-doux">{texteSite("Portrait non disponible")}</span>
                    </div>
                  ))}
                  <TitreCarte className="mb-auto">{texteSite(m.nom)}</TitreCarte>
                  <p className="mt-5 font-extrabold italic uppercase text-magenta">{texteSite(m.role)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-doux">
                    {texteSite(m.biographie || 'Biographie non disponible pour le moment.')}
                  </p>
                </Carte>
              </li>
            )))}
          </ul>
          <Carte className="mt-5 p-5 sm:p-6">
            <TitreCarte className="mb-4">{texteSite(apropos.production.titre)}</TitreCarte>
            <p className="leading-relaxed text-texte">{texteSite(apropos.production.texte)}</p>
          </Carte>
        </Conteneur>
      </section>

      {/* ---------- Communauté et joueurs ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection
            surtitre={"Communauté et joueurs"}
            titre={"Des équipes et des joueurs qui font vivre la compétition."}
            className="mb-6 sm:mb-8"
          />
          {texteSite(apropos.equipes.length > 0 ? (
            <>
              <ul className="grid gap-5 md:grid-cols-3">
                {texteSite(apropos.equipes.map((e) => (
                  <li key={e}>
                    <Carte className="px-6 py-5">
                      <p className="titre text-xl sm:text-2xl">{texteSite(e)}</p>
                    </Carte>
                  </li>
                )))}
              </ul>
              <div className="mt-5">
                <CarteFaitMarquant fait={faitMarquant} compact />
              </div>
            </>
          ) : (
            <Carte className="px-6 py-12 text-center sm:px-16">
              <p className="mb-5 flex items-center justify-center gap-3 text-2xl font-extrabold italic text-magenta">
                <span aria-hidden="true" className="h-0.5 w-10 bg-magenta" />{texteSite("ELC")}<span aria-hidden="true" className="h-0.5 w-10 bg-magenta" />
              </p>
              <TitreCarte className="mb-5 text-2xl sm:text-[1.7rem]">{texteSite("Aucune présentation disponible pour le moment.")}</TitreCarte>
              <p className="mx-auto mb-7 max-w-2xl leading-relaxed text-texte">{texteSite("Les présentations de la communauté et des partenaires locaux ne sont pas encore disponibles à la publication. Pour échanger avec la ligue, contactez-nous.")}</p>
              <LienPage section="contact" onNaviguer={onNaviguer} bouton="plein">{texteSite("Nous contacter")}</LienPage>
            </Carte>
          ))}
        </Conteneur>
      </section>

      {/* ---------- Partenaires ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection
            surtitre={"Partenaires et soutiens"}
            titre={"Affiliation institutionnelle et partenaires locaux."}
            className="mb-6 sm:mb-8"
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {texteSite(apropos.partenaires.map((p, i) => (
              <li key={p.titre}>
                <Carte haute={i === apropos.partenaires.length - 1} className="h-full p-6">
                  {p.logo && (/^https?:\/\//i.test(p.url?.trim() ?? '') && urlSure(p.url) ? (
                    <a href={urlSure(p.url)} target="_blank" rel="noopener noreferrer" aria-label={`Visiter ${p.titre} (nouvel onglet)`} className="mb-5 flex min-h-28 items-center justify-center rounded-lg border border-bord-fort bg-white/5 p-4 transition-colors hover:border-magenta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-magenta">
                      <ImagePublique src={imageSite(p.logo)} alt={`Logo ${p.titre}`} loading="lazy" referrerPolicy="no-referrer" className="h-24 w-full object-contain" />
                    </a>
                  ) : <ImagePublique src={imageSite(p.logo)} alt={`Logo ${p.titre}`} loading="lazy" referrerPolicy="no-referrer" className="mb-5 h-24 w-full object-contain" />)}
                  <TitreCarte className="mb-4">{texteSite(p.titre)}</TitreCarte>
                  <p className="leading-relaxed text-texte">{texteSite(p.texte)}</p>
                  {/^https?:\/\//i.test(p.url?.trim() ?? '') && urlSure(p.url) && <a href={urlSure(p.url)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-bold text-magenta underline underline-offset-4">Visiter {texteSite(p.titre)}<span className="sr-only"> (nouvel onglet)</span></a>}
                </Carte>
              </li>
            )))}
          </ul>
        </Conteneur>
      </section>

      {/* ---------- Contact et réseaux ---------- */}
      <section className="pb-14 pt-10 sm:pb-20 sm:pt-16">
        <Conteneur>
          <TitreSection surtitre={"Contact et réseaux"} titre={"Bertoua, Est Cameroun."} className="mb-6 sm:mb-8" />
          <div className="grid gap-5 md:grid-cols-2">
            <Carte className="p-6">
              <p className="mb-2 font-extrabold italic uppercase text-magenta">{texteSite("Email officiel")}</p>
              {texteSite(email ? (
                <a href={`mailto:${email}`} className="inline-block break-all py-1.5 text-white underline decoration-magenta/60 underline-offset-4 hover:decoration-magenta">
                  {texteSite(email)}
                </a>
              ) : (
                <p className="text-texte">{texteSite("À fournir")}</p>
              ))}
            </Carte>
            <Carte className="p-6">
              <p className="mb-2 font-extrabold italic uppercase text-magenta">{texteSite("Réseaux")}</p>
              {texteSite(reseaux.length > 0 ? (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {texteSite(reseaux.map((r) => (
                    <li key={r.cle}>
                      <a
                        href={urlSure(data.meta.reseaux[r.cle] ?? '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1.5 text-white underline decoration-magenta/60 underline-offset-4 hover:decoration-magenta"
                      >
                        {texteSite(r.nom)}
                        <span className="sr-only">{texteSite(" (nouvel onglet)")}</span>
                      </a>
                    </li>
                  )))}
                </ul>
              ) : (
                <p className="text-texte">{texteSite("YouTube, TikTok, Facebook, WhatsApp : liens à fournir")}</p>
              ))}
            </Carte>
          </div>
          <Carte haute className="mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <TitreCarte className="mb-2">{texteSite("Formulaire de contact")}</TitreCarte>
              <p className="text-texte">{texteSite("Une question ou une envie de collaboration ? Écrivez-nous.")}</p>
            </div>
            <LienPage section="contact" onNaviguer={onNaviguer} bouton="contour" className="shrink-0">{texteSite("Formulaire de contact")}</LienPage>
          </Carte>
        </Conteneur>
      </section>
    </>
  );
};

export default PageAPropos;
