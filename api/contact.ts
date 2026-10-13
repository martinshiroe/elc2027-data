// POST /api/contact — reçoit le formulaire de la page Contact.
//
// Les messages sont enregistrés dans la table Supabase `messages_contact`
// (création : scripts/messages-contact.sql) et se consultent depuis le tableau
// de bord Supabase. Aucune adresse email n'est exposée au navigateur.
//
// Autonome, comme api/data.ts : pas d'import relatif, qui ferait planter le
// chargement du module en ESM sur Vercel.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TABLE = 'messages_contact';

interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

// --- Limitation de débit ------------------------------------------------
//
// Cinq messages par adresse IP et par heure. Le compteur vit dans la mémoire
// de l'instance serverless : il freine un envoi en rafale depuis une même
// adresse sans prétendre à une protection absolue.
const FENETRE_MS = 60 * 60 * 1000;
const MAX_ENVOIS = 5;
const envois = new Map<string, { nombre: number; debut: number }>();

function clientIp(req: Req): string {
  const brut = req.headers['x-forwarded-for'];
  const valeur = Array.isArray(brut) ? brut[0] : brut;
  return (valeur || 'inconnue').split(',')[0].trim();
}

function depasseLaLimite(ip: string): boolean {
  const maintenant = Date.now();
  for (const [cle, suivi] of envois) {
    if (maintenant - suivi.debut > FENETRE_MS) envois.delete(cle);
  }
  const suivi = envois.get(ip);
  if (!suivi) {
    envois.set(ip, { nombre: 1, debut: maintenant });
    return false;
  }
  suivi.nombre += 1;
  return suivi.nombre > MAX_ENVOIS;
}

// --- Validation -----------------------------------------------------------

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texte(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const propre = v.trim();
  if (!propre || propre.length > max) return null;
  return propre;
}

export default async function handler(req: Req, res: Res): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Méthode non autorisée.' });
    return;
  }

  let corps = req.body;
  if (typeof corps === 'string') {
    try {
      corps = JSON.parse(corps);
    } catch {
      res.status(400).json({ error: 'Corps de requête illisible.' });
      return;
    }
  }
  const c = (corps ?? {}) as Record<string, unknown>;

  // Champ piège : invisible pour un visiteur, rempli par les robots. On répond
  // comme si tout allait bien pour ne pas leur apprendre à l'éviter.
  if (typeof c.site === 'string' && c.site.trim() !== '') {
    res.status(200).json({ ok: true });
    return;
  }

  const nom = texte(c.nom, 120);
  const email = texte(c.email, 200);
  const message = texte(c.message, 4000);
  if (!nom || !email || !message || !EMAIL_VALIDE.test(email)) {
    res.status(400).json({ error: 'Nom, email valide et message sont requis.' });
    return;
  }

  if (depasseLaLimite(clientIp(req))) {
    res.setHeader('Retry-After', String(FENETRE_MS / 1000));
    res.status(429).json({ error: 'Trop de messages envoyés. Réessayez plus tard.' });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    res.status(503).json({ error: "L'enregistrement des messages n'est pas configuré." });
    return;
  }

  try {
    const r = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ nom, email, message }),
    });
    if (!r.ok) throw new Error(`Supabase a répondu ${r.status} : ${await r.text()}`);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Échec de l’enregistrement du message de contact :', err);
    res.status(502).json({ error: "Le message n'a pas pu être enregistré." });
  }
}
