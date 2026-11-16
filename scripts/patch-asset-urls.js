import fs from 'fs';

// 1. Patch src/data/businessData.ts
let bd = fs.readFileSync('src/data/businessData.ts', 'utf8');

const assetHelper = `const asset = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  const clean = path.replace(/^\\.?\\//, '');
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? \`\${base}\${clean}\` : \`\${base}/\${clean}\`;
};

`;

if (!bd.includes('const asset =')) {
  bd = assetHelper + bd;
}

bd = bd.replace(/image:\s*\"\/assets\/images\/([^\"]+)\"/g, 'image: asset("assets/images/$1")');
fs.writeFileSync('src/data/businessData.ts', bd, 'utf8');
console.log('businessData.ts patched');

// 2. Patch HomeView.tsx
let home = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
if (!home.includes('assetUrl')) {
  home = home.replace(
    /from '\.\.\/utils\/businessLogic';/,
    ", assetUrl } from '../utils/businessLogic';"
  );
}
home = home.replace(/src="\/assets\/images\/([^"]+)"/g, 'src={assetUrl("assets/images/$1")}');
fs.writeFileSync('src/views/HomeView.tsx', home, 'utf8');
console.log('HomeView.tsx patched');

// 3. Patch AboutView.tsx
let about = fs.readFileSync('src/views/AboutView.tsx', 'utf8');
if (!about.includes('assetUrl')) {
  about = "import { assetUrl } from '../utils/businessLogic';\n" + about;
}
about = about.replace(/src="\/assets\/images\/([^"]+)"/g, 'src={assetUrl("assets/images/$1")}');
fs.writeFileSync('src/views/AboutView.tsx', about, 'utf8');
console.log('AboutView.tsx patched');

// 4. Patch AreasView.tsx
let areas = fs.readFileSync('src/views/AreasView.tsx', 'utf8');
if (!areas.includes('assetUrl')) {
  areas = areas.replace(
    /from '\.\.\/utils\/businessLogic';/,
    ", assetUrl } from '../utils/businessLogic';"
  );
}
areas = areas.replace(/src="\/assets\/images\/([^"]+)"/g, 'src={assetUrl("assets/images/$1")}');
fs.writeFileSync('src/views/AreasView.tsx', areas, 'utf8');
console.log('AreasView.tsx patched');

// 5. Patch AdminView.tsx
let admin = fs.readFileSync('src/views/AdminView.tsx', 'utf8');
if (!admin.includes('assetUrl')) {
  admin = admin.replace(
    /from '\.\.\/utils\/businessLogic';/,
    ", assetUrl } from '../utils/businessLogic';"
  );
}
admin = admin.replace(/'\/assets\/images\/([^']+)'/g, 'assetUrl("assets/images/$1")');
fs.writeFileSync('src/views/AdminView.tsx', admin, 'utf8');
console.log('AdminView.tsx patched');

// 6. Patch JobCardsTab.tsx
let jc = fs.readFileSync('src/components/admin/JobCardsTab.tsx', 'utf8');
if (!jc.includes('assetUrl')) {
  jc = "import { assetUrl } from '../../utils/businessLogic';\n" + jc;
}
jc = jc.replace(/'\/assets\/images\/([^']+)'/g, 'assetUrl("assets/images/$1")');
fs.writeFileSync('src/components/admin/JobCardsTab.tsx', jc, 'utf8');
console.log('JobCardsTab.tsx patched');
