import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { Conteneur, EnTetePage, Carte, TitreCarte, TitreSection, Bouton, BoutonLien, LienPage, Avis, Pastille } from './ui';

interface PageInscriptionProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
  onOpenRegulations: () => void;
}

const CONDITIONS = [
  {
    n: '01',
    titre: 'Conditions requises',
    texte:
      "Être résident au Cameroun (priorité Est Cameroun). Disposer d'un compte valide sur le jeu concerné et d'une connexion stable.",
  },
  {
    n: '02',
    titre: "Composition d'équipe",
    texte:
      'MOBA (Honor of Kings, Mobile Legends) : 5 titulaires et 2 remplaçants au maximum. Battle Royale (PUBG Mobile, Free Fire) : solo, duo ou squad selon le tournoi.',
  },
  {
    n: '03',
    titre: 'Validation FECASES',
    texte:
      "Chaque inscription est vérifiée par la commission technique pour garantir l'équité sportive et le respect du fair-play.",
  },
];

export const PageInscription: React.FC<PageInscriptionProps> = ({ data, onNaviguer, onOpenRegulations }) => {
  const { meta } = data;
  const formulaire = meta.googleFormUrl || '';
  const whatsapp = meta.reseaux?.whatsapp;

  return (
    <>
      <EnTetePage image={meta.inscriptionBannerImage ? urlSure(meta.inscriptionBannerImage) : undefined}>
        <Conteneur>
          <p className="surtitre mb-4">Saison {meta.saison || '2027'} · Inscriptions</p>
          <h1 className="titre text-[2.3rem] sm:text-5xl lg:text-[3.6rem]">
            Entre dans
            <span className="block">la compétition.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-texte">
            Inscrivez votre équipe (Honor of Kings, Mobile Legends) ou votre joueur (PUBG Mobile, Free Fire). Compétition
            organisée par la Ligue Esport Est Cameroun, affiliée à la FECASES.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {formulaire && (
              <BoutonLien href={urlSure(formulaire)} target="_blank" rel="noopener noreferrer">
                Je m'inscris
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </BoutonLien>
            )}
            <Bouton variante={formulaire ? 'contour' : 'plein'} type="button" onClick={onOpenRegulations}>
              Règlement FECASES
            </Bouton>
          </div>
        </Conteneur>
      </EnTetePage>

      <section className="pb-14 sm:pb-16">
        <Conteneur>
          <TitreSection surtitre="Avant de commencer" titre="Ce qu'il faut savoir." className="mb-8" />
          <ol className="grid gap-5 md:grid-cols-3">
            {CONDITIONS.map((c) => (
              <li key={c.n}>
                <Carte className="h-full p-6">
                  <p className="titre mb-4 text-3xl text-magenta">{c.n}</p>
                  <TitreCarte className="mb-3">{c.titre}</TitreCarte>
                  <p className="leading-relaxed text-texte">{c.texte}</p>
                </Carte>
              </li>
            ))}
          </ol>
        </Conteneur>
      </section>

      <section className="pb-20 pt-6">
        <Conteneur>
          <Carte haute className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bord-fort px-6 py-5">
              <TitreCarte niveau={2} className="text-xl sm:text-2xl">Formulaire d'inscription officiel</TitreCarte>
              <Pastille className={formulaire ? 'border-magenta' : ''}>{formulaire ? 'Formulaire ouvert' : 'Bientôt disponible'}</Pastille>
            </div>

            {formulaire ? (
              /* Pas d'iframe : le formulaire collecte des fichiers (CNI,
                 captures de compte), ce qui oblige Google à demander une
                 connexion. La page de connexion répond X-Frame-Options: DENY
                 et ne s'affiche jamais dans un cadre. On ouvre un nouvel onglet. */
              <div className="mx-auto max-w-2xl px-6 py-10 text-center">
                <img
                  src={urlSure(meta.formBannerImage || '/img/bandeau-inscription.png')}
                  alt="ELC — inscriptions ouvertes"
                  width={1600}
                  height={400}
                  className="mb-8 block h-auto w-full border border-bord-fort"
                />
                <p className="text-lg leading-relaxed text-texte">
                  Équipes MOBA et joueurs Battle Royale : renseignez vos informations, votre pièce d'identité et la capture
                  de votre compte de jeu.
                </p>
                <Avis titre="Prévoyez un compte Google" className="mt-6 text-left">
                  Il est exigé par le formulaire pour l'envoi des pièces justificatives.
                </Avis>
                <BoutonLien href={urlSure(formulaire)} target="_blank" rel="noopener noreferrer" className="mt-8">
                  Je m'inscris
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </BoutonLien>
                <p className="mt-4 text-sm text-doux">Le formulaire s'ouvre dans un nouvel onglet.</p>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl px-6 py-12 text-center">
                <TitreCarte className="mb-4 text-2xl">Les inscriptions ouvrent bientôt.</TitreCarte>
                <p className="mb-8 leading-relaxed text-texte">
                  Vous pouvez dès maintenant contacter le comité d'organisation pour pré-enregistrer votre équipe.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {whatsapp && (
                    <BoutonLien href={urlSure(whatsapp)} target="_blank" rel="noopener noreferrer">
                      Contacter sur WhatsApp
                    </BoutonLien>
                  )}
                  <LienPage section="contact" onNaviguer={onNaviguer} bouton={whatsapp ? 'contour' : 'plein'}>
                    Formulaire de contact
                  </LienPage>
                </div>
              </div>
            )}
          </Carte>
          {formulaire && whatsapp && (
            <p className="mt-6 text-center text-doux">
              Une question sur l'inscription ?{' '}
              <a href={urlSure(whatsapp)} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-magenta underline-offset-4">
                Assistance WhatsApp
              </a>
            </p>
          )}
        </Conteneur>
      </section>
    </>
  );
};

export default PageInscription;
