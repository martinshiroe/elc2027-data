import { lienChallengermode } from '../lib/vitrine';
import { urlSure } from '../lib/urls';
import { useSiteCustomization } from '../lib/siteCustomization';
import React from 'react';
import { useModale } from '../lib/useModale';
import { X, ShieldCheck, FileText, CheckCircle, Smartphone, AlertTriangle } from 'lucide-react';
import { ELCData } from '../types';

interface RegulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ELCData;
}

export const RegulationsModal: React.FC<RegulationsModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { texteSite, imageSite, sourcesSite } = useSiteCustomization();

  const conteneur = useModale(isOpen, onClose);

  if (!isOpen) return null;

  const lien = lienChallengermode(data.meta.challengermodeUrl);
  const { meta, visual2, visual3 } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nuit/85 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-carte-haute border border-bord-fort shadow-2xl flex flex-col overflow-hidden"
        ref={conteneur}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-reglement"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bord-fort bg-encre">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-avis border border-bord-fort flex items-center justify-center text-magenta">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="titre-reglement" className="titre font-bold text-lg text-white">{texteSite("Règlement Intérieur & Statuts FECASES")}</h3>
              <p className="text-xs text-doux">
                {texteSite(meta.organisateur)}{texteSite(" · ")}{texteSite(meta.competitionNom)} {texteSite(meta.saison)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-doux hover:text-white hover:bg-carte transition-colors cursor-pointer"
            aria-label={texteSite("Fermer")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-texte">
          {/* FECASES Affiliation Statement */}
          <div className="p-4 rounded-xl bg-avis border-l-4 border-magenta">
            <div className="flex items-center gap-2 text-xs font-bold text-magenta uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>{texteSite("Homologation Officielle")}</span>
            </div>
            <p className="text-xs leading-relaxed text-texte">
              {texteSite(meta.liens.statutsTexte)}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="titre font-bold text-white text-base">Informations sur les événements</h4>
            <p className="text-xs leading-relaxed text-texte">Le calendrier présente les rendez-vous de la ligue. Les inscriptions, les rencontres et les règlements de chaque compétition sont disponibles sur Challengermode.</p>
            {lien && <a href={lien} target="_blank" rel="noopener noreferrer" className="font-bold text-magenta hover:underline">ELC sur Challengermode</a>}
            {Boolean(urlSure(meta.liens.statuts)) && <a href={urlSure(meta.liens.statuts)} target="_blank" rel="noopener noreferrer" className="block font-bold text-magenta hover:underline">Consulter les statuts</a>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-bord-fort bg-nuit/85 flex items-center justify-between">
          <span className="text-[11px] text-doux">{texteSite("Dernière mise à jour : ")}{texteSite(new Date(meta.derniereMaj).toLocaleDateString('fr-FR'))}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-magenta-plein hover:bg-[#a3000a] text-white italic font-bold text-xs transition-colors cursor-pointer"
          >{texteSite("Fermer")}</button>
        </div>
      </div>
    </div>
  );
};
