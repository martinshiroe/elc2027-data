// GET  /api/data — lecture publique des données du site.
// POST /api/data — écriture, réservée à l'admin (en-tête x-admin-key).
//
// Fonction serverless Vercel. Elle remplace server.ts, qui ne tourne que sur
// une machine locale : Vercel ne déploie que la sortie statique de Vite, donc
// sans cette fonction /api/data renvoyait la page index.html et aucune
// modification de l'admin n'était jamais enregistrée.
//
// Les données vivent dans Supabase (voir _supabase.ts), pas sur le disque :
// le disque d'une fonction serverless est éphémère et propre à chaque
// instance, deux appareils n'y verraient jamais la même chose.

import { getData, putData, supabaseConfigured, adminKeyConfigured, verifyAdminKey } from './_supabase';

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
  if (!supabaseConfigured) {
    res.status(500).json({
      error: 'Stockage non configuré : SUPABASE_URL et SUPABASE_SERVICE_KEY sont absents des variables d\'environnement du projet Vercel.',
    });
    return;
  }

  // --- Lecture (libre) ---
  if (req.method === 'GET') {
    try {
      const data = await getData();
      if (!data) {
        res.status(404).json({
          error: 'Aucune donnée dans Supabase (table showcase_data vide). Lancez l\'import initial : node scripts/seed-supabase.mjs',
        });
        return;
      }
      // Sans cette en-tête, un navigateur mobile ou un proxy opérateur peut
      // resservir une réponse périmée et masquer les dernières modifications.
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Impossible de lire les données.', details: String((err as Error).message || err) });
    }
    return;
  }

  // --- Écriture (protégée) ---
  if (req.method === 'POST') {
    if (!adminKeyConfigured) {
      res.status(500).json({
        error: 'Écriture impossible : la variable d\'environnement ADMIN_KEY n\'est pas définie sur le projet Vercel.',
      });
      return;
    }
    const provided = header(req, 'x-admin-key') || (req.query.key as string | undefined);
    if (!verifyAdminKey(provided)) {
      res.status(401).json({ error: 'Code administrateur invalide ou manquant.', code: 'unauthorized' });
      return;
    }

    const incoming = req.body as Record<string, any> | undefined;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      res.status(400).json({ error: 'Données invalides.' });
      return;
    }
    // Garde-fou : un corps sans meta ni competition n'est pas un document du
    // site, et l'écrire écraserait tout le contenu par une coquille vide.
    if (!incoming.meta || !incoming.competition) {
      res.status(400).json({ error: 'Données incomplètes : les sections « meta » et « competition » sont obligatoires.' });
      return;
    }

    try {
      incoming.meta.derniereMaj = new Date().toISOString();
      await putData(incoming);
      res.status(200).json({ ok: true, savedAt: incoming.meta.derniereMaj });
    } catch (err) {
      res.status(500).json({ error: 'Impossible d\'enregistrer les données.', details: String((err as Error).message || err) });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
}
