const https = require('https');
const fs = require('fs');

const tagSets = [
  'mechanic,pakistan',
  'workshop,pakistan',
  'mechanic,lahore',
  'motorcycle,mechanic,pakistan',
  'motorcycle,repair,pakistan',
  'mechanic,rawalpindi',
  'mechanic,karachi',
  'puncture,repair',
  'puncture,pakistan',
  'motorcycle,mechanic',
  'motorcycle,engine,repair',
  'motorcycle,carburetor',
  'motorcycle,oil,change',
  'motorcycle,spares',
  'motorcycle,workshop',
  'mechanic,workshop,india',
  'motorcycle,mechanic,india',
  'yamaha,ybr,125',
  'suzuki,gd110',
  'suzuki,gs150',
  'united,motorcycle',
  'honda,cg125'
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
  for (const t of tagSets) {
    const items = await getFlickr(t);
    console.log(`[+] ${t}: ${items.length} items`);
    all[t] = items;
    await new Promise(r => setTimeout(r, 200));
  }
  fs.writeFileSync('scripts/flickr_results.json', JSON.stringify(all, null, 2));
  console.log('Saved to scripts/flickr_results.json');
})();
