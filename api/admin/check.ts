// GET /api/admin/check — valide le code administrateur saisi à l'écran de
// connexion du portail d'admin, avant d'ouvrir l'éditeur.
//
// Autonome, comme api/data.ts : pas d'import relatif, qui ferait planter le
// chargement du module en ESM sur Vercel.

const ADMIN_KEY = process.env.ADMIN_KEY;

// Comparaison en temps constant, et aucun repli sur une valeur par défaut :
// sans ADMIN_KEY côté serveur, aucun code n'est accepté.
function verifyAdminKey(provided: string | undefined | null): boolean {
  if (!ADMIN_KEY || !provided) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(ADMIN_KEY);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
}

// Même limitation de débit que sur l'écriture : c'est ici qu'on testerait un
// code en boucle, puisque cette route dit si un code est bon. Le compteur vit
// dans la mémoire de l'instance serverless — remis à zéro à chaque démarrage à
// froid, non partagé entre instances — donc il ralentit fortement une attaque
// depuis une même adresse sans la rendre impossible. La vraie protection reste
// un ADMIN_KEY long et unique.
const FENETRE_MS = 10 * 60 * 1000;
const MAX_ECHECS = 10;
const tentatives = new Map<string, { echecs: number; debut: number }>();

function clientIp(req: Req): string {
  const brut = req.headers['x-forwarded-for'];
  const valeur = Array.isArray(brut) ? brut[0] : brut;
  return (valeur || 'inconnue').split(',')[0].trim();
}

function estBloque(ip: string): boolean {
  const maintenant = Date.now();
  for (const [cle, suivi] of tentatives) {
    if (maintenant - suivi.debut > FENETRE_MS) tentatives.delete(cle);
  }
  const suivi = tentatives.get(ip);
  return Boolean(suivi && suivi.echecs >= MAX_ECHECS);
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

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

export default function handler(req: Req, res: Res): void {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
    return;
  }

  if (!ADMIN_KEY) {
    res.status(500).json({
      error: "La variable d'environnement ADMIN_KEY n'est pas définie sur le projet Vercel.",
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

  const raw = req.headers['x-admin-key'];
  const provided = (Array.isArray(raw) ? raw[0] : raw) || (req.query.key as string | undefined);

  if (verifyAdminKey(provided)) {
    tentatives.delete(ip);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ ok: true, storage: 'supabase' });
  } else {
    noterEchec(ip);
    res.status(401).json({ error: 'Code administrateur invalide ou manquant.', code: 'unauthorized' });
  }
}
