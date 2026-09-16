import React, { useState, useMemo } from 'react';
import {
  Play, Film, Search, ExternalLink,
  X, Sparkles, Filter, Clock, Eye, AlertCircle, Share2
} from 'lucide-react';
import { ELCData, ELCVideo } from '../types';
import { YoutubeIcon, TikTokIcon } from './SocialIcons';

interface PageVideosProps {
  data: ELCData;
  onUpdateVideos?: (videos: ELCVideo[]) => void;
}

// Helper to extract YouTube video ID from various URL formats
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const PageVideos: React.FC<PageVideosProps> = ({ data }) => {
  const videos = data.videos || [];

  const [activePlatform, setActivePlatform] = useState<'all' | 'youtube' | 'tiktok'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active video for modal playback
  const [playingVideo, setPlayingVideo] = useState<ELCVideo | null>(null);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Platform filter
      if (activePlatform !== 'all' && video.plateforme !== activePlatform) return false;

      // Category filter
      if (activeCategory !== 'all' && video.categorie !== activeCategory) return false;

      // Discipline filter
      if (activeDiscipline !== 'all' && video.discipline !== activeDiscipline) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = video.titre.toLowerCase().includes(q);
        const matchesDesc = (video.description || '').toLowerCase().includes(q);
        const matchesDiscipline = (video.discipline || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDiscipline) return false;
      }

      return true;
    });
  }, [videos, activePlatform, activeCategory, activeDiscipline, searchQuery]);

  // Featured video for Hero Showcase
  const featuredVideo = useMemo(() => {
    return videos.find((v) => v.featured) || videos[0] || null;
  }, [videos]);

  const getDisciplineLabel = (disc?: string) => {
    switch (disc) {
      case 'hok':
        return 'Honor of Kings';
      case 'mlbb':
        return 'Mobile Legends';
      case 'pubgm':
        return 'PUBG Mobile';
      case 'ff':
        return 'Free Fire';
      default:
        return 'Général ELC';
    }
  };

  const getCategoryLabel = (cat?: string) => {
    switch (cat) {
      case 'highlight':
        return 'Highlights';
      case 'match':
        return 'Match Complet';
      case 'clip':
        return 'Clip Court';
      case 'teaser':
        return 'Bande-Annonce';
      case 'tutoriel':
        return 'Guide / Tuto';
      default:
        return 'Vidéo';
    }
  };

  const youtubeUrl = data.meta.reseaux.youtube || 'https://youtube.com/@east_ligue?si=GyP5LXjM-BFQhKQE';
  const tiktokUrl = data.meta.reseaux.tiktok || 'https://www.tiktok.com/@east_ligue';

  return (
    <div className="py-8 space-y-10">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-rose-500/5 to-transparent rounded-full pointer-events-none blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/25 mb-3">
                <Film className="w-3.5 h-3.5" />
                <span>Vitrine Médias & Vidéos</span>
              </div>
              <h1 className="font-audiowide text-3xl sm:text-4xl text-white mb-2">
                Replays, Highlights & Clips Officiels
              </h1>
              <p className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed font-light">
                Plongez au cœur de l'East League of Cameroun 2027. Consultez toutes les vidéos officielles issues de nos chaînes YouTube et TikTok.
              </p>
            </div>

            {/* Actions: Social channels */}
            <div className="flex flex-wrap items-center gap-3">
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/30 text-xs font-medium transition-all cursor-pointer"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span>Chaîne YouTube</span>
                </a>
              )}

              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/[0.12] text-xs font-medium transition-all cursor-pointer"
                >
                  <TikTokIcon className="w-4 h-4 text-cyan-400" />
                  <span>Compte TikTok</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CAS 1 : AUCUNE VIDÉO OFFICIELLE PUBLIÉE */}
      {videos.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#121212] border border-white/[0.08] p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-teal-400 mx-auto mb-6 flex items-center justify-center">
                <Film className="w-10 h-10" />
              </div>

              <h2 className="font-audiowide text-2xl sm:text-3xl text-white mb-3">
                Lancement des vidéos très bientôt
              </h2>

              <p className="text-sm text-white/60 leading-relaxed font-light mb-8">
                Les premières retransmissions de matchs, résumés de poules et clips officiels de l'East League of Cameroun Saison 2027 seront publiés ici dès les premières rencontres de la compétition.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Carte YouTube */}
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#181818] border border-white/[0.08] hover:border-red-500/40 transition-all group flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <YoutubeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-red-300 transition-colors">
                      Chaîne YouTube Officielle
                    </div>
                    <div className="text-[11px] text-white/40 mt-1">
                      Matchs complets, vods et trailers HD
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] text-red-400 font-mono mt-2">
                      <span>S'abonner</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>

                {/* Carte TikTok */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#181818] border border-white/[0.08] hover:border-cyan-500/40 transition-all group flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TikTokIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      Compte TikTok Officiel
                    </div>
                    <div className="text-[11px] text-white/40 mt-1">
                      Clips courts, coulisses et best-of
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-mono mt-2">
                      <span>Suivre @east_ligue</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* FEATURED HERO VIDEO (Spotlight) */}
          {featuredVideo && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                onClick={() => setPlayingVideo(featuredVideo)}
                className="group relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#121212] cursor-pointer shadow-2xl transition-all duration-300 hover:border-teal-500/40"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Thumbnail side with play overlay */}
                  <div className="lg:col-span-7 relative aspect-video overflow-hidden bg-black">
                    <img
                      src={featuredVideo.miniature}
                      alt={featuredVideo.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#121212]" />

                    {/* Big Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-teal-500/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-teal-400 transition-all duration-300">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </div>
                    </div>

                    {/* Badges on Thumbnail */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/90 text-slate-950 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>À la Une</span>
                      </span>
                      {featuredVideo.plateforme === 'youtube' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-semibold backdrop-blur-md">
                          <YoutubeIcon className="w-3.5 h-3.5" />
                          <span>YouTube</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/80 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
                          <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>TikTok</span>
                        </span>
                      )}
                    </div>

                    {featuredVideo.duree && (
                      <div className="absolute bottom-4 right-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-white/90 bg-black/80 backdrop-blur-md">
                          <Clock className="w-3 h-3" />
                          <span>{featuredVideo.duree}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info side */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-white/[0.06] text-teal-400 border border-teal-500/30">
                          {getDisciplineLabel(featuredVideo.discipline)}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-white/[0.06] text-white/70">
                          {getCategoryLabel(featuredVideo.categorie)}
                        </span>
                      </div>

                      <h3 className="font-audiowide text-xl sm:text-2xl text-white mb-3 leading-snug group-hover:text-teal-300 transition-colors">
                        {featuredVideo.titre}
                      </h3>

                      {featuredVideo.description && (
                        <p className="text-xs sm:text-sm text-white/60 line-clamp-4 leading-relaxed font-light mb-4">
                          {featuredVideo.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                        <span>{featuredVideo.date || 'Saison 2027'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideo(featuredVideo);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-black font-semibold text-xs hover:bg-teal-400 transition-all cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Lancer la vidéo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar: Platform Tabs, Category Pills & Search */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#141414] border border-white/[0.08]">
              {/* Platform Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActivePlatform('all')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    activePlatform === 'all'
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/[0.04] text-white/70 border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Toutes ({videos.length})</span>
                </button>

                <button
                  onClick={() => setActivePlatform('youtube')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    activePlatform === 'youtube'
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/40'
                      : 'bg-white/[0.04] text-white/70 border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  <span>YouTube ({videos.filter((v) => v.plateforme === 'youtube').length})</span>
                </button>

                <button
                  onClick={() => setActivePlatform('tiktok')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    activePlatform === 'tiktok'
                      ? 'bg-slate-900 text-cyan-400 border-cyan-500/50 shadow-lg'
                      : 'bg-white/[0.04] text-white/70 border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TikTok ({videos.filter((v) => v.plateforme === 'tiktok').length})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une vidéo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white placeholder-white/40 focus:outline-none focus:border-teal-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Filters: Disciplines */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-white/40 font-mono text-[11px] uppercase mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Discipline :
              </span>
              {[
                { id: 'all', label: 'Toutes les disciplines' },
                { id: 'general', label: 'ELC Général' },
                { id: 'hok', label: 'Honor of Kings' },
                { id: 'mlbb', label: 'Mobile Legends' },
                { id: 'pubgm', label: 'PUBG Mobile' },
                { id: 'ff', label: 'Free Fire' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDiscipline(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                    activeDiscipline === d.id
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-semibold'
                      : 'bg-[#141414] text-white/60 border-white/[0.06] hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredVideos.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#141414] border border-white/[0.08]">
                <Film className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white/80 mb-1">
                  Aucune vidéo ne correspond à vos filtres
                </h3>
                <p className="text-xs text-white/40 mb-4">
                  Essayez de réinitialiser la recherche ou de changer de plateforme.
                </p>
                <button
                  onClick={() => {
                    setActivePlatform('all');
                    setActiveCategory('all');
                    setActiveDiscipline('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs text-white font-medium transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setPlayingVideo(video)}
                    className="group rounded-2xl bg-[#141414] border border-white/[0.08] hover:border-teal-500/40 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                      <img
                        src={video.miniature}
                        alt={video.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Platform Tag */}
                      <div className="absolute top-3 left-3">
                        {video.plateforme === 'youtube' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-600/90 text-white text-[11px] font-semibold backdrop-blur-md">
                            <YoutubeIcon className="w-3 h-3" />
                            <span>YouTube</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/80 border border-white/20 text-white text-[11px] font-semibold backdrop-blur-md">
                            <TikTokIcon className="w-3 h-3 text-cyan-400" />
                            <span>TikTok</span>
                          </span>
                        )}
                      </div>

                      {/* Duration Badge */}
                      {video.duree && (
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-white/90 bg-black/80 backdrop-blur-md">
                            {video.duree}
                          </span>
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-teal-500 text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.06] text-teal-400 border border-teal-500/20">
                            {getDisciplineLabel(video.discipline)}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] text-white/60">
                            {getCategoryLabel(video.categorie)}
                          </span>
                        </div>

                        <h3 className="font-sans font-medium text-sm sm:text-base text-white line-clamp-2 leading-snug group-hover:text-teal-300 transition-colors mb-2">
                          {video.titre}
                        </h3>

                        {video.description && (
                          <p className="text-xs text-white/50 line-clamp-2 font-light leading-relaxed">
                            {video.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40 font-mono">
                        <span>{video.date || 'Saison 2027'}</span>
                        <span className="text-teal-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          Visionner
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL LECTEUR VIDÉO INTERACTIF                                           */}
      {/* ========================================================================= */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#141414] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0e0e0e]">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                {playingVideo.plateforme === 'youtube' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-semibold uppercase shrink-0">
                    <YoutubeIcon className="w-3 h-3" />
                    <span>YouTube</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold uppercase shrink-0">
                    <TikTokIcon className="w-3 h-3" />
                    <span>TikTok</span>
                  </span>
                )}
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                  {playingVideo.titre}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={playingVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors"
                  title="Ouvrir sur la plateforme officielle"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Player Frame */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {playingVideo.plateforme === 'youtube' ? (
                (() => {
                  const ytId = extractYouTubeId(playingVideo.url);
                  if (ytId) {
                    return (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                        title={playingVideo.titre}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <div className="p-8 text-center text-white/60 text-xs">
                      <p className="mb-4">Impossible de charger le lecteur intégré pour ce lien.</p>
                      <a
                        href={playingVideo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Ouvrir sur YouTube</span>
                      </a>
                    </div>
                  );
                })()
              ) : (
                /* TikTok video preview / redirect */
                <div className="p-8 text-center flex flex-col items-center justify-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-cyan-400 mb-4 shadow-lg">
                    <TikTokIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2">
                    Regarder ce clip sur TikTok
                  </h4>
                  <p className="text-xs text-white/60 mb-6 leading-relaxed">
                    Les vidéos TikTok officielles de la ligue se visionnent directement sur l'application ou le site officiel @east_ligue.
                  </p>
                  <a
                    href={playingVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
                  >
                    <span>Ouvrir sur TikTok</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Video Details Footer */}
            <div className="p-6 bg-[#0e0e0e] border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-teal-400">
                    {getDisciplineLabel(playingVideo.discipline)}
                  </span>
                  <span className="text-xs text-white/30">•</span>
                  <span className="text-xs text-white/50">
                    {getCategoryLabel(playingVideo.categorie)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {playingVideo.titre}
                </h3>
              </div>

              <a
                href={playingVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-medium border border-white/[0.1] transition-colors"
              >
                <span>Accéder au lien source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageVideos;
