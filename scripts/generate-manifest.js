// Scans each writeups/<folder> and writes writeups/manifest.json listing the PDFs found.
// Runs automatically on every Netlify deploy (see netlify.toml). To test locally, run:
//   node scripts/generate-manifest.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'writeups');

// slug (used by script.js) -> folder name on disk (must match exactly, case-sensitive)
const FOLDERS = {
  letsdefend: 'LetsDefend_labs',
  seedlabs:   'Seed_Labs',
  splunk:     'Splunk_Labs',
  huntress:   'Huntress_CTF_2025',
  leetcode:   'leetCode'
};

const manifest = {};
for (const [slug, folder] of Object.entries(FOLDERS)) {
  const dir = path.join(ROOT, folder);
  let files = [];
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir)
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }
  manifest[slug] = files;
}

fs.writeFileSync(path.join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Wrote writeups/manifest.json:', JSON.stringify(manifest));
