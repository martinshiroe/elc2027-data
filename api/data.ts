// GET  /api/data — lecture publique des données du site.
// POST /api/data — écriture, réservée à l'admin (en-tête x-admin-key).
//
// Fonction serverless Vercel. Elle remplace server.ts, qui ne tourne que sur
// une machine locale : Vercel ne déploie que la sortie statique de Vite, donc
// sans cette fonction /api/data renvoyait la page index.html et aucune
// modification de l'admin n'était jamais enregistrée.
//
// Les données vivent dans Supabase, pas sur le disque : le disque d'une
// fonction serverless est éphémère et propre à chaque instance, deux appareils
// n'y verraient jamais la même chose.
//
// Ce fichier est volontairement autonome — aucun import relatif. Le dépôt est
// en "type": "module" et Vercel exécute la fonction compilée en ESM, où un
// import sans extension (« ./_supabase ») fait planter le chargement du module
// avant même que le handler ne s'exécute.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;

const TABLE = 'showcase_data';
const ROW_ID = 1;

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

// Compare en temps constant, pour ne pas laisser fuiter le code caractère par
// caractère via le temps de réponse. Aucun repli sur une valeur par défaut :
// sans ADMIN_KEY côté serveur, personne ne peut écrire.
function verifyAdminKey(provided: string | undefined | null): boolean {
  if (!ADMIN_KEY || !provided) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(ADMIN_KEY);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

// --- Limitation de débit sur les tentatives d'écriture ------------------
//
// Le code admin est un secret partagé : sans frein, on peut le tester en
// boucle. Le compteur vit dans la mémoire de l'instance serverless, donc il
// est remis à zéro à chaque démarrage à froid et n'est pas partagé entre
// instances : ce n'est pas un rempart absolu, mais il rend une attaque par
// force brute très lente depuis une même adresse. Le vrai rempart reste un
// ADMIN_KEY long et unique.
const FENETRE_MS = 10 * 60 * 1000;
const MAX_ECHECS = 10;
const tentatives = new Map<string, { echecs: number; debut: number }>();

function clientIp(req: Req): string {
  const brut = req.headers['x-forwarded-for'];
  const valeur = Array.isArray(brut) ? brut[0] : brut;
  return (valeur || 'inconnue').split(',')[0].trim();
}

// Purge les fenêtres expirées pour que la Map ne grossisse pas indéfiniment.
function purger(maintenant: number): void {
  for (const [ip, suivi] of tentatives) {
    if (maintenant - suivi.debut > FENETRE_MS) tentatives.delete(ip);
  }
}

function estBloque(ip: string): boolean {
  const maintenant = Date.now();
  purger(maintenant);
  const suivi = tentatives.get(ip);
  if (!suivi) return false;
  if (maintenant - suivi.debut > FENETRE_MS) {
    tentatives.delete(ip);
    return false;
  }
  return suivi.echecs >= MAX_ECHECS;
}

function noterEchec(ip: string): void {
  const maintenant = Date.now();
  const suivi = tentatives.get(ip);
  if (!suivi || maintenant - suivi.debut > FENETRE_MS) {
    tentatives.set(ip, { echecs: 1, debut: maintenant });
  } else {
    suivi.echecs += 1;
  }
}

function noterSucces(ip: string): void {
  tentatives.delete(ip);
}

// --- Validation du document reçu ---------------------------------------
//
// Le corps d'un POST remplace l'intégralité du contenu du site. Une erreur de
// forme ne doit pas pouvoir laisser la vitrine dans un état incohérent.
const TAILLE_MAX_OCTETS = 2 * 1024 * 1024;

function estObjet(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function valider(corps: unknown): string | null {
  if (!estObjet(corps)) return 'Données invalides : un objet JSON est attendu.';
  if (!estObjet(corps.meta)) return 'Données incomplètes : la section « meta » est obligatoire.';
  if (!estObjet(corps.competition)) return 'Données incomplètes : la section « competition » est obligatoire.';

  const disciplines = ['hok', 'mlbb', 'pubgm', 'ff'];
  const manquantes = disciplines.filter(d => !estObjet((corps.competition as Record<string, unknown>)[d]));
  if (manquantes.length) {
    return `Données incomplètes : discipline(s) manquante(s) — ${manquantes.join(', ')}.`;
  }

  if (corps.joueurs !== undefined && !Array.isArray(corps.joueurs)) {
    return 'Données invalides : « joueurs » doit être une liste.';
  }
  if (corps.videos !== undefined && !Array.isArray(corps.videos)) {
    return 'Données invalides : « videos » doit être une liste.';
  }
  if (corps.pantheon !== undefined && !estObjet(corps.pantheon)) {
    return 'Données invalides : « pantheon » doit être un objet.';
  }

  const taille = Buffer.byteLength(JSON.stringify(corps), 'utf8');
  if (taille > TAILLE_MAX_OCTETS) {
    return `Document trop volumineux (${Math.round(taille / 1024)} Ko pour un maximum de ${TAILLE_MAX_OCTETS / 1024} Ko). Utilisez des URL d'images plutôt que des fichiers intégrés.`;
  }
  return null;
}

interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

function header(req: Req, name: string): string | undefined {
  const raw = req.headers[name];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    res.status(500).json({
      error: "Stockage non configuré : SUPABASE_URL et SUPABASE_SERVICE_KEY sont absents des variables d'environnement du projet Vercel.",
    });
    return;
  }

  // --- Lecture (libre) ---
  if (req.method === 'GET') {
    try {
      const r = await fetch(restUrl(`?id=eq.${ROW_ID}&select=data`), { headers: headers() });
      if (!r.ok) throw new Error(`Supabase a répondu ${r.status} : ${await r.text()}`);
      const rows = (await r.json()) as { data: unknown }[];
      if (!rows.length) {
        res.status(404).json({
          error: "Aucune donnée dans Supabase (table showcase_data vide). Lancez l'import initial : node scripts/seed-supabase.mjs",
        });
        return;
      }
      // Sans cette en-tête, un navigateur mobile ou un proxy opérateur peut
      // resservir une réponse périmée et masquer les dernières modifications.
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json(rows[0].data);
    } catch (err) {
      res.status(500).json({ error: 'Impossible de lire les données.', details: String((err as Error).message || err) });
    }
    return;
  }

  // --- Écriture (protégée) ---
  if (req.method === 'POST') {
    if (!ADMIN_KEY) {
      res.status(500).json({
        error: "Écriture impossible : la variable d'environnement ADMIN_KEY n'est pas définie sur le projet Vercel.",
      });
      return;
    }
    const ip = clientIp(req);
    if (estBloque(ip)) {
      res.setHeader('Retry-After', String(FENETRE_MS / 1000));
      res.status(429).json({
        error: 'Trop de tentatives échouées. Réessayez dans quelques minutes.',
        code: 'rate_limited',
      });
      return;
    }

    const provided = header(req, 'x-admin-key') || (req.query.key as string | undefined);
    if (!verifyAdminKey(provided)) {
      noterEchec(ip);
      res.status(401).json({ error: 'Code administrateur invalide ou manquant.', code: 'unauthorized' });
      return;
    }
    noterSucces(ip);

    const erreur = valider(req.body);
    if (erreur) {
      res.status(400).json({ error: erreur });
      return;
    }
    const incoming = req.body as Record<string, any>;

    try {
      incoming.meta.derniereMaj = new Date().toISOString();
      const r = await fetch(restUrl(), {
        method: 'POST',
        headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ id: ROW_ID, data: incoming, updated_at: new Date().toISOString() }),
      });
      if (!r.ok) throw new Error(`Supabase a répondu ${r.status} : ${await r.text()}`);
      res.status(200).json({ ok: true, savedAt: incoming.meta.derniereMaj });
    } catch (err) {
      res.status(500).json({ error: "Impossible d'enregistrer les données.", details: String((err as Error).message || err) });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
}
