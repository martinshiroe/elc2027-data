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

          {/* Technical Requirements */}
          <div className="space-y-3">
            <h4 className="titre font-bold text-white text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-magenta" />
              <span>{texteSite("Contrôle Technique & Terminaux Personnels")}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-encre border border-bord-fort space-y-1">
                <div className="font-bold text-white">{texteSite("Systèmes autorisés")}</div>
                <div className="text-doux">{texteSite("Terminaux Android et iOS natifs uniquement. L'utilisation d'émulateurs PC, de macros ou d'accessoires de modification matérielle non homologués est strictement interdite.")}</div>
              </div>

              <div className="p-3 rounded-xl bg-encre border border-bord-fort space-y-1">
                <div className="font-bold text-white">{texteSite("Inspection technique")}</div>
                <div className="text-doux">{texteSite("Chaque joueur doit soumettre son identifiant joueur (UID) et faire vérifier son terminal avant chaque manche par les commissaires de la Ligue.")}</div>
              </div>
            </div>
          </div>

          {/* Rules & Fair Play */}
          <div className="space-y-3">
            <h4 className="titre font-bold text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-magenta" />
              <span>{texteSite("Format des Compétitions & Déroulement")}</span>
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-doux">
              <li>
                <strong className="text-texte">{texteSite("Qualifications :")}</strong>{texteSite(" Déroulement 100% en ligne sous la supervision d'arbitres en temps réel.")}</li>
              <li>
                <strong className="text-texte">{texteSite("MOBA (Honor of Kings & Mobile Legends) :")}</strong>{texteSite(" Tournois à 16 équipes en élimination directe au format Best of 3 (BO3).")}</li>
              <li>
                <strong className="text-texte">{texteSite("Battle Royale / TPS (PUBG Mobile & Free Fire) :")}</strong>{texteSite(" Groupes de 32 joueurs, attribution des points basée sur le placement officiel (15 à 1 pts) et 1 point par élimination confirmée.")}</li>
              <li>
                <strong className="text-texte">{texteSite("Grande Finale :")}</strong>{texteSite(" Conjointe pour les 4 disciplines, organisée en présentiel en Novembre 2027 dans la Région de l'Est du Cameroun.")}</li>
            </ul>
          </div>

          {/* Sanctions */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 flex items-start gap-3 text-xs text-texte">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-300 mb-1">{texteSite("Discipline & Sanctions Arbitrales")}</div>
              <p className="text-doux leading-relaxed">{texteSite("Tout comportement anti-sportif, tentative de triche, déconnexion volontaire ou usurpation d'identité entraîne la disqualification immédiate du joueur ou de l'équipe, ainsi qu'un signalement officiel transmis à la FECASES pour inscription au registre national des sanctions.")}</p>
            </div>
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
