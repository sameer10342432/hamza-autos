const https = require('https');
const fs = require('fs');

const terms = [
  'Lahore mechanic',
  'Pakistan mechanic',
  'motorcycle Lahore',
  'motorcycle Rawalpindi',
  'motorcycle Karachi',
  'Lahore workshop',
  'mechanic Rawalpindi',
  'mechanic Peshawar',
  'auto repair Pakistan',
  'puncture repair Pakistan',
  'motorcycle tyre Pakistan',
  'Honda 70 Pakistan',
  'Honda 125 Pakistan',
  'Honda CD70',
  'Honda CG125',
  'auto rickshaw repair',
  'workshop Pakistan',
  'spare parts Lahore',
  'Badami Bagh'
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
              desc: (meta.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 150)
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
  const found = {};
  for (const t of terms) {
    const res = await search(t);
    if (res.length > 0) {
      found[t] = res;
      console.log(`[+] ${t}: ${res.length} images`);
    } else {
      console.log(`[-] ${t}: 0`);
    }
    await new Promise(r => setTimeout(r, 150));
  }
  fs.writeFileSync('scripts/pakistan_images.json', JSON.stringify(found, null, 2));
  console.log('\nResults written to scripts/pakistan_images.json');
})();
