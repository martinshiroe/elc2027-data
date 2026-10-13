import React, { useState } from 'react';
import { useModale } from '../lib/useModale';
import { X, Copy, Download, Check, Database, RefreshCw, Code2 } from 'lucide-react';
import { ELCData } from '../types';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ELCData;
  onResetData: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  data,
  onResetData
}) => {
  const [copied, setCopied] = useState(false);

  const conteneur = useModale(isOpen, onClose);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'elc2027-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nuit/85 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-carte-haute border border-bord-fort shadow-2xl flex flex-col overflow-hidden"
        ref={conteneur}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-donnees"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bord-fort bg-encre">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-avis border border-bord-fort flex items-center justify-center text-magenta">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 id="titre-donnees" className="titre font-bold text-lg text-white">
                Données Brutes & Structure ELC 2027
              </h3>
              <p className="text-xs text-doux">
                Fichier source : /data/elc2027-data.json
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carte hover:bg-avis text-texte text-xs font-semibold border border-bord-fort transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-magenta" />
                  <span className="text-magenta">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-magenta-plein hover:bg-[#b000c2] text-white italic text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger .json</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-doux hover:text-white hover:bg-carte transition-colors cursor-pointer ml-1"
            aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - JSON Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-nuit font-mono text-xs">
          <pre className="text-magenta whitespace-pre-wrap leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-bord-fort bg-carte-haute flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-doux">
            <Code2 className="w-4 h-4 text-magenta" />
            <span>Format JSON standardisé · Compatible export et synchronisation</span>
          </div>

          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-doux hover:text-white hover:bg-carte transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Réinitialiser les données d'origine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
