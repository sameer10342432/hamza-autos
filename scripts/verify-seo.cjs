const fs = require('fs');
const http = require('http');

console.log('==========================================');
console.log('HAMZA AUTOS - SEO VERIFICATION TEST SUITE');
console.log('==========================================\n');

// 1. Robots.txt
const robots = fs.readFileSync('public/robots.txt', 'utf8');
console.log('1. Checking public/robots.txt:');
console.log('   - Blocks /admin:', robots.includes('Disallow: /admin'));
console.log('   - Blocks /customer-dashboard:', robots.includes('Disallow: /customer-dashboard'));
console.log('   - Contains Sitemap reference:', robots.includes('Sitemap: https://hamzaautos.com/sitemap.xml'));

// 2. Sitemap.xml
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('\n2. Checking public/sitemap.xml:');
console.log('   - Total URLs count:', locs.length);
const hashUrls = locs.filter(u => u.includes('#'));
console.log('   - Invalid Hash URLs (Must be 0):', hashUrls.length);
console.log('   - Contains homepage:', locs.includes('https://hamzaautos.com/'));
console.log('   - Contains service URLs:', locs.filter(u => u.includes('/services/')).length);
console.log('   - Contains brand URLs:', locs.filter(u => u.includes('/brands/')).length);
console.log('   - Contains area URLs:', locs.filter(u => u.includes('/areas/')).length);
console.log('   - Contains blog URLs:', locs.filter(u => u.includes('/blog/')).length);

// 3. index.html Structured Data
const html = fs.readFileSync('index.html', 'utf8');
const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
console.log('\n3. Checking index.html Master Schema Graph:');
if (schemaMatch) {
  try {
    const schema = JSON.parse(schemaMatch[1]);
    console.log('   - Valid JSON-LD Context:', schema['@context']);
    const graph = schema['@graph'] || [];
    console.log('   - Graph Nodes count:', graph.length);
    graph.forEach(node => {
      console.log(`     * Node Type: ${node['@type']} (${node.name || node['@id']})`);
    });
  } catch (err) {
    console.error('   - Schema JSON parsing error:', err.message);
  }
}

// 4. Test Live Dev Server Endpoints
function testHttp(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

(async () => {
  console.log('\n4. Testing Live HTTP Server Response on Localhost:');
  const robRes = await testHttp('/robots.txt');
  console.log('   - GET /robots.txt status:', robRes.status, 'Length:', robRes.data?.length);

  const smRes = await testHttp('/sitemap.xml');
  console.log('   - GET /sitemap.xml status:', smRes.status, 'Length:', smRes.data?.length);

  console.log('\n==========================================');
  console.log('ALL SEO VERIFICATION CHECKS COMPLETED!');
  console.log('==========================================');
})();
