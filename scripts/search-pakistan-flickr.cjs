const https = require('https');
const fs = require('fs');

const queries = [
  'pakistan mechanic',
  'lahore mechanic',
  'karachi mechanic',
  'rawalpindi mechanic',
  'peshawar mechanic',
  'pakistan motorcycle workshop',
  'lahore motorcycle workshop',
  'pakistan bike repair',
  'honda 70 pakistan',
  'honda 125 pakistan',
  'lahore street motorcycle',
  'pakistan motorcycle repair',
  'badami bagh lahore'
];

// Using Flickr's API endpoint or search feeds
async function searchFlickr(tag) {
  const url = `https://api.flickr.com/services/feeds/photos_public.gne?tags=${encodeURIComponent(tag.replace(/\s+/g, ','))}&format=json&nojsoncallback=1`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.items || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const found = [];
  for (const q of queries) {
    const items = await searchFlickr(q);
    console.log(`Query "${q}" -> ${items.length} items`);
    items.forEach(it => {
      found.push({
        query: q,
        title: it.title,
        author: it.author,
        url: it.media?.m.replace('_m.jpg', '_b.jpg'),
        tags: it.tags,
        link: it.link
      });
    });
    await new Promise(r => setTimeout(r, 150));
  }
  fs.writeFileSync('scripts/pakistan_flickr_matches.json', JSON.stringify(found, null, 2));
  console.log(`Total items collected: ${found.length}`);
})();
