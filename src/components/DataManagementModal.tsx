import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-850 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Données Brutes & Structure ELC 2027
              </h3>
              <p className="text-xs text-slate-400">
                Fichier source : /data/elc2027-data.json
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copié !</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger .json</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - JSON Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs">
          <pre className="text-emerald-400/90 whitespace-pre-wrap leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Format JSON standardisé · Compatible export et synchronisation</span>
          </div>

          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Réinitialiser les données d'origine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
