import React, { useRef, useState } from 'react';
import { Check, Loader2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { ELCData } from '../types';
import { Section } from '../lib/routes';
import { urlSure } from '../lib/urls';
import { Conteneur, EnTetePage, TitreCarte, LienPage, Bouton, Trait } from './ui';
import { reseauxRenseignes } from './ReseauxSociaux';

interface PageContactProps {
  data: ELCData;
  onNaviguer: (section: Section, jeu?: string) => void;
}

type Etat = 'saisie' | 'envoi' | 'echec' | 'envoye';
type Champ = 'nom' | 'email' | 'message';

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function verifier(valeurs: Record<Champ, string>): Partial<Record<Champ, string>> {
  const erreurs: Partial<Record<Champ, string>> = {};
  if (!valeurs.nom.trim()) erreurs.nom = 'Indiquez votre nom ou celui de votre équipe.';
  if (!valeurs.email.trim()) erreurs.email = 'Indiquez une adresse email pour recevoir la réponse.';
  else if (!EMAIL_VALIDE.test(valeurs.email.trim()))
    erreurs.email = 'Saisissez une adresse email valide, par exemple nom@exemple.com.';
  if (!valeurs.message.trim()) erreurs.message = "Écrivez votre message avant de l'envoyer.";
  return erreurs;
}

/** « A », « A et B », « A, B et C ». */
const enumerer = (mots: string[]) =>
  mots.length < 2 ? mots.join('') : `${mots.slice(0, -1).join(', ')} et ${mots[mots.length - 1]}`;

const LIBELLES: Record<Champ, string> = { nom: 'Nom / Équipe', email: 'Email', message: 'Message' };

export const PageContact: React.FC<PageContactProps> = ({ data, onNaviguer }) => {
  const [valeurs, setValeurs] = useState<Record<Champ, string>>({ nom: '', email: '', message: '' });
  const [erreurs, setErreurs] = useState<Partial<Record<Champ, string>>>({});
  const [etat, setEtat] = useState<Etat>('saisie');
  const [piege, setPiege] = useState('');
  const resume = useRef<HTMLDivElement>(null);
  const titreConfirmation = useRef<HTMLHeadingElement>(null);

  const email = data.meta.contact?.email;
  const telephone = data.meta.contact?.telephone;
  const reseaux = reseauxRenseignes(data.meta.reseaux);
  const aDesCoordonnees = Boolean(email || telephone || reseaux.length);

  const changer = (champ: Champ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValeurs((v) => ({ ...v, [champ]: e.target.value }));
    // Une erreur corrigée disparaît dès la frappe ; les autres restent.
    if (erreurs[champ]) setErreurs((er) => ({ ...er, [champ]: undefined }));
    if (etat === 'echec') setEtat('saisie');
  };

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (etat === 'envoi') return;
    const trouvees = verifier(valeurs);
    setErreurs(trouvees);
    if (Object.keys(trouvees).length > 0) {
      // Le résumé reçoit le focus : il annonce combien de champs corriger.
      requestAnimationFrame(() => resume.current?.focus());
      return;
    }
    setEtat('envoi');
    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...valeurs, site: piege }),
      });
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
      setEtat('envoye');
      requestAnimationFrame(() => titreConfirmation.current?.focus());
    } catch {
      setEtat('echec');
      requestAnimationFrame(() => resume.current?.focus());
    }
  };

  const recommencer = () => {
    setValeurs({ nom: '', email: '', message: '' });
    setErreurs({});
    setEtat('saisie');
  };

  const nbErreurs = Object.values(erreurs).filter(Boolean).length;
  const champsVides = (Object.keys(erreurs) as Champ[]).filter((c) => erreurs[c] && !valeurs[c].trim());
  const envoiEnCours = etat === 'envoi';

  const classeChamp = (champ: Champ) =>
    `w-full border bg-encre px-4 py-3.5 text-white placeholder:text-doux/80 focus:outline-none disabled:opacity-70 ${
      erreurs[champ] ? 'border-alerte focus:border-alerte' : 'border-bord-champ focus:border-magenta'
    }`;

  return (
    <EnTetePage className="min-h-[80vh]">
      <Conteneur>
        <p className="surtitre mb-3">Contact et réseaux</p>
        <h1 className="titre text-[1.6rem] sm:text-5xl">Bertoua, Est Cameroun.</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,330px)_1fr] lg:gap-12">
          {/* ---------- Colonne de gauche ---------- */}
          <div>
            <h2 className="titre text-2xl">Échangeons.</h2>
            <p className="mt-5 text-base leading-relaxed text-texte sm:text-lg">
              Une question ou une envie de collaboration ? Écrivez-nous via le formulaire.
            </p>
            <Trait className="my-6" />
            <p className="font-bold italic text-white">Bertoua, Est Cameroun.</p>
            <p className="mt-3 text-doux">Délégation régionale de l'Est, FECASES.</p>
            {aDesCoordonnees ? (
              <ul className="mt-5 space-y-2 text-sm">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="inline-block break-all py-1.5 text-white underline decoration-magenta/60 underline-offset-4 hover:decoration-magenta">
                      {email}
                    </a>
                  </li>
                )}
                {telephone && (
                  <li>
                    <a href={`tel:${telephone.replace(/\s/g, '')}`} className="inline-block py-1.5 text-white underline decoration-magenta/60 underline-offset-4 hover:decoration-magenta">
                      {telephone}
                    </a>
                  </li>
                )}
                {reseaux.length > 0 && (
                  <li className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                    {reseaux.map((r) => (
                      <a
                        key={r.cle}
                        href={urlSure(data.meta.reseaux[r.cle] ?? '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1.5 text-doux hover:text-white"
                      >
                        {r.nom}
                        <span className="sr-only"> (nouvel onglet)</span>
                      </a>
                    ))}
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-doux">
                Les coordonnées et liens officiels ne sont pas encore disponibles. Le formulaire reste votre point de
                contact.
              </p>
            )}
          </div>

          {/* ---------- Formulaire ---------- */}
          <div className="border border-bord-fort bg-carte-haute p-6 sm:p-7">
            {etat === 'envoye' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center">
                <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-magenta text-white">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 ref={titreConfirmation} tabIndex={-1} className="titre text-2xl focus:outline-none sm:text-[1.9rem]">
                  Votre message a été envoyé.
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-texte sm:text-lg">
                  Merci d'avoir contacté la ligue. Vous pouvez poursuivre votre visite ou écrire un nouveau message.
                </p>
                <Trait className="mx-auto my-7" />
                <div className="flex flex-wrap justify-center gap-4">
                  <LienPage section="accueil" onNaviguer={onNaviguer} bouton="plein">
                    Retour au site
                  </LienPage>
                  <Bouton variante="contour" type="button" onClick={recommencer}>
                    Nouveau message
                  </Bouton>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={envoyer} aria-busy={envoiEnCours}>
                <TitreCarte niveau={2} className="text-xl sm:text-2xl">
                  Formulaire de contact
                </TitreCarte>
                <p className="mt-3 text-sm text-doux">Tous les champs sont requis.</p>

                {/* Bandeau d'état : erreurs, envoi en cours, échec. */}
                <div ref={resume} tabIndex={-1} aria-live="polite" className="focus:outline-none">
                  {nbErreurs > 0 && etat === 'saisie' && (
                    <div role="alert" className="mt-5 flex gap-4 border border-alerte bg-[#2c1018] px-5 py-4">
                      <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-alerte" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-alerte">
                          {nbErreurs > 1 ? `Vérifiez les ${nbErreurs} champs avant l'envoi.` : "Vérifiez ce champ avant l'envoi."}
                        </p>
                        <p className="mt-1 text-sm text-texte">
                          {champsVides.length > 0 &&
                            `${enumerer(champsVides.map((c) => LIBELLES[c]))} ${champsVides.length > 1 ? 'sont vides' : 'est vide'}. `}
                          {erreurs.email && valeurs.email.trim() && "L'adresse email doit être corrigée."}
                        </p>
                      </div>
                    </div>
                  )}
                  {envoiEnCours && (
                    <div className="mt-5 flex gap-4 border border-bord-fort bg-carte px-5 py-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-magenta text-white">
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold text-white">Votre message est en cours d'envoi</p>
                        <p className="mt-1 text-sm text-texte">Veuillez patienter. Un seul envoi est en cours.</p>
                      </div>
                    </div>
                  )}
                  {etat === 'echec' && (
                    <div role="alert" className="mt-5 flex gap-4 border border-alerte bg-[#2c1018] px-5 py-4">
                      <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-alerte" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-alerte">Le message n'a pas été envoyé</p>
                        <p className="mt-1 text-sm text-texte">
                          L'envoi a échoué. Vos informations sont conservées ; vous pouvez réessayer
                          {email ? (
                            <>
                              {' '}ou écrire directement à{' '}
                              <a href={`mailto:${email}`} className="text-white underline underline-offset-2">
                                {email}
                              </a>
                            </>
                          ) : null}
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Piège à robots : invisible, ignoré des lecteurs d'écran. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Site web
                    <input tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
                  </label>
                </div>

                <div className="mt-6 space-y-5">
                  {(['nom', 'email'] as const).map((champ) => (
                    <div key={champ}>
                      <label htmlFor={`contact-${champ}`} className="mb-2 block text-xs font-extrabold italic uppercase tracking-wide text-white">
                        {LIBELLES[champ]} <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`contact-${champ}`}
                        type={champ === 'email' ? 'email' : 'text'}
                        autoComplete={champ === 'email' ? 'email' : 'organization'}
                        value={valeurs[champ]}
                        onChange={changer(champ)}
                        disabled={envoiEnCours}
                        required
                        maxLength={champ === 'email' ? 200 : 120}
                        placeholder={champ === 'email' ? 'nom@exemple.com' : 'Nom / Équipe'}
                        aria-invalid={Boolean(erreurs[champ])}
                        aria-describedby={erreurs[champ] ? `contact-${champ}-erreur` : undefined}
                        className={classeChamp(champ)}
                      />
                      {erreurs[champ] && (
                        <p id={`contact-${champ}-erreur`} className="mt-2 text-sm text-alerte">
                          {erreurs[champ]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label htmlFor="contact-message" className="mb-2 block text-xs font-extrabold italic uppercase tracking-wide text-white">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={valeurs.message}
                      onChange={changer('message')}
                      disabled={envoiEnCours}
                      required
                      maxLength={4000}
                      placeholder="Votre message"
                      aria-invalid={Boolean(erreurs.message)}
                      aria-describedby={erreurs.message ? 'contact-message-erreur' : undefined}
                      className={`${classeChamp('message')} resize-y`}
                    />
                    {erreurs.message && (
                      <p id="contact-message-erreur" className="mt-2 text-sm text-alerte">
                        {erreurs.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {envoiEnCours ? (
                    <Bouton type="submit" disabled variante="attente">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Envoi en cours…
                    </Bouton>
                  ) : (
                    <Bouton type="submit">{etat === 'echec' ? 'Réessayer' : 'Envoyer'}</Bouton>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </Conteneur>
    </EnTetePage>
  );
};

export default PageContact;
