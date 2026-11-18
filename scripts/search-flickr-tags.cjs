const https = require('https');
const fs = require('fs');

const tagList = [
  'motorcycle,engine',
  'motorcycle,carburetor',
  'motorcycle,oil',
  'motorcycle,spares',
  'motorcycle,brake',
  'motorcycle,clutch',
  'motorcycle,puncture',
  'motorcycle,wiring',
  'motorcycle,mechanic,asia',
  'motorcycle,workshop,asia',
  'motorbike,mechanic',
  'bike,repair,shop',
  'motorcycle,repair,shop'
];

async function getFlickr(tags) {
  const url = `https://api.flickr.com/services/feeds/photos_public.gne?tags=${encodeURIComponent(tags)}&format=json&nojsoncallback=1`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const items = (j.items || []).map(it => ({
            title: it.title,
            author: it.author,
            tags: it.tags,
            thumbnail: it.media?.m,
            large: it.media?.m ? it.media.m.replace('_m.jpg', '_b.jpg') : null,
            link: it.link
          }));
          resolve(items);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const all = {};
  for (const t of tagList) {
    const items = await getFlickr(t);
    console.log(`[+] ${t}: ${items.length} items`);
    all[t] = items;
    await new Promise(r => setTimeout(r, 150));
  }
  fs.writeFileSync('scripts/flickr_mechanic_tags.json', JSON.stringify(all, null, 2));
  console.log('Saved to scripts/flickr_mechanic_tags.json');
})();
