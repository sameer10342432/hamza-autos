const https = require('https');
const fs = require('fs');

const queries = [
  'mechanic motorcycle workshop',
  'motorcycle repair shop',
  'motorcycle engine repair',
  'motorcycle carburetor',
  'motorcycle oil change',
  'motorcycle tire repair',
  'puncture repair motorcycle',
  'motorcycle brake repair',
  'motorcycle clutch repair',
  'motorcycle spare parts',
  'motorcycle wiring',
  'motorcycle India',
  'motorcycle Pakistan',
  'motorcycle Lahore',
  'Honda CG125',
  'Honda CD70',
  'Yamaha YBR125',
  'Suzuki motorcycle'
];

async function search(q) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'HamzaAutosApp/1.0 (info@hamzaautos.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          const results = [];
          for (const id in pages) {
            const p = pages[id];
            const info = p.imageinfo?.[0];
            if (!info || !info.url.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
            const meta = info.extmetadata || {};
            results.push({
              title: p.title,
              url: info.url,
              width: info.width,
              height: info.height,
              license: meta.LicenseShortName?.value || 'Public/CC',
              artist: (meta.Artist?.value || '').replace(/<[^>]+>/g, '').trim(),
              description: (meta.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 200)
            });
          }
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const allResults = {};
  for (const q of queries) {
    console.log('Searching for:', q);
    const r = await search(q);
    allResults[q] = r;
    // wait 200ms to be polite
    await new Promise(res => setTimeout(res, 200));
  }
  fs.writeFileSync('scripts/commons_search_results.json', JSON.stringify(allResults, null, 2));
  console.log('Done! Saved to scripts/commons_search_results.json');
})();
