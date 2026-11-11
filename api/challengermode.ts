import type { EquipeChallengermode, VitrineChallengermode } from '../src/lib/challengermode.js';

const TOURNOIS = {
  hok: '2c12729a-7bcc-4eb9-e4bc-08df3e4c1535',
  mlbb: '9ae20484-421e-45c3-e4c2-08df3e4c1535',
} as const;
const TTL = 5 * 60_000;
const MAX_STALE = 24 * 60 * 60_000;

// Fixed read-only query: visitors cannot choose arbitrary operations or tournaments.
export const QUERY = `query VitrineELC($hok: UUID!, $mlbb: UUID!) {
  hok: tournament(tournamentId: $hok) { ...VitrineTournoi }
  mlbb: tournament(tournamentId: $mlbb) { ...VitrineTournoi }
}
fragment VitrineTournoi on Tournament {
  id
  attendance {
    signups { lineupCount lineups(limit: 32, skip: 0) { ...VitrineEquipe } }
    roster { lineupCount lineups(limit: 32) { ...VitrineEquipe } }
  }
}
fragment VitrineEquipe on TournamentLineup {
  id name disqualified logo(size: MEDIUM) { url }
  members { captain user { id username } }
}`;

interface Lineup {
  id: string; name: string; disqualified: boolean; logo?: { url: string } | null;
  members: ({ captain: boolean; user: { id: string; username: string } } | null)[];
}
interface Tournament {
  id: string;
  attendance: {
    signups: { lineupCount: number; lineups: Lineup[] };
    roster: { lineupCount: number; lineups: Lineup[] } | null;
  };
}

export function extraireEquipes(data: Record<string, Tournament | null>): EquipeChallengermode[] {
  return Object.entries(TOURNOIS).flatMap(([jeu, id]) => {
    const tournament = data[jeu];
    if (!tournament || tournament.id !== id) throw new Error('Tournoi inaccessible');
    // Before the start roster is null: the public showcase must use signups.
    // Once available, roster is authoritative (including an empty roster).
    const source = tournament.attendance.roster ?? tournament.attendance.signups;
    if (!source || !Array.isArray(source.lineups) || source.lineupCount !== source.lineups.length) {
      throw new Error('Liste des équipes incomplète');
    }
    const seen = new Set<string>();
    return source.lineups.filter(l => !l.disqualified && !seen.has(l.id) && !!seen.add(l.id)).map(l => ({
      id: `${jeu}:${l.id}`,
      jeu: jeu as 'hok' | 'mlbb',
      nom: l.name,
      logo: l.logo?.url?.startsWith('https://') ? l.logo.url : undefined,
      tournoiUrl: `https://www.challengermode.com/s/EastLeagueCameroon/tournaments/${id}`,
      membres: l.members.filter(m => m !== null).map(m => ({
        id: m.user.id, pseudo: m.user.username, capitaine: m.captain,
      })),
    }));
  });
}

// Isolated factory for deterministic tests; no credentials are returned or logged.
export function creerService(fetcher: typeof fetch = fetch, now = Date.now, key = () => process.env.CHALLENGERMODE_REFRESH_KEY) {
  let access: { value: string; expiresAt: number } | undefined;
  let cached: VitrineChallengermode | undefined;
  let pending: Promise<VitrineChallengermode> | undefined;
  let retryAt = 0;

  async function token() {
    if (access && access.expiresAt > now() + 60_000) return access.value;
    const refreshKey = key()?.trim();
    if (!refreshKey) throw new Error('Configuration manquante');
    const res = await fetcher('https://publicapi.challengermode.com/mk1/v1/auth/access_keys', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshKey }), signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error('Authentification indisponible');
    const value = await res.json();
    const expiresAt = Date.parse(value.expiresAt);
    if (typeof value.value !== 'string' || !value.value || !Number.isFinite(expiresAt) || expiresAt <= now()) throw new Error('Jeton invalide');
    access = { value: value.value, expiresAt };
    return access.value;
  }

  async function refresh(): Promise<VitrineChallengermode> {
    const res = await fetcher('https://publicapi.challengermode.com/graphql', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
      body: JSON.stringify({ query: QUERY, variables: TOURNOIS }), signal: AbortSignal.timeout(15_000),
    });
    if (res.status === 401) access = undefined;
    if (!res.ok) throw new Error('API indisponible');
    const body = await res.json();
    if (body.errors?.length || !body.data) throw new Error('Réponse GraphQL incomplète');
    const result = { equipes: extraireEquipes(body.data), updatedAt: new Date(now()).toISOString(), stale: false };
    cached = result;
    return result;
  }

  return async (): Promise<VitrineChallengermode> => {
    if (cached && now() - Date.parse(cached.updatedAt) < TTL) return cached;
    if (!pending && now() >= retryAt) {
      pending = refresh().catch(() => {
        retryAt = now() + 60_000;
        throw new Error('Synchronisation indisponible');
      }).finally(() => { pending = undefined; });
    }
    try {
      if (pending) return await pending;
    } catch { /* Serve the last successful snapshot during a temporary outage. */ }
    if (cached && now() - Date.parse(cached.updatedAt) <= MAX_STALE) return { ...cached, stale: true };
    throw new Error('Synchronisation indisponible');
  };
}

const lireVitrine = creerService();
interface ResponseAPI {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseAPI;
  json(value: unknown): void;
}
export default async function handler(req: { method?: string }, res: ResponseAPI) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }
  try {
    const result = await lireVitrine();
    res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${result.stale ? 60 : 300}, stale-while-revalidate=60`);
    return res.status(200).json(result);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Retry-After', '60');
    return res.status(503).json({ error: 'Les équipes Challengermode sont temporairement indisponibles.' });
  }
}
