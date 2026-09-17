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
  const conteneur = useModale(isOpen, onClose);

  if (!isOpen) return null;

  const { meta, visual2, visual3 } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        ref={conteneur}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-reglement"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="titre-reglement" className="font-display font-bold text-lg text-white">
                Règlement Intérieur & Statuts FECASES
              </h3>
              <p className="text-xs text-slate-400">
                {meta.organisateur} · {meta.competitionNom} {meta.saison}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* FECASES Affiliation Statement */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-800/40">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Homologation Officielle</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-200">
              {meta.liens.statutsTexte}
            </p>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Contrôle Technique & Terminaux Personnels</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Systèmes autorisés</div>
                <div className="text-slate-400">
                  Terminaux Android et iOS natifs uniquement. L'utilisation d'émulateurs PC, de macros ou d'accessoires de modification matérielle non homologués est strictement interdite.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="font-bold text-white">Inspection technique</div>
                <div className="text-slate-400">
                  Chaque joueur doit soumettre son identifiant joueur (UID) et faire vérifier son terminal avant chaque manche par les commissaires de la Ligue.
                </div>
              </div>
            </div>
          </div>

          {/* Rules & Fair Play */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Format des Compétitions & Déroulement</span>
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
              <li>
                <strong className="text-slate-200">Qualifications :</strong> Déroulement 100% en ligne sous la supervision d'arbitres en temps réel.
              </li>
              <li>
                <strong className="text-slate-200">MOBA (Honor of Kings & Mobile Legends) :</strong> Tournois à 16 équipes en élimination directe au format Best of 3 (BO3).
              </li>
              <li>
                <strong className="text-slate-200">Battle Royale / TPS (PUBG Mobile & Free Fire) :</strong> Groupes de 32 joueurs, attribution des points basée sur le placement officiel (15 à 1 pts) et 1 point par élimination confirmée.
              </li>
              <li>
                <strong className="text-slate-200">Grande Finale :</strong> Conjointe pour les 4 disciplines, organisée en présentiel en Novembre 2027 dans la Région de l'Est du Cameroun.
              </li>
            </ul>
          </div>

          {/* Sanctions */}
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 flex items-start gap-3 text-xs text-slate-300">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-300 mb-1">Discipline & Sanctions Arbitrales</div>
              <p className="text-slate-400 leading-relaxed">
                Tout comportement anti-sportif, tentative de triche, déconnexion volontaire ou usurpation d'identité entraîne la disqualification immédiate du joueur ou de l'équipe, ainsi qu'un signalement officiel transmis à la FECASES pour inscription au registre national des sanctions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Dernière mise à jour : {new Date(meta.derniereMaj).toLocaleDateString('fr-FR')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
