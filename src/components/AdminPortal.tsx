import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, KeyRound, Save, CheckCircle2, AlertCircle, RefreshCw,
  Globe, Swords, Calendar, Users, Trophy, Image, Link, FileText, Plus, Trash2,
  Film, Video, Play, ExternalLink, Star, Camera, Upload, User, Target, Crosshair, Newspaper, LayoutTemplate
} from 'lucide-react';
import { OngletActualites, OngletPages, Commandes, BoutonAjout } from './AdminContenu';
import { ELCData, ELCPantheonItem, ELCVideo } from '../types';

import { AdminLogin, AdminShell, AdminDashboard, AdminModule } from './AdminInterface';
import { AdminPersonnalisation, AdminPagesLibres, AdminDistinctions, validerPages } from './AdminPersonnalisation';
import { useModale } from '../lib/useModale';
import { AdminChamps } from './AdminChamps';

interface AdminPortalProps {
  data: ELCData;
  onUpdateData: (newData: ELCData) => void;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ data, onUpdateData, onClose }) => {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Working copy of data
  const [formData, setFormData] = useState<ELCData>(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<AdminModule>('dashboard');
  const [saveStatus, setSaveStatus] = useState<{ loading: boolean; success?: string; error?: string }>({
    loading: false
  });

  const [savedData, setSavedData] = useState(() => JSON.stringify(data));
  const dirty = JSON.stringify(formData) !== savedData;
  const closeState = useRef({ dirty, loading: saveStatus.loading, onClose });
  closeState.current = { dirty, loading: saveStatus.loading, onClose };
  const closeAdmin = useCallback(() => {
    const state = closeState.current;
    if (state.loading) return;
    if (!state.dirty || window.confirm('Quitter sans enregistrer les modifications ?')) state.onClose();
  }, []);
  const dialog = useModale(true, closeAdmin);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [dirty]);
  const resetData = () => {
    if (window.confirm('Annuler les modifications non enregistrées ?')) {
      setFormData(JSON.parse(savedData)); setSaveStatus({ loading: false });
    }
  };

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

  // Le code part encodé : un en-tête HTTP n'accepte que des caractères
  // Latin-1, et le navigateur refusait d'envoyer la requête dès que le code
  // contenait « € », « œ » ou un emoji — l'admin affichait alors « serveur
  // injoignable » alors que rien n'avait été envoyé. Le serveur décode.
  const enTeteCle = encodeURIComponent(adminKey);

  // Verify key against backend /api/admin/check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    let res: Response;
    try {
      res = await fetch('/api/admin/check', {
        headers: { 'x-admin-key': enTeteCle }
      });
    } catch {
      setAuthError(
        "Connexion au serveur impossible. Vérifiez votre connexion internet, puis réessayez depuis www.eastofcameroon.site (les aperçus Vercel protégés bloquent l'admin)."
      );
      setIsVerifying(false);
      return;
    }

    try {
      const json = await res.json();
      if (res.ok && json.ok) {
        const response = await fetch('/api/data', { headers: { 'x-admin-key': enTeteCle }, cache: 'no-store' });
        if (!response.ok) { setAuthError('Impossible de charger les contenus. Réessayez avant de modifier le site.'); return; }
        const current = await response.json() as ELCData;
        if (!current.meta || !current.competition) { setAuthError('Les contenus reçus sont incomplets.'); return; }
        setFormData(current);
        setSavedData(JSON.stringify(current));
        setIsAuthenticated(true);
      } else {
        setAuthError(json.error || 'Code administrateur invalide.');
      }
    } catch {
      // Aucun repli : seul le serveur peut valider le code. Ouvrir l'éditeur
      // hors ligne ne servirait à rien de toute façon — aucune sauvegarde
      // n'aboutirait — et laisserait le contenu de l'admin à la vue de
      // n'importe qui sachant ajouter #admin à l'URL.
      setAuthError(`Réponse inattendue du serveur (erreur ${res.status}). Réessayez dans un instant depuis www.eastofcameroon.site.`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Save to /api/data
  const handleSave = async () => {
    if (saveStatus.loading) return;
    const pageError = validerPages(formData.site?.pages ?? []);
    if (pageError) { setSaveStatus({ loading: false, error: pageError }); return; }
    if (!window.confirm('Enregistrer ces modifications et les publier sur le site ?')) return;
    const payload = JSON.parse(JSON.stringify(formData)) as ELCData;
    setSaveStatus({ loading: true });
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': enTeteCle
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setSaveStatus({
          loading: false,
          success: `Enregistré avec succès (${new Date(json.savedAt).toLocaleTimeString('fr-FR')}) !`
        });
        setSavedData(JSON.stringify(payload));
        onUpdateData(payload);

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

    const updatedVideos = [item, ...(formData.videos || [])];
    const updatedFormData = {
      ...formData,
      videos: updatedVideos
    };

    setFormData(updatedFormData);


    setSaveStatus({ loading: false });

    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoThumbnail('');
    setNewVideoDuration('');
    setNewVideoDescription('');
    setNewVideoFeatured(false);
  };

  const handleRemoveVideo = (id: string) => {
    if (!window.confirm('Retirer cette vidéo ? La suppression sera appliquée à l’enregistrement.')) return;
    const updatedVideos = (formData.videos || []).filter(v => v.id !== id);
    const updatedFormData = {
      ...formData,
      videos: updatedVideos
    };
    setFormData(updatedFormData);


    setSaveStatus({ loading: false });
  };

  const handleToggleFeatured = (id: string) => {
    const updatedVideos = (formData.videos || []).map(v => v.id === id ? { ...v, featured: !v.featured } : v);
    const updatedFormData = {
      ...formData,
      videos: updatedVideos
    };
    setFormData(updatedFormData);


    setSaveStatus({ loading: false });
  };

  if (!isAuthenticated) {
    return <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <AdminLogin code={adminKey} onCode={setAdminKey} onSubmit={handleLogin} loading={isVerifying}
        error={authError} onClose={closeAdmin} saison={formData.meta.saison || '2027'} />
    </div>;
  }

  // --- Rankings : bilan des équipes MOBA et points Battle Royale ----------
  // Ces chiffres alimentent les tableaux « Ranking » du site public.
  const majEquipe = (jeu: 'hok' | 'mlbb', index: number, champ: string, valeur: string | number) => {
    const equipes = formData.competition[jeu].bracket.equipes.map((eq, i) =>
      i === index ? { ...eq, [champ]: valeur } : eq
    );
    setFormData({
      ...formData,
      competition: {
        ...formData.competition,
        [jeu]: { ...formData.competition[jeu], bracket: { ...formData.competition[jeu].bracket, equipes } },
      },
    });
  };

  const majJoueur = (jeu: 'pubgm' | 'ff', index: number, champ: string, valeur: string | number) => {
    const roster = formData.competition[jeu].roster.map((p, i) => (i === index ? { ...p, [champ]: valeur } : p));
    setFormData({
      ...formData,
      competition: { ...formData.competition, [jeu]: { ...formData.competition[jeu], roster } },
    });
  };

  const nombre = (v: string) => Math.max(0, Math.floor(Number(v) || 0));

  const CHAMPS_MOBA: { cle: 'victoires' | 'nuls' | 'defaites' | 'manchesGagnees' | 'manchesPerdues'; court: string; long: string }[] = [
    { cle: 'victoires', court: 'V', long: 'Séries gagnées' },
    { cle: 'nuls', court: 'N', long: 'Séries nulles' },
    { cle: 'defaites', court: 'D', long: 'Séries perdues' },
    { cle: 'manchesGagnees', court: 'M+', long: 'Manches gagnées' },
    { cle: 'manchesPerdues', court: 'M−', long: 'Manches perdues' },
  ];

  const renderEquipesMoba = (jeu: 'hok' | 'mlbb') => (
    <>
      <div className="grid grid-cols-[1.5rem_1fr_repeat(5,2.75rem)] gap-1.5 text-[10px] font-mono text-slate-500 px-0.5">
        <span />
        <span>Nom de l'équipe</span>
        {CHAMPS_MOBA.map((c) => (
          <span key={c.cle} title={c.long} className="text-center">{c.court}</span>
        ))}
      </div>
      {formData.competition[jeu].bracket.equipes.map((eq, i) => (
        <div key={eq.id} className="grid grid-cols-[1.5rem_1fr_repeat(5,2.75rem)] gap-1.5 items-center">
          <span className="text-[10px] font-mono text-slate-500">#{i + 1}</span>
          <input
            type="text"
            value={eq.nom}
            aria-label={`Nom de l'équipe ${i + 1}`}
            onChange={(e) => majEquipe(jeu, i, 'nom', e.target.value)}
            className="min-w-0 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
          />
          {CHAMPS_MOBA.map((c) => (
            <input
              key={c.cle}
              type="number"
              min={0}
              inputMode="numeric"
              value={eq[c.cle] ?? 0}
              aria-label={`${c.long} — équipe ${i + 1}`}
              title={c.long}
              onChange={(e) => majEquipe(jeu, i, c.cle, nombre(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded px-1 py-1 text-xs text-white text-center"
            />
          ))}
        </div>
      ))}
      <p className="text-[10px] text-slate-500 pt-1">
        Les points se calculent seuls à partir du barème. Un nom laissé à « Équipe N » n'apparaît pas au classement.
      </p>
    </>
  );

  const renderRosterTps = (jeu: 'pubgm' | 'ff') => (
    <>
      <div className="grid grid-cols-[1.5rem_1fr_3.5rem_3rem] gap-1.5 text-[10px] font-mono text-slate-500 px-0.5">
        <span />
        <span>Nom du joueur</span>
        <span className="text-center" title="Points cumulés">Pts</span>
        <span className="text-center" title="Éliminations">Kills</span>
      </div>
      {formData.competition[jeu].roster.map((p, i) => (
        <div key={p.id} className="grid grid-cols-[1.5rem_1fr_3.5rem_3rem] gap-1.5 items-center">
          <span className="text-[10px] font-mono text-slate-500">#{i + 1}</span>
          <input
            type="text"
            value={p.nom}
            aria-label={`Nom du joueur ${i + 1}`}
            onChange={(e) => majJoueur(jeu, i, 'nom', e.target.value)}
            className="min-w-0 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
          />
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={p.scoreTotal ?? 0}
            aria-label={`Points cumulés — joueur ${i + 1}`}
            onChange={(e) => majJoueur(jeu, i, 'scoreTotal', nombre(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded px-1 py-1 text-xs text-white text-center"
          />
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={p.kills ?? 0}
            aria-label={`Éliminations — joueur ${i + 1}`}
            onChange={(e) => majJoueur(jeu, i, 'kills', nombre(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded px-1 py-1 text-xs text-white text-center"
          />
        </div>
      ))}
      <p className="text-[10px] text-slate-500 pt-1">
        Un nom laissé à « Joueur N » n'apparaît pas au classement.
      </p>
    </>
  );

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <AdminShell active={activeTab} onSelect={setActiveTab} onClose={closeAdmin} onSave={handleSave}
        onReset={resetData} dirty={dirty} loading={saveStatus.loading} success={saveStatus.success}
        error={saveStatus.error} saison={formData.meta.saison || '2027'}>
          {activeTab === 'dashboard' && <AdminDashboard data={formData} onSelect={setActiveTab} />}
          {activeTab === 'personnalisation' && <AdminPersonnalisation data={formData} onChange={setFormData} />}
          {activeTab === 'pages-libres' && <AdminPagesLibres data={formData} onChange={setFormData} />}
          {activeTab === 'donnees' && <AdminChamps data={formData} onChange={setFormData} />}
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

                  {/* Le pied de page affiche déjà ces trois icônes, mais elles
                      ne s'affichent que si le lien est rempli — et rien ne
                      permettait de le remplir jusqu'ici. */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lien TikTok Officiel
                    </label>
                    <input
                      type="text"
                      value={formData.meta.reseaux.tiktok || ''}
                      onChange={(e) => updateReseaux('tiktok', e.target.value)}
                      placeholder="https://www.tiktok.com/@..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lien Instagram Officiel
                    </label>
                    <input
                      type="text"
                      value={formData.meta.reseaux.instagram || ''}
                      onChange={(e) => updateReseaux('instagram', e.target.value)}
                      placeholder="https://www.instagram.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Lien Discord Officiel
                    </label>
                    <input
                      type="text"
                      value={formData.meta.reseaux.discord || ''}
                      onChange={(e) => updateReseaux('discord', e.target.value)}
                      placeholder="https://discord.gg/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
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
                      Image Bannière — Rejoignez l'ELC (CTA Banner)
                    </label>
                    <input
                      type="url"
                      value={formData.meta.ctaImage || ''}
                      onChange={(e) => updateMeta('ctaImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — Replays & Vidéos
                    </label>
                    <input
                      type="url"
                      value={formData.meta.videosBannerImage || ''}
                      onChange={(e) => updateMeta('videosBannerImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — Panthéon / Attributions
                    </label>
                    <input
                      type="url"
                      value={formData.meta.pantheonBannerImage || ''}
                      onChange={(e) => updateMeta('pantheonBannerImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Image Bannière — Page Inscription
                    </label>
                    <input
                      type="url"
                      value={formData.meta.inscriptionBannerImage || ''}
                      onChange={(e) => updateMeta('inscriptionBannerImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Logos personnalisés des 4 Jeux */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-3">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span>Images & Logos des 4 Jeux (Vitrine)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-light">
                    L'image importée remplacera directement l'espace <code className="text-amber-300 font-mono">[ Image JEU ]</code> sur la vitrine.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* HOK */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">Honor of Kings (HOK)</span>
                      {formData.competition.hok.logoImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                hok: { ...prev.competition.hok, logoImage: '' }
                              }
                            }));
                          }}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer"
                        >
                          Effacer le logo
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {formData.competition.hok.logoImage ? (
                        <img
                          src={formData.competition.hok.logoImage}
                          alt="HOK"
                          className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 border border-amber-500/40 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center shrink-0 text-amber-400/50">
                          <Swords className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="URL du logo ou charger un fichier"
                          value={formData.competition.hok.logoImage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                hok: { ...prev.competition.hok, logoImage: val }
                              }
                            }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                        <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Charger une image (PNG/SVG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setFormData(prev => ({
                                    ...prev,
                                    competition: {
                                      ...prev.competition,
                                      hok: { ...prev.competition.hok, logoImage: reader.result as string }
                                    }
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* MLBB */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">Mobile Legends (MLBB)</span>
                      {formData.competition.mlbb.logoImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                mlbb: { ...prev.competition.mlbb, logoImage: '' }
                              }
                            }));
                          }}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer"
                        >
                          Effacer le logo
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {formData.competition.mlbb.logoImage ? (
                        <img
                          src={formData.competition.mlbb.logoImage}
                          alt="MLBB"
                          className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 border border-blue-500/40 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center shrink-0 text-blue-400/50">
                          <Swords className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="URL du logo ou charger un fichier"
                          value={formData.competition.mlbb.logoImage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                mlbb: { ...prev.competition.mlbb, logoImage: val }
                              }
                            }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                        <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-400 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Charger une image (PNG/SVG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setFormData(prev => ({
                                    ...prev,
                                    competition: {
                                      ...prev.competition,
                                      mlbb: { ...prev.competition.mlbb, logoImage: reader.result as string }
                                    }
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* PUBGM */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">PUBG Mobile (PUBGM)</span>
                      {formData.competition.pubgm.logoImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                pubgm: { ...prev.competition.pubgm, logoImage: '' }
                              }
                            }));
                          }}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer"
                        >
                          Effacer le logo
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {formData.competition.pubgm.logoImage ? (
                        <img
                          src={formData.competition.pubgm.logoImage}
                          alt="PUBGM"
                          className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 border border-emerald-500/40 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center shrink-0 text-emerald-400/50">
                          <Target className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="URL du logo ou charger un fichier"
                          value={formData.competition.pubgm.logoImage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                pubgm: { ...prev.competition.pubgm, logoImage: val }
                              }
                            }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                        <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-400 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Charger une image (PNG/SVG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setFormData(prev => ({
                                    ...prev,
                                    competition: {
                                      ...prev.competition,
                                      pubgm: { ...prev.competition.pubgm, logoImage: reader.result as string }
                                    }
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Free Fire */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-400">Free Fire (FF)</span>
                      {formData.competition.ff.logoImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                ff: { ...prev.competition.ff, logoImage: '' }
                              }
                            }));
                          }}
                          className="text-[10px] text-red-400 hover:underline cursor-pointer"
                        >
                          Effacer le logo
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {formData.competition.ff.logoImage ? (
                        <img
                          src={formData.competition.ff.logoImage}
                          alt="FF"
                          className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 border border-orange-500/40 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center shrink-0 text-orange-400/50">
                          <Crosshair className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder="URL du logo ou charger un fichier"
                          value={formData.competition.ff.logoImage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              competition: {
                                ...prev.competition,
                                ff: { ...prev.competition.ff, logoImage: val }
                              }
                            }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                        <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-orange-400 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Charger une image (PNG/SVG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setFormData(prev => ({
                                    ...prev,
                                    competition: {
                                      ...prev.competition,
                                      ff: { ...prev.competition.ff, logoImage: reader.result as string }
                                    }
                                  }));
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTUALITÉS : liste, lien, vidéo, encadré « prochain chapitre » */}
          {activeTab === 'actualites' && <OngletActualites formData={formData} setFormData={setFormData} />}

          {/* PAGES : À propos, bureau, équipes, partenaires, fait marquant */}
          {activeTab === 'pages' && <OngletPages formData={formData} setFormData={setFormData} />}

          {/* TAB 2: DISCIPLINES */}
          {activeTab === 'disciplines' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Activez seulement les disciplines confirmées pour la saison. Une discipline désactivée disparaît de tout
                le site public (accueil, Saison news, rankings, calendrier, joueurs, inscription) ; ses données sont
                conservées et réapparaissent si vous la réactivez. Pensez à « Enregistrer tout ».
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.visual1.titres.map((titre, idx) => {
                  const cle = titre.id as 'hok' | 'mlbb' | 'pubgm' | 'ff';
                  const actif = formData.competition[cle]?.actif !== false;
                  const basculer = () =>
                    setFormData({
                      ...formData,
                      competition: {
                        ...formData.competition,
                        [cle]: { ...formData.competition[cle], actif: !actif },
                      },
                    });
                  return (
                  <div key={titre.id} className={`p-4 rounded-2xl border space-y-3 transition-opacity ${actif ? 'bg-slate-950/60 border-emerald-500/40' : 'bg-slate-950/30 border-slate-800 opacity-70'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-white text-sm">
                        {titre.nom} ({titre.id.toUpperCase()})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {titre.discipline}
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={actif}
                      aria-label={`${titre.nom} : ${actif ? 'active cette saison' : 'masquée sur le site'}`}
                      onClick={basculer}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-left cursor-pointer"
                    >
                      <span className="text-xs font-bold text-white">
                        {actif ? 'Active cette saison' : 'Masquée sur le site'}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {actif ? 'Visible partout sur le site public' : 'Données conservées, rien n’est affiché'}
                        </span>
                      </span>
                      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${actif ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${actif ? 'left-[22px]' : 'left-0.5'}`} />
                      </span>
                    </button>

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
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CALENDRIER */}
          {activeTab === 'calendrier' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Phases de la saison, dans l'ordre d'affichage. Supprimez une phase qui ne concerne qu'une discipline
                désactivée ; le badge (ex. « PRÉSENTIEL ») met la phase en avant.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.visual2.phases.map((phase, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>PHASE {String(idx + 1).padStart(2, '0')}</span>
                      <Commandes
                        liste={formData.visual2.phases}
                        index={idx}
                        onChange={(phases) => setFormData({ ...formData, visual2: { ...formData.visual2, phases } })}
                        nom={phase.titre || 'cette phase'}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Badge (facultatif)</label>
                      <input
                        type="text"
                        value={phase.tag}
                        placeholder="PRÉSENTIEL"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            visual2: {
                              ...formData.visual2,
                              phases: formData.visual2.phases.map((p, j) => (j === idx ? { ...p, tag: e.target.value } : p)),
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
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
              <BoutonAjout
                onClick={() =>
                  setFormData({
                    ...formData,
                    visual2: {
                      ...formData.visual2,
                      phases: [...formData.visual2.phases, { titre: '', sousTitre: '', periode: '', tag: '' }],
                    },
                  })
                }
              >
                Ajouter une phase
              </BoutonAjout>
            </div>
          )}

          {/* TAB 4: MOBA TOURNAMENTS */}
          {activeTab === 'moba' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                Équipes engagées et bilan de saison (V = séries gagnées, N = nulles, D = perdues, M+ / M− = manches gagnées / perdues). Ces chiffres remplissent les tableaux « Ranking ».
              </p>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* HOK Teams */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-amber-400 text-sm">
                    Honor of Kings (16 Équipes)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {renderEquipesMoba('hok')}
                  </div>
                </div>

                {/* MLBB Teams */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-blue-400 text-sm">
                    Mobile Legends (16 Équipes)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {renderEquipesMoba('mlbb')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BATTLE ROYALE ROSTERS */}
          {activeTab === 'tps' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                Les 32 compétiteurs Battle Royale de PUBG Mobile et Free Fire, avec leurs points cumulés et leurs éliminations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* PUBG Mobile */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-emerald-400 text-sm">
                    PUBG Mobile (32 Compétiteurs)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {renderRosterTps('pubgm')}
                  </div>
                </div>

                {/* Free Fire */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="font-display font-bold text-orange-400 text-sm">
                    Free Fire (32 Compétiteurs)
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {renderRosterTps('ff')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PANTHEON */}
          {activeTab === 'pantheon' && (
            <div className="space-y-6">
              <AdminDistinctions data={formData} onChange={setFormData} />
              {/* Panthéon General Texts */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <h4 className="font-display font-bold text-amber-400 text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Titres & Textes Généraux du Panthéon</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Titre Principal de la Page
                    </label>
                    <input
                      type="text"
                      value={formData.pantheon?.titrePrincipal || 'Panthéon'}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pantheon: { ...formData.pantheon, titrePrincipal: e.target.value }
                        });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="Panthéon"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Titre de la section d'attribution
                    </label>
                    <input
                      type="text"
                      value={formData.pantheon?.titreAttribution || 'Comment sont-elles attribuées ?'}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pantheon: { ...formData.pantheon, titreAttribution: e.target.value }
                        });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="Comment sont-elles attribuées ?"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Sous-titre / Description de la page
                    </label>
                    <textarea
                      value={formData.pantheon?.sousTitre || "Les distinctions qui gravent le nom d'un joueur dans l'histoire de l'ELC. Chaque cadre a une couleur fixe, reconnaissable au premier coup d'œil."}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          pantheon: { ...formData.pantheon, sousTitre: e.target.value }
                        });
                      }}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Distinctions Titles & Descriptions */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <h4 className="font-display font-bold text-amber-400 text-sm">
                  Textes et visuels des distinctions
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'goat', defaultTitle: 'G.O.A.T', defaultSub: 'Greatest Of All Time', defaultDesc: 'Décerné au joueur le plus dominant de la saison, toutes disciplines confondues. Une seule attribution par saison.', color: 'text-amber-400 border-amber-500/30' },
                    { key: 'godlike', defaultTitle: 'GodLike', defaultSub: 'Meilleur joueur MOBA', defaultDesc: 'Performance exceptionnelle dans les disciplines MOBA (Honor of Kings, Mobile Legends). Élu sur les stats de la saison entière.', color: 'text-blue-400 border-blue-500/30' },
                    { key: 'demonking', defaultTitle: 'Demon King', defaultSub: 'Meilleur joueur TPS', defaultDesc: 'Domination absolue dans les disciplines Battle Royale (PUBG Mobile, Free Fire). Calculé sur le cumul des points saison.', color: 'text-red-400 border-red-500/30' },
                    { key: 'mvp', defaultTitle: 'MVP', defaultSub: 'Most Valuable Player', defaultDesc: 'Élu par les pairs et les organisateurs pour son impact en jeu et son fair-play exemplaire tout au long de la saison.', color: 'text-teal-400 border-teal-500/30' },
                    ...(formData.pantheon?.distinctions ?? []).filter(d => !['goat','godlike','demonking','mvp'].includes(d.key)).map(d => ({ key:d.key, defaultTitle:d.title, defaultSub:d.subtitle, defaultDesc:d.desc, color:'text-amber-400 border-amber-500/30' })),
                  ].map((card) => {
                    const current = (formData.pantheon?.distinctions || []).find(d => d.key === card.key) || {
                      key: card.key,
                      title: card.defaultTitle,
                      subtitle: card.defaultSub,
                      desc: card.defaultDesc,
                    };

                    const updateDistinction = (field: 'title' | 'subtitle' | 'desc' | 'nomineNom' | 'nominePhoto' | 'nomineHero' | 'fondImage' | 'nomineClan' | 'nomineDetails' | 'nomineStatut', val: string) => {
                      const list = [...(formData.pantheon?.distinctions || [])];
                      const idx = list.findIndex(d => d.key === card.key);
                      if (idx >= 0) {
                        list[idx] = { ...list[idx], [field]: val };
                      } else {
                        list.push({ ...current, [field]: val });
                      }
                      setFormData({
                        ...formData,
                        pantheon: { ...formData.pantheon, distinctions: list }
                      });
                    };

                    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          updateDistinction('nominePhoto', reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    };

                    const handleFondUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          updateDistinction('fondImage', reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    };

                    const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          updateDistinction('nomineHero', reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    };

                    return (
                      <div key={card.key} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className={`text-xs font-bold uppercase ${card.color}`}>
                            {card.defaultTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: {card.key}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Titre du cadre</label>
                            <input
                              type="text"
                              value={current.title}
                              onChange={(e) => updateDistinction('title', e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Sous-titre / Catégorie</label>
                            <input
                              type="text"
                              value={current.subtitle}
                              onChange={(e) => updateDistinction('subtitle', e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Description de la distinction</label>
                          <textarea
                            value={current.desc}
                            onChange={(e) => updateDistinction('desc', e.target.value)}
                            rows={2}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                          />
                        </div>

                        {/* Espace Photo & Profil du Nominé */}
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5" />
                              <span>Espace Nominé / Lauréat ({card.defaultTitle})</span>
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            {/* Photo Thumbnail / Preview */}
                            <div className="relative group shrink-0">
                              {current.nominePhoto ? (
                                <div className="relative">
                                  <img
                                    src={current.nominePhoto}
                                    alt={current.nomineNom || 'Nominé'}
                                    className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 shadow"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateDistinction('nominePhoto', '')}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-400 cursor-pointer shadow"
                                    title="Supprimer la photo"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                                  <User className="w-5 h-5" />
                                  <span className="text-[8px] mt-0.5">Photo</span>
                                </div>
                              )}
                            </div>

                            {/* Inputs for photo URL and upload */}
                            <div className="flex-1 space-y-1.5">
                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">URL de la photo ou fichier</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={current.nominePhoto || ''}
                                    onChange={(e) => updateDistinction('nominePhoto', e.target.value)}
                                    placeholder="https://... ou charger ->"
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder:text-slate-600"
                                  />
                                  <label className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer shrink-0">
                                    <Upload className="w-3 h-3" />
                                    <span>Fichier</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">
                                  Image du héros / personnage du jeu
                                </label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={current.nomineHero || ''}
                                    onChange={(e) => updateDistinction('nomineHero', e.target.value)}
                                    placeholder="https://... (PNG détouré de préférence)"
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder:text-slate-600"
                                  />
                                  <label className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer shrink-0">
                                    <Upload className="w-3 h-3" />
                                    <span>Fichier</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleHeroUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 mb-0.5">
                                  Image de fond de l'affiche
                                </label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={current.fondImage || ''}
                                    onChange={(e) => updateDistinction('fondImage', e.target.value)}
                                    placeholder="https://... (laisser vide = fond sombre par défaut)"
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white placeholder:text-slate-600"
                                  />
                                  <label className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer shrink-0">
                                    <Upload className="w-3 h-3" />
                                    <span>Fichier</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFondUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">Nom / Pseudo</label>
                              <input
                                type="text"
                                value={current.nomineNom || ''}
                                onChange={(e) => updateDistinction('nomineNom', e.target.value)}
                                placeholder="ex: Kratos"
                                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">Clan / Équipe</label>
                              <input
                                type="text"
                                value={current.nomineClan || ''}
                                onChange={(e) => updateDistinction('nomineClan', e.target.value)}
                                placeholder="ex: Vortex Esport"
                                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">Discipline / Stats</label>
                              <input
                                type="text"
                                value={current.nomineDetails || ''}
                                onChange={(e) => updateDistinction('nomineDetails', e.target.value)}
                                placeholder="ex: Honor of Kings · 19/0/12"
                                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">Statut</label>
                              <input
                                type="text"
                                value={current.nomineStatut || ''}
                                onChange={(e) => updateDistinction('nomineStatut', e.target.value)}
                                placeholder="ex: Nominé Officiel"
                                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attribution Steps */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <h4 className="font-display font-bold text-teal-400 text-sm">
                  Étapes d'Attribution (Section « Comment sont-elles attribuées ? »)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { step: '01', defaultTitle: 'Fin de saison', defaultDesc: "Les distinctions sont décernées à l'issue de la dernière journée de compétition, une fois tous les résultats validés." },
                    { step: '02', defaultTitle: 'Calcul des stats', defaultDesc: 'G.O.A.T, GodLike et Demon King sont calculés automatiquement à partir du cumul des points saison par discipline.' },
                    { step: '03', defaultTitle: 'Vote MVP', defaultDesc: 'Le MVP est élu par les joueurs participants et les organisateurs via un formulaire de vote interne.' },
                    { step: '04', defaultTitle: 'Annonce officielle', defaultDesc: "Les lauréats sont annoncés sur les réseaux sociaux de l'ELC et leur profil est mis en avant sur cette page." },
                  ].map((s, sIdx) => {
                    const currentStep = (formData.pantheon?.attributionSteps || [])[sIdx] || {
                      step: s.step,
                      title: s.defaultTitle,
                      desc: s.defaultDesc
                    };

                    const updateStep = (field: 'title' | 'desc', val: string) => {
                      const list = [...(formData.pantheon?.attributionSteps || [
                        { step: '01', title: 'Fin de saison', desc: "Les distinctions sont décernées à l'issue de la dernière journée de compétition, une fois tous les résultats validés." },
                        { step: '02', title: 'Calcul des stats', desc: 'G.O.A.T, GodLike et Demon King sont calculés automatiquement à partir du cumul des points saison par discipline.' },
                        { step: '03', title: 'Vote MVP', desc: 'Le MVP est élu par les joueurs participants et les organisateurs via un formulaire de vote interne.' },
                        { step: '04', title: 'Annonce officielle', desc: "Les lauréats sont annoncés sur les réseaux sociaux de l'ELC et leur profil est mis en avant sur cette page." }
                      ])];
                      list[sIdx] = { ...list[sIdx], [field]: val };
                      setFormData({
                        ...formData,
                        pantheon: { ...formData.pantheon, attributionSteps: list }
                      });
                    };

                    return (
                      <div key={s.step} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-400 px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                            Étape {s.step}
                          </span>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Titre de l'étape</label>
                          <input
                            type="text"
                            value={currentStep.title}
                            onChange={(e) => updateStep('title', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Description de l'étape</label>
                          <textarea
                            value={currentStep.desc}
                            onChange={(e) => updateStep('desc', e.target.value)}
                            rows={2}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Lauréats et personnalités intronisées au Panthéon.
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

      </AdminShell>
    </div>
  );
};

export default AdminPortal;
