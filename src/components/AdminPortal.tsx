import React, { useState } from 'react';
import {
  Shield, KeyRound, Save, CheckCircle2, AlertCircle, RefreshCw,
  Globe, Swords, Calendar, Users, Trophy, Image, Link, FileText, Plus, Trash2,
  Film, Video, Play, ExternalLink, Star
} from 'lucide-react';
import { ELCData, ELCPantheonItem, ELCVideo } from '../types';

interface AdminPortalProps {
  data: ELCData;
  onUpdateData: (newData: ELCData) => void;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ data, onUpdateData, onClose }) => {
  const [adminKey, setAdminKey] = useState<string>('2027ELC');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Working copy of data
  const [formData, setFormData] = useState<ELCData>(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'general' | 'disciplines' | 'calendrier' | 'moba' | 'tps' | 'pantheon' | 'videos'>('general');
  const [saveStatus, setSaveStatus] = useState<{ loading: boolean; success?: string; error?: string }>({
    loading: false
  });

  // Video Form State
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoPlatform, setNewVideoPlatform] = useState<'youtube' | 'tiktok' | 'autre'>('youtube');
  const [newVideoDiscipline, setNewVideoDiscipline] = useState('general');
  const [newVideoCategory, setNewVideoCategory] = useState<'highlight' | 'match' | 'clip' | 'teaser' | 'tutoriel'>('highlight');
  const [newVideoThumbnail, setNewVideoThumbnail] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [newVideoFeatured, setNewVideoFeatured] = useState(false);

  // Verify key against backend /api/admin/check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/admin/check', {
        headers: { 'x-admin-key': adminKey }
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError(json.error || 'Code administrateur invalide.');
      }
    } catch (err: any) {
      // In dev fallback, allow 2027ELC
      if (adminKey === '2027ELC') {
        setIsAuthenticated(true);
      } else {
        setAuthError('Erreur de connexion avec le serveur backend.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Save to /api/data
  const handleSave = async () => {
    setSaveStatus({ loading: true });
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setSaveStatus({
          loading: false,
          success: `Enregistré avec succès (${new Date(json.savedAt).toLocaleTimeString('fr-FR')}) !`
        });
        onUpdateData(formData);
        setTimeout(() => setSaveStatus({ loading: false }), 4000);
      } else {
        setSaveStatus({
          loading: false,
          error: json.error || "Impossible d'enregistrer les données."
        });
      }
    } catch (err: any) {
      setSaveStatus({
        loading: false,
        error: "Erreur réseau lors de l'enregistrement."
      });
    }
  };

  // Helper updaters
  const updateMeta = (field: string, value: any) => {
    setFormData((prev: ELCData) => ({
      ...prev,
      meta: { ...prev.meta, [field]: value }
    }));
  };

  const updateReseaux = (field: string, value: string) => {
    setFormData((prev: ELCData) => ({
      ...prev,
      meta: {
        ...prev.meta,
        reseaux: { ...prev.meta.reseaux, [field]: value }
      }
    }));
  };

  const updateContact = (field: string, value: string) => {
    setFormData((prev: ELCData) => ({
      ...prev,
      meta: {
        ...prev.meta,
        contact: { ...prev.meta.contact, [field]: value }
      }
    }));
  };

  // Add legend
  const handleAddLegend = () => {
    const newLegend: ELCPantheonItem = {
      id: `legend_${Date.now()}`,
      nom: 'Nouveau Champion',
      titre: 'Titre / Distinction',
      discipline: 'Honor of Kings',
      annee: '2027',
      biographie: 'Biographie et parcours...',
      palmares: ['Titre régional']
    };
    setFormData((prev: ELCData) => ({
      ...prev,
      pantheon: {
        ...prev.pantheon,
        curated: [...(prev.pantheon?.curated || []), newLegend]
      }
    }));
  };

  // Remove legend
  const handleRemoveLegend = (id: string) => {
    setFormData((prev: ELCData) => ({
      ...prev,
      pantheon: {
        ...prev.pantheon,
        curated: (prev.pantheon?.curated || []).filter(item => item.id !== id)
      }
    }));
  };

  // Video Management Handner
  const handleVideoUrlChange = (url: string) => {
    setNewVideoUrl(url);
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setNewVideoPlatform('youtube');
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match && match[1]) {
        setNewVideoThumbnail(`https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`);
      }
      if (url.includes('/shorts/')) {
        setNewVideoCategory('clip');
        setNewVideoDuration('Short');
      }
    } else if (url.includes('tiktok.com')) {
      setNewVideoPlatform('tiktok');
      setNewVideoCategory('clip');
      setNewVideoDuration('TikTok');
      if (!newVideoThumbnail) {
        setNewVideoThumbnail('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80');
      }
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;

    let finalThumb = newVideoThumbnail.trim();
    if (!finalThumb && newVideoPlatform === 'youtube') {
      const match = newVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match && match[1]) {
        finalThumb = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
    if (!finalThumb) {
      finalThumb = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
    }

    const item: ELCVideo = {
      id: `vid-${Date.now()}`,
      titre: newVideoTitle.trim(),
      url: newVideoUrl.trim(),
      plateforme: newVideoPlatform,
      discipline: newVideoDiscipline,
      categorie: newVideoCategory,
      miniature: finalThumb,
      duree: newVideoDuration.trim() || (newVideoPlatform === 'tiktok' ? 'TikTok' : 'Vidéo'),
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: newVideoDescription.trim(),
      featured: newVideoFeatured,
    };

    setFormData((prev: ELCData) => ({
      ...prev,
      videos: [item, ...(prev.videos || [])]
    }));

    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoThumbnail('');
    setNewVideoDuration('');
    setNewVideoDescription('');
    setNewVideoFeatured(false);
  };

  const handleRemoveVideo = (id: string) => {
    setFormData((prev: ELCData) => ({
      ...prev,
      videos: (prev.videos || []).filter(v => v.id !== id)
    }));
  };

  const handleToggleFeatured = (id: string) => {
    setFormData((prev: ELCData) => ({
      ...prev,
      videos: (prev.videos || []).map(v => v.id === id ? { ...v, featured: !v.featured } : v)
    }));
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-2">
            Espace Administrateur ELC
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Entrez votre code d'accès administrateur pour modifier les équipes, scores, règlements et liens du championnat.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Code admin (défaut : 2027ELC)"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full text-center tracking-widest font-mono text-sm bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? 'Vérification...' : 'Déverrouiller le panneau'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
            >
              Retour au site public
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Panneau d'Administration ELC 2027
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Mode Édition Actif
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronisé avec le serveur local Express (/data/elc2027-data.json)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus.success && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {saveStatus.success}
              </span>
            )}

            {saveStatus.error && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                <AlertCircle className="w-4 h-4" />
                {saveStatus.error}
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saveStatus.loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saveStatus.loading ? 'Enregistrement...' : 'Enregistrer tout'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Quitter
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 bg-slate-950/50 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Général & Liens</span>
          </button>

          <button
            onClick={() => setActiveTab('disciplines')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'disciplines'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Disciplines (4 Titres)</span>
          </button>

          <button
            onClick={() => setActiveTab('calendrier')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'calendrier'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendrier & Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('moba')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'moba'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Tournois MOBA</span>
          </button>

          <button
            onClick={() => setActiveTab('tps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'tps'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Roster Battle Royale</span>
          </button>

          <button
            onClick={() => setActiveTab('pantheon')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'pantheon'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Panthéon ({formData.pantheon?.curated?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Vidéos & Médias ({formData.videos?.length || 0})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-200">
          
          {/* TAB 1: GENERAL & LIENS */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nom de la compétition
                  </label>
                  <input
                    type="text"
                    value={formData.meta.competitionNom}
                    onChange={(e) => updateMeta('competitionNom', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Saison / Année
                  </label>
                  <input
                    type="text"
                    value={formData.meta.saison}
                    onChange={(e) => updateMeta('saison', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Organisateur officiel
                  </label>
                  <input
                    type="text"
                    value={formData.meta.organisateur}
                    onChange={(e) => updateMeta('organisateur', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Badge d'en-tête (Ex: 100% Mobile & Online)
                  </label>
                  <input
                    type="text"
                    value={formData.meta.badgeHaut}
                    onChange={(e) => updateMeta('badgeHaut', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Inscriptions & start.gg URLs */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  <span>Liens Clés d'Inscription & Tournoi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL du Formulaire d'Inscription Google
                    </label>
                    <input
                      type="url"
                      placeholder="https://forms.gle/..."
                      value={formData.meta.googleFormUrl || ''}
                      onChange={(e) => updateMeta('googleFormUrl', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Permet aux visiteurs de postuler directement via le bouton d'inscription.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lien Tournoi start.gg (Bracket Officiel)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.start.gg/tournament/..."
                      value={formData.meta.startGgUrl || ''}
                      onChange={(e) => updateMeta('startGgUrl', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Lien sortant officiel vers la plateforme de tournoi start.gg.
                    </span>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux & Contact */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Réseaux Sociaux & Contact Direct</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lien WhatsApp Officiel
                    </label>
                    <input
                      type="text"
                      value={formData.meta.reseaux.whatsapp}
                      onChange={(e) => updateReseaux('whatsapp', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lien YouTube Officiel
                    </label>
                    <input
                      type="text"
                      value={formData.meta.reseaux.youtube}
                      onChange={(e) => updateReseaux('youtube', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lien Facebook Officiel
                    </label>
                    <input
                      type="text"
                      value={formData.meta.reseaux.facebook}
                      onChange={(e) => updateReseaux('facebook', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={formData.meta.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Visuels et Images d'Arrière-Plan */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span>Zones d'insertion d'images (URLs)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Favicon du site (URL de l'icône)
                    </label>
                    <input
                      type="url"
                      value={formData.meta.favicon || ''}
                      onChange={(e) => updateMeta('favicon', e.target.value)}
                      placeholder="/img/icon-192.png ou https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image du Héro d'accueil (Hero)
                    </label>
                    <input
                      type="url"
                      value={formData.meta.heroImage || ''}
                      onChange={(e) => updateMeta('heroImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — Honor of Kings (HOK)
                    </label>
                    <input
                      type="url"
                      value={formData.competition.hok.heroImage || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          competition: {
                            ...prev.competition,
                            hok: { ...prev.competition.hok, heroImage: url }
                          }
                        }));
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — Mobile Legends (MLBB)
                    </label>
                    <input
                      type="url"
                      value={formData.competition.mlbb.heroImage || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          competition: {
                            ...prev.competition,
                            mlbb: { ...prev.competition.mlbb, heroImage: url }
                          }
                        }));
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — PUBG Mobile (PUBGM)
                    </label>
                    <input
                      type="url"
                      value={formData.competition.pubgm.heroImage || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          competition: {
                            ...prev.competition,
                            pubgm: { ...prev.competition.pubgm, heroImage: url }
                          }
                        }));
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — Free Fire (FF)
                    </label>
                    <input
                      type="url"
                      value={formData.competition.ff.heroImage || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          competition: {
                            ...prev.competition,
                            ff: { ...prev.competition.ff, heroImage: url }
                          }
                        }));
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISCIPLINES */}
          {activeTab === 'disciplines' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Édition des 4 disciplines sélectionnées pour l'ELC 2027.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.visual1.titres.map((titre, idx) => (
                  <div key={titre.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-white text-sm">
                        {titre.nom} ({titre.id.toUpperCase()})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {titre.discipline}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nom d'affichage</label>
                      <input
                        type="text"
                        value={titre.nom}
                        onChange={(e) => {
                          const next = [...formData.visual1.titres];
                          next[idx].nom = e.target.value;
                          setFormData({ ...formData, visual1: { ...formData.visual1, titres: next } });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Lancement</label>
                        <input
                          type="text"
                          value={titre.lancement}
                          onChange={(e) => {
                            const next = [...formData.visual1.titres];
                            next[idx].lancement = e.target.value;
                            setFormData({ ...formData, visual1: { ...formData.visual1, titres: next } });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Badge</label>
                        <input
                          type="text"
                          value={titre.badge}
                          onChange={(e) => {
                            const next = [...formData.visual1.titres];
                            next[idx].badge = e.target.value;
                            setFormData({ ...formData, visual1: { ...formData.visual1, titres: next } });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CALENDRIER */}
          {activeTab === 'calendrier' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Édition des 4 phases de la roadmap officielle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.visual2.phases.map((phase, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>PHASE 0{idx + 1}</span>
                      <span>{phase.tag}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Titre de la phase</label>
                      <input
                        type="text"
                        value={phase.titre}
                        onChange={(e) => {
                          const next = [...formData.visual2.phases];
                          next[idx].titre = e.target.value;
                          setFormData({ ...formData, visual2: { ...formData.visual2, phases: next } });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Période</label>
                      <input
                        type="text"
                        value={phase.periode}
                        onChange={(e) => {
                          const next = [...formData.visual2.phases];
                          next[idx].periode = e.target.value;
                          setFormData({ ...formData, visual2: { ...formData.visual2, phases: next } });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                      <textarea
                        value={phase.sousTitre}
                        onChange={(e) => {
                          const next = [...formData.visual2.phases];
                          next[idx].sousTitre = e.target.value;
                          setFormData({ ...formData, visual2: { ...formData.visual2, phases: next } });
                        }}
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MOBA TOURNAMENTS */}
          {activeTab === 'moba' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                Édition des 16 équipes engagées dans Honor of Kings et Mobile Legends.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* HOK Teams */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-amber-400 text-sm">
                    Honor of Kings (16 Équipes)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {formData.competition.hok.bracket.equipes.map((eq, i) => (
                      <div key={eq.id} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-6">#{i + 1}</span>
                        <input
                          type="text"
                          value={eq.nom}
                          onChange={(e) => {
                            const next = [...formData.competition.hok.bracket.equipes];
                            next[i].nom = e.target.value;
                            setFormData({
                              ...formData,
                              competition: {
                                ...formData.competition,
                                hok: {
                                  ...formData.competition.hok,
                                  bracket: { ...formData.competition.hok.bracket, equipes: next }
                                }
                              }
                            });
                          }}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* MLBB Teams */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-blue-400 text-sm">
                    Mobile Legends (16 Équipes)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {formData.competition.mlbb.bracket.equipes.map((eq, i) => (
                      <div key={eq.id} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-6">#{i + 1}</span>
                        <input
                          type="text"
                          value={eq.nom}
                          onChange={(e) => {
                            const next = [...formData.competition.mlbb.bracket.equipes];
                            next[i].nom = e.target.value;
                            setFormData({
                              ...formData,
                              competition: {
                                ...formData.competition,
                                mlbb: {
                                  ...formData.competition.mlbb,
                                  bracket: { ...formData.competition.mlbb.bracket, equipes: next }
                                }
                              }
                            });
                          }}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BATTLE ROYALE ROSTERS */}
          {activeTab === 'tps' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                Édition des 32 compétiteurs en Battle Royale pour PUBG Mobile et Free Fire.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* PUBG Mobile */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-emerald-400 text-sm">
                    PUBG Mobile (32 Compétiteurs)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {formData.competition.pubgm.roster.slice(0, 16).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-6">#{i + 1}</span>
                        <input
                          type="text"
                          value={p.nom}
                          onChange={(e) => {
                            const next = [...formData.competition.pubgm.roster];
                            next[i].nom = e.target.value;
                            setFormData({
                              ...formData,
                              competition: {
                                ...formData.competition,
                                pubgm: { ...formData.competition.pubgm, roster: next }
                              }
                            });
                          }}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free Fire */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-orange-400 text-sm">
                    Free Fire (32 Compétiteurs)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {formData.competition.ff.roster.slice(0, 16).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 w-6">#{i + 1}</span>
                        <input
                          type="text"
                          value={p.nom}
                          onChange={(e) => {
                            const next = [...formData.competition.ff.roster];
                            next[i].nom = e.target.value;
                            setFormData({
                              ...formData,
                              competition: {
                                ...formData.competition,
                                ff: { ...formData.competition.ff, roster: next }
                              }
                            });
                          }}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PANTHEON */}
          {activeTab === 'pantheon' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Ajout et modification des personnalités intronisées au Panthéon ELC.
                </p>
                <button
                  onClick={handleAddLegend}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-400"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une légende</span>
                </button>
              </div>

              <div className="space-y-4">
                {(formData.pantheon?.curated || []).map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs uppercase">
                        Légende #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveLegend(item.id)}
                        className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Nom / Pseudo</label>
                        <input
                          type="text"
                          value={item.nom}
                          onChange={(e) => {
                            const next = [...(formData.pantheon?.curated || [])];
                            next[idx].nom = e.target.value;
                            setFormData({ ...formData, pantheon: { ...formData.pantheon, curated: next } });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Titre / Distinction</label>
                        <input
                          type="text"
                          value={item.titre}
                          onChange={(e) => {
                            const next = [...(formData.pantheon?.curated || [])];
                            next[idx].titre = e.target.value;
                            setFormData({ ...formData, pantheon: { ...formData.pantheon, curated: next } });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Discipline</label>
                        <input
                          type="text"
                          value={item.discipline}
                          onChange={(e) => {
                            const next = [...(formData.pantheon?.curated || [])];
                            next[idx].discipline = e.target.value;
                            setFormData({ ...formData, pantheon: { ...formData.pantheon, curated: next } });
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Biographie</label>
                      <textarea
                        value={item.biographie}
                        onChange={(e) => {
                          const next = [...(formData.pantheon?.curated || [])];
                          next[idx].biographie = e.target.value;
                          setFormData({ ...formData, pantheon: { ...formData.pantheon, curated: next } });
                        }}
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GESTION DES VIDÉOS & MÉDIAS */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-bold text-sm text-white mb-1">
                  Gestion de la Vitrine Vidéos & Médias
                </h4>
                <p className="text-xs text-slate-400">
                  Ajoutez les liens officiels de vos vidéos YouTube et TikTok. Les miniatures sont extraites automatiquement pour YouTube. N'oubliez pas de cliquer sur <strong className="text-emerald-400">Enregistrer tout</strong> après vos modifications.
                </p>
              </div>

              {/* Formulaire d'ajout de vidéo */}
              <div className="p-5 bg-slate-950/70 border border-teal-500/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h5 className="font-display font-semibold text-xs text-teal-300 uppercase tracking-wider">
                    Ajouter une nouvelle vidéo officielle
                  </h5>
                </div>

                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Lien URL */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Lien direct de la vidéo (YouTube ou TikTok) *
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... ou https://www.tiktok.com/@east_ligue/video/..."
                        value={newVideoUrl}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                        required
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Pour YouTube, l'identifiant et la miniature haute résolution sont extraits instantanément.
                      </p>
                    </div>

                    {/* Titre */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Titre de la vidéo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Teaser Officiel ELC 2027 — Phase Finale"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>

                    {/* Plateforme */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Plateforme
                      </label>
                      <select
                        value={newVideoPlatform}
                        onChange={(e: any) => setNewVideoPlatform(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="autre">Autre plateforme</option>
                      </select>
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Type / Catégorie
                      </label>
                      <select
                        value={newVideoCategory}
                        onChange={(e: any) => setNewVideoCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="highlight">Highlights / Meilleurs moments</option>
                        <option value="match">Match complet (VOD)</option>
                        <option value="clip">Clip court / Short</option>
                        <option value="teaser">Teaser / Bande-annonce</option>
                        <option value="tutoriel">Tutoriel / Règles</option>
                      </select>
                    </div>

                    {/* Discipline */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Discipline
                      </label>
                      <select
                        value={newVideoDiscipline}
                        onChange={(e) => setNewVideoDiscipline(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="general">Général / Tournoi Global</option>
                        <option value="hok">Honor of Kings</option>
                        <option value="mlbb">Mobile Legends</option>
                        <option value="pubgm">PUBG Mobile</option>
                        <option value="ff">Free Fire</option>
                      </select>
                    </div>

                    {/* Durée */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Durée estimée (ex: 04:30 ou Short)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 05:20"
                        value={newVideoDuration}
                        onChange={(e) => setNewVideoDuration(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Miniature URL override */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Image miniature (URL) — auto-détectée pour YouTube
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newVideoThumbnail}
                        onChange={(e) => setNewVideoThumbnail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Preview de la miniature */}
                    {newVideoThumbnail && (
                      <div className="sm:col-span-2 flex items-center gap-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                        <div className="w-32 aspect-video rounded-lg overflow-hidden bg-black border border-slate-700 shrink-0">
                          <img
                            src={newVideoThumbnail}
                            alt="Aperçu miniature"
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>
                        <div className="text-xs text-slate-300">
                          <div className="font-semibold text-teal-400 mb-0.5">Aperçu miniature détectée</div>
                          <div className="text-slate-400 text-[11px]">Cette image servira de couverture dans la vitrine.</div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Description / Contexte (optionnel)
                      </label>
                      <textarea
                        placeholder="Brève description du contenu ou des moments forts..."
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Option À la une */}
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="newVideoFeatured"
                        checked={newVideoFeatured}
                        onChange={(e) => setNewVideoFeatured(e.target.checked)}
                        className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4 bg-slate-900"
                      />
                      <label htmlFor="newVideoFeatured" className="text-xs text-slate-300 font-medium cursor-pointer">
                        Mettre en vedette (Vidéo principale "À la une")
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter cette vidéo à la vitrine</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Liste des vidéos existantes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-display font-bold text-xs text-slate-300 uppercase tracking-wider">
                    Vidéos actuellement dans la vitrine ({formData.videos?.length || 0})
                  </h5>
                  <span className="text-[11px] text-slate-500">
                    Ces vidéos apparaissent publiquement sur la vitrine
                  </span>
                </div>

                {(!formData.videos || formData.videos.length === 0) ? (
                  <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                    <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h6 className="text-sm font-semibold text-slate-300 mb-1">
                      Aucune vidéo officielle configurée
                    </h6>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Collez vos liens de chaînes YouTube ou TikTok officiels ci-dessus pour alimenter la vitrine multimédia.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.videos.map((vid: ELCVideo) => (
                      <div
                        key={vid.id}
                        className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
                            <img
                              src={vid.miniature}
                              alt={vid.titre}
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            {vid.duree && (
                              <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-mono bg-black/80 text-white">
                                {vid.duree}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                vid.plateforme === 'youtube'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              }`}>
                                {vid.plateforme}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                                {(vid.discipline || 'general').toUpperCase()}
                              </span>
                              {vid.featured && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>À la une</span>
                                </span>
                              )}
                            </div>
                            <h6 className="text-xs font-semibold text-white truncate max-w-md">
                              {vid.titre}
                            </h6>
                            <p className="text-[11px] text-slate-400 truncate max-w-md">
                              {vid.url}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(vid.id)}
                            title={vid.featured ? 'Retirer de la une' : 'Mettre à la une'}
                            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                              vid.featured
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${vid.featured ? 'fill-current' : ''}`} />
                          </button>

                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ouvrir le lien"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(vid.id)}
                            title="Supprimer cette vidéo"
                            className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
