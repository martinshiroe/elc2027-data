// Import initial : copie data/elc2027-data.json dans la table Supabase
// showcase_data, que la fonction /api/data lit ensuite en production.
//
// À lancer une seule fois, au moment de la mise en place — ou plus tard pour
// repartir du contenu versionné dans le dépôt.
//
//   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/seed-supabase.mjs
//
// Ajoutez --force pour écraser une ligne déjà présente (sinon le script
// s'arrête plutôt que de remplacer des données saisies depuis l'admin).

import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TABLE = 'showcase_data';
const ROW_ID = 1;
const force = process.argv.includes('--force');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_KEY sont obligatoires.');
  process.exit(1);
}

const base = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${TABLE}`;
const headers = (extra) => ({
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
  ...extra,
});

const file = path.join(process.cwd(), 'data', 'elc2027-data.json');
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

const existing = await fetch(`${base}?id=eq.${ROW_ID}&select=updated_at`, { headers: headers() });
if (!existing.ok) {
  console.error(`Lecture impossible (${existing.status}) : ${await existing.text()}`);
  process.exit(1);
}
const rows = await existing.json();
if (rows.length && !force) {
  console.error(`La table contient déjà des données (dernière écriture : ${rows[0].updated_at}).`);
  console.error('Relancez avec --force pour les remplacer par le contenu de data/elc2027-data.json.');
  process.exit(1);
}

const res = await fetch(base, {
  method: 'POST',
  headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
  body: JSON.stringify({ id: ROW_ID, data, updated_at: new Date().toISOString() }),
});
if (!res.ok) {
  console.error(`Écriture impossible (${res.status}) : ${await res.text()}`);
  process.exit(1);
}

console.log(`Importé : ${file}`);
console.log(`Dernière modification portée par les données : ${data?.meta?.derniereMaj ?? 'inconnue'}`);
