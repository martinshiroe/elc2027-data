import React from 'react';
import { ELCData } from '../types';
import { FileText, ExternalLink, CheckCircle, HelpCircle, MessageSquare, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { urlSure, urlCss } from '../lib/urls';

interface PageInscriptionProps {
  data: ELCData;
  onOpenRegulations?: () => void;
}

export const PageInscription: React.FC<PageInscriptionProps> = ({ data, onOpenRegulations }) => {
  const meta = data.meta;
  const googleFormUrl = meta.googleFormUrl || '';
  
  // Format google form embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embedded=true')) return url;
    return `${url}${url.includes('?') ? '&' : '?'}embedded=true`;
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#161616] via-[#121212] to-[#0a0a0a] border border-white/[0.08] p-8 sm:p-12 shadow-2xl">
          {/* Image de fond configurable depuis l'admin, comme l'accueil et le
              Panthéon. Le dégradé par-dessus garde le texte lisible quelle que
              soit l'image choisie ; sans image, le fond dégradé ci-dessus reste
              seul. */}
          {meta.inscriptionBannerImage && (
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url("${urlCss(meta.inscriptionBannerImage)}")` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/95 via-[#0e0e0e]/85 to-[#0e0e0e]/55" />
            </div>
          )}

          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/15 via-rose-500/5 to-transparent rounded-full pointer-events-none blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/25 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saison 2027 — Inscriptions Officielles</span>
            </div>

            <h1 className="font-audiowide text-3xl sm:text-5xl text-white mb-4 leading-tight">
              Rejoignez l'East League of Cameroun
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light mb-8">
              Inscrivez votre équipe (Honor of Kings, Mobile Legends) ou votre joueur (PUBG Mobile, Free Fire) pour la saison 2027. Compétition officielle organisée par la Ligue Esport Est Cameroun et affiliée à la FECASES.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {googleFormUrl && (
                <a
                  href={urlSure(googleFormUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs sm:text-sm transition-all shadow-lg cursor-pointer"
                >
                  <span>Ouvrir le formulaire dans un nouvel onglet</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <a
                href={urlSure(meta.reseaux.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/[0.12] text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Assistance WhatsApp</span>
              </a>

              {onOpenRegulations && (
                <button
                  type="button"
                  onClick={onOpenRegulations}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/[0.08] text-xs font-mono transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Règlement FECASES</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-4 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="font-audiowide text-base text-white mb-2">Conditions requises</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Être résident au Cameroun (priorité Est Cameroun). Disposer d'un compte valide sur le jeu concerné et d'une connexion stable.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="font-audiowide text-base text-white mb-2">Composition d'équipe</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              MOBA (HOK, MLBB) : 5 titulaires + 2 remplaçants maximum. Battle Royale (PUBG, FF) : Solo ou Duo/Squad selon le tournoi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="font-audiowide text-base text-white mb-2">Validation FECASES</h3>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Toutes les inscriptions sont vérifiées par la commission technique pour garantir l'équité sportive et le respect du fair-play.
            </p>
          </div>
        </div>

        {/* Embedded Google Form Section */}
        <div className="rounded-3xl bg-[#141414] border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="px-6 sm:px-8 py-5 border-b border-white/[0.08] bg-[#0e0e0e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-audiowide text-lg text-white">Formulaire d'Inscription Officiel</h2>
                <p className="text-xs text-white/50 font-mono">Google Forms — Saisie sécurisée</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {googleFormUrl ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Formulaire actif</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Lien en attente de configuration</span>
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-8 bg-black/40 min-h-[600px] flex flex-col items-center justify-center">
            {googleFormUrl ? (
              /* Pas d'iframe : le formulaire collecte des fichiers (CNI,
                 captures de compte), ce qui oblige Google à demander une
                 connexion. La page de connexion répond X-Frame-Options: DENY
                 et ne s'affiche donc jamais dans un cadre — l'intégration
                 donnait un rectangle gris. On ouvre dans un nouvel onglet. */
              <div className="max-w-2xl mx-auto text-center py-10 px-6">
                {/* Bandeau du formulaire. Reprend le visuel posé en en-tête du
                    Google Form, pour que le passage du site au formulaire soit
                    continu. Ratio 4:1, comme l'image fournie. */}
                <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl mb-8">
                  <img
                    src={urlSure(meta.formBannerImage || '/img/bandeau-inscription.png')}
                    alt="ELC 2027 — Inscriptions ouvertes"
                    width={1600}
                    height={400}
                    className="w-full h-auto block"
                  />
                </div>

                <h3 className="font-audiowide text-xl text-white mb-3">
                  Le formulaire d'inscription est ouvert
                </h3>

                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-2">
                  Équipes MOBA et joueurs Battle Royale : renseignez vos informations,
                  votre pièce d'identité et la capture de votre compte de jeu.
                </p>

                <p className="text-xs text-white/50 leading-relaxed font-light mb-8">
                  Prévoyez un compte Google : il est exigé par le formulaire pour
                  l'envoi des pièces justificatives.
                </p>

                <a
                  href={urlSure(googleFormUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#14b8a6] hover:opacity-85 text-[#0e0e0e] font-medium text-sm shadow-lg transition-opacity"
                >
                  <span>Je m'inscris</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <p className="text-[11px] text-white/45 mt-6 font-mono">
                  Le formulaire s'ouvre dans un nouvel onglet
                </p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto text-center py-12 px-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-400 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8" />
                </div>
                
                <h3 className="font-audiowide text-xl text-white mb-3">
                  Le Google Form officiel sera affiché ici
                </h3>

                <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light mb-8">
                  Les inscriptions ouvrent officiellement pour la saison 2027. Vous pouvez d'ores et déjà contacter le comité d'organisation par WhatsApp ou e-mail pour pré-enregistrer votre équipe.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={urlSure(meta.reseaux.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Contacter sur WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${meta.contact.email}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{meta.contact.email}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
