const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const https = require('https');

const customLookup = (hostname, options, cb) => {
  if (typeof options === 'function') {
    cb = options;
  }
  dns.resolve4(hostname, (err, addrs) => {
    if (err) return cb(err);
    if (!addrs || !addrs[0]) return cb(new Error('No address found'));
    cb(null, addrs[0], 4);
  });
};

const query = process.argv[2] || 'motorcycle mechanic';
const limit = process.argv[3] || 15;

const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;

const reqOptions = {
  lookup: customLookup,
  headers: {
    'User-Agent': 'HamzaAutosPakistaniMechanicAudit/1.0 (https://hamzaautos.com; info@hamzaautos.com)'
  }
};

https.get(url, reqOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const pages = json.query?.pages || {};
      console.log(`\nFound ${Object.keys(pages).length} results for: "${query}"\n`);
      for (const id in pages) {
        const p = pages[id];
        const info = p.imageinfo?.[0];
        if (!info) continue;
        const meta = info.extmetadata || {};
        console.log(`Title: ${p.title}`);
        console.log(`URL: ${info.url}`);
        console.log(`Size: ${info.width}x${info.height}`);
        console.log(`License: ${meta.LicenseShortName?.value || 'Unknown'}`);
        console.log(`Artist: ${(meta.Artist?.value || '').replace(/<[^>]+>/g, '').trim()}`);
        console.log(`Description: ${(meta.ImageDescription?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 160)}`);
        console.log('--------------------------------------------------\n');
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
});
