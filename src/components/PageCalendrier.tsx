import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { ArrowRight, ExternalLink, Smartphone, Tv, Users, Swords } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { lienChallengermode } from '../lib/vitrine';
import { urlSure } from '../lib/urls';
import { Conteneur, EnTetePage, Carte, TitreCarte, TitreSection, LienPage, Bouton, BoutonLien } from './ui';
import { BlocPhases, BlocInscription, jeuxActifs, nombreDeJeux } from './Blocs';

interface PageCalendrierProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
  onOpenRegulations: () => void;
}

export const PageCalendrier: React.FC<PageCalendrierProps> = ({ data, onNaviguer, onOpenRegulations }) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const v2 = data.visual2;
  const lien = lienChallengermode(data.meta.challengermodeUrl);

  return (
    <>
      <EnTetePage>
        <Conteneur>
          <p className="surtitre mb-4">{texteSite("Calendrier · Saison ")}{texteSite(data.meta.saison || '2027')}</p>
          <h1 className="titre text-[1.7rem] sm:text-5xl lg:text-[3.6rem]">{texteSite("Une saison.")}<span className="block">{texteSite(nombreDeJeux(jeuxActifs(data).length, 'discipline'))}{texteSite(".")}</span>
          </h1>
          {texteSite(v2?.bandeauSousTitre && <p className="mt-6 max-w-3xl text-base leading-relaxed text-texte sm:text-lg">{texteSite(v2.bandeauSousTitre)}{texteSite(".")}</p>)}
          <div className="mt-8 flex flex-wrap gap-4">
            {texteSite(lien && (
              <BoutonLien href={lien} target="_blank" rel="noopener noreferrer">{texteSite("Suivre sur Challengermode")}<ExternalLink className="h-4 w-4" aria-hidden="true" />
              </BoutonLien>
            ))}
            <Bouton variante={lien ? 'contour' : 'plein'} type="button" onClick={onOpenRegulations}>{texteSite("Règlement FECASES")}</Bouton>
          </div>
        </Conteneur>
      </EnTetePage>

      <section className="pb-10 sm:pb-16">
        <Conteneur>
          <BlocPhases data={data} />
        </Conteneur>
      </section>

      {/* ---------- Par discipline ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre={"Par discipline"} titre={"Les dates de chaque jeu."} className="mb-6 sm:mb-8" />
          <ul className="grid gap-5 md:grid-cols-2">
            {texteSite(jeuxActifs(data).map((j) => {
              const jeu = data.competition?.[j.id];
              return (
                <li key={j.id}>
                  <Carte className="flex h-full flex-col p-6">
                    <p className="surtitre mb-2 text-[0.68rem]">{texteSite(j.famille)}{j.id !== 'hok' && j.id !== 'mlbb' ? ' · Calendrier prévisionnel' : ' · Calendrier confirmé'}</p>
                    <TitreCarte className="mb-5 text-xl sm:text-2xl">{texteSite(j.nom)}</TitreCarte>
                    <ol className="mb-6 divide-y divide-bord">
                      {texteSite((jeu?.calendrier ?? []).map((c, i) => (
                        <li key={i} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                          <span className="font-semibold text-white">{texteSite(c.phase)}</span>
                          <span className="shrink-0 text-sm text-doux">
                            {texteSite(c.periode)}
                            {texteSite(c.lieu ? ` · ${c.lieu}` : '')}
                          </span>
                        </li>
                      )))}
                    </ol>
                    <LienPage
                      section="joueurs"
                      jeu={j.id}
                      onNaviguer={onNaviguer}
                      className="mt-auto inline-flex items-center gap-2 self-start font-bold italic text-magenta hover:underline"
                    >{texteSite("Découvrir les joueurs ")}{texteSite(j.court)}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </LienPage>
                  </Carte>
                </li>
              );
            }))}
          </ul>
        </Conteneur>
      </section>

      {/* ---------- Format ---------- */}
      <section className="py-10 sm:py-16">
        <Conteneur>
          <TitreSection surtitre={"Informations pratiques"} titre={"Suivre les rendez-vous de la ligue."} className="mb-6 sm:mb-8" />
          <div className="grid gap-5 md:grid-cols-2">
            {texteSite(v2?.plateformes && (
              <Carte className="flex gap-4 p-6">
                <Smartphone className="h-6 w-6 shrink-0 text-magenta" aria-hidden="true" />
                <p className="leading-relaxed text-texte">{texteSite(v2.plateformes)}</p>
              </Carte>
            ))}
            {texteSite(v2?.diffusion && (
              <Carte className="flex gap-4 p-6">
                <Tv className="h-6 w-6 shrink-0 text-magenta" aria-hidden="true" />
                <p className="leading-relaxed text-texte">{texteSite(v2.diffusion)}</p>
              </Carte>
            ))}
          </div>
        </Conteneur>
      </section>

      <BlocInscription data={data} onNaviguer={onNaviguer} />
    </>
  );
};

export default PageCalendrier;
