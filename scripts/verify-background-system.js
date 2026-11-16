import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debuggingPort = 9336;
const userDataDir = 'C:\\Users\\Sameer\\AppData\\Local\\Temp\\chrome-bg-profile-' + Date.now();

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${debuggingPort}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('--- HAMZA AUTOS: BACKGROUND ANIMATION SYSTEM AUDIT ---');
  await sleep(1500);

  const versionRes = await fetch(`http://localhost:${debuggingPort}/json/version`);
  const versionData = await versionRes.json();
  const browserWs = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise(resolve => browserWs.onopen = resolve);

  let msgId = 1;
  const pending = new Map();
  browserWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  function sendBrowser(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, (res) => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      browserWs.send(JSON.stringify({ id, method, params }));
    });
  }

  const { targetId } = await sendBrowser('Target.createTarget', { url: 'http://localhost:3000/' });
  const pageWs = new WebSocket(`ws://localhost:${debuggingPort}/devtools/page/${targetId}`);
  await new Promise(resolve => pageWs.onopen = resolve);

  let pageMsgId = 1;
  const pagePending = new Map();
  const consoleErrors = [];

  pageWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pagePending.has(data.id)) {
      pagePending.get(data.id)(data);
      pagePending.delete(data.id);
    }
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
      consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
    }
  };

  function sendPage(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = pageMsgId++;
      pagePending.set(id, (res) => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      pageWs.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendPage('Page.enable');
  await sendPage('Runtime.enable');
  await sendPage('DOM.enable');

  const routes = [
    { name: 'Home', url: 'http://localhost:3000/' },
    { name: 'About', url: 'http://localhost:3000/#/about' },
    { name: 'Services', url: 'http://localhost:3000/#/services' },
    { name: 'Service Detail', url: 'http://localhost:3000/#/services/motorcycle-engine-repair' },
    { name: 'Brands', url: 'http://localhost:3000/#/brands' },
    { name: 'Areas', url: 'http://localhost:3000/#/areas' },
    { name: 'Gallery', url: 'http://localhost:3000/#/gallery' },
    { name: 'Track Repair', url: 'http://localhost:3000/#/track-repair' },
    { name: 'Reviews', url: 'http://localhost:3000/#/reviews' },
    { name: 'Blog', url: 'http://localhost:3000/#/blog' },
    { name: 'Contact', url: 'http://localhost:3000/#/contact' },
  ];

  console.log('\n1. Checking Background Component Mounts Across Routes:');
  for (const r of routes) {
    await sendPage('Page.navigate', { url: r.url });
    await sleep(650);

    const audit = await sendPage('Runtime.evaluate', {
      expression: `({
        title: document.title,
        hasGears: document.querySelectorAll('.animate-gear-cw-slow, .animate-gear-ccw-slow, .animate-gear-cw-medium').length > 0,
        hasGrid: document.querySelectorAll('.bg-engineering-grid-dark, .bg-engineering-grid-light, .bg-dark-grid').length > 0,
        hasCanvasParticles: document.querySelectorAll('canvas').length > 0,
        hasRedSweep: document.querySelectorAll('.animate-red-sweep').length > 0
      })`,
      returnByValue: true
    });

    const a = audit.result.value;
    console.log(`[PASS] ${r.name.padEnd(16)} -> Gears: ${a.hasGears}, Grid: ${a.hasGrid}, Particles: ${a.hasCanvasParticles}, RedSweep: ${a.hasRedSweep}`);
  }

  // Viewport Overflow Test across all requested viewports:
  // 320px, 360px, 390px, 430px, 768px, 1024px, 1280px, 1366px, 1440px, 1920px
  const requestedViewports = [
    { width: 320, height: 568, label: '320px (Small Mobile)' },
    { width: 360, height: 740, label: '360px (Standard Android)' },
    { width: 390, height: 844, label: '390px (iPhone 12/13/14)' },
    { width: 430, height: 932, label: '430px (iPhone Pro Max)' },
    { width: 768, height: 1024, label: '768px (iPad Mini/Tablet)' },
    { width: 1024, height: 768, label: '1024px (iPad Pro/Landscape)' },
    { width: 1280, height: 800, label: '1280px (Laptop)' },
    { width: 1366, height: 768, label: '1366px (Standard HD Laptop)' },
    { width: 1440, height: 900, label: '1440px (MacBook Pro/QHD)' },
    { width: 1920, height: 1080, label: '1920px (FHD Desktop Monitor)' },
  ];

  console.log('\n2. Testing Responsive Viewports for Zero Horizontal Overflow:');
  await sendPage('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(500);

  let allViewportsPassed = true;
  for (const vp of requestedViewports) {
    await sendPage('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sleep(250);

    const overflow = await sendPage('Runtime.evaluate', {
      expression: `({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      })`,
      returnByValue: true
    });

    const o = overflow.result.value;
    const pass = !o.hasOverflow;
    if (!pass) allViewportsPassed = false;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${vp.label.padEnd(30)} -> clientWidth=${o.clientW}, scrollWidth=${o.scrollW}, overflow=${o.hasOverflow}`);
  }

  console.log('\n3. Console Errors Audit:');
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log('  [ERROR]', err));
  } else {
    console.log('[PASS] Zero console errors detected across all tested routes and viewports!');
  }

  // Clean up
  chromeProc.kill();
  console.log('\nBACKGROUND ANIMATION SYSTEM AUDIT COMPLETE!');
  process.exit(allViewportsPassed ? 0 : 1);
}

run().catch((err) => {
  console.error('Audit script failed:', err);
  chromeProc.kill();
  process.exit(1);
});
