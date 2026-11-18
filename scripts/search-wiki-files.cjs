const https = require('https');

const query = process.argv[2] || 'motorcycle mechanic';

// Search files on Wikipedia / Commons
const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;

const options = {
  headers: {
    'User-Agent': 'HamzaAutosPakistaniMechanicAudit/1.0 (https://hamzaautos.com; info@hamzaautos.com)'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const pages = json.query?.pages || {};
      console.log(`\nFound ${Object.keys(pages).length} results on Wikipedia for: "${query}"\n`);
      for (const id in pages) {
        const p = pages[id];
        const info = p.imageinfo?.[0];
        if (!info) continue;
        const meta = info.extmetadata || {};
        console.log(`Title: ${p.title}`);
        console.log(`URL: ${info.url}`);
        console.log(`Size: ${info.width}x${info.height}`);
        console.log(`License: ${meta.LicenseShortName?.value || 'Public/CC'}`);
        console.log(`Desc: ${(meta.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 150)}`);
        console.log('--------------------------------------------------\n');
      }
    } catch (e) {
      console.error('JSON Error:', e.message);
    }
  });
}).on('error', err => console.error(err.message));
