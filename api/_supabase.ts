// Accès Supabase via l'API REST (PostgREST) — aucune dépendance npm, on
// utilise le fetch natif de Node 18+. Ce fichier commence par « _ », donc
// Vercel ne l'expose pas comme route : il sert seulement aux fonctions
// voisines (data.ts, admin/check.ts).
//
// Le document du site tient dans une seule ligne (id = 1) de la table
// showcase_data, au même format que data/elc2027-data.json.
//
// La clé utilisée est la « service_role » (jamais l'« anon ») : elle contourne
// les policies RLS et ne quitte jamais le serveur.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export const TABLE = 'showcase_data';
export const ROW_ID = 1;

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

function restUrl(suffix = ''): string {
  return `${String(SUPABASE_URL).replace(/\/$/, '')}/rest/v1/${TABLE}${suffix}`;
}

function headers(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: String(SUPABASE_SERVICE_KEY),
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

// Lit le document unique. Renvoie null tant que la ligne n'existe pas
// (base jamais initialisée — voir scripts/seed-supabase.mjs).
export async function getData(): Promise<any | null> {
  const res = await fetch(restUrl(`?id=eq.${ROW_ID}&select=data`), { headers: headers() });
  if (!res.ok) {
    throw new Error(`Lecture Supabase impossible (${res.status}) : ${await res.text()}`);
  }
  const rows = (await res.json()) as { data: unknown }[];
  return rows.length ? rows[0].data : null;
}

// Crée ou remplace le document unique (upsert sur id = 1).
export async function putData(data: unknown): Promise<void> {
  const res = await fetch(restUrl(), {
    method: 'POST',
    headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({ id: ROW_ID, data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    throw new Error(`Écriture Supabase impossible (${res.status}) : ${await res.text()}`);
  }
}

// --- Authentification admin ---------------------------------------------

const ADMIN_KEY = process.env.ADMIN_KEY;

export const adminKeyConfigured = Boolean(ADMIN_KEY);

// Compare en temps constant pour ne pas laisser fuiter le code caractère par
// caractère via le temps de réponse. Aucun repli sur une valeur par défaut :
// sans ADMIN_KEY côté serveur, personne ne peut écrire.
export function verifyAdminKey(provided: string | undefined | null): boolean {
  if (!ADMIN_KEY || !provided) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(ADMIN_KEY);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
