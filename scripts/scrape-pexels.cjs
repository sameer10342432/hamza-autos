const https = require('https');

const url = process.argv[2] || 'https://www.pexels.com/photo/man-repairing-bike-17688463/';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const ogImage = html.match(/property="og:image" content="([^"]+)"/);
    console.log('OG Image:', ogImage ? ogImage[1] : 'None');
    const title = html.match(/<title>([^<]+)<\/title>/);
    console.log('Title:', title ? title[1] : 'None');
  });
}).on('error', err => console.error(err.message));
