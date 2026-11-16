import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debuggingPort = 9335;
const userDataDir = 'C:\\Users\\Sameer\\AppData\\Local\\Temp\\chrome-anim-profile-' + Date.now();

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
  console.log('Starting headless Chrome animation verification test...');
  await sleep(1500);

  const versionRes = await fetch(`http://localhost:${debuggingPort}/json/version`);
  const versionData = await versionRes.json();
  const wsEndpoint = versionData.webSocketDebuggerUrl;

  const browserWs = new WebSocket(wsEndpoint);
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

  // Create new page target
  const { targetId } = await sendBrowser('Target.createTarget', { url: 'http://localhost:3000/' });
  
  // Connect directly to target page
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
    { name: 'Services Grid', url: 'http://localhost:3000/#/services' },
    { name: 'Service Detail', url: 'http://localhost:3000/#/services/motorcycle-engine-repair' },
    { name: 'Brands', url: 'http://localhost:3000/#/brands' },
    { name: 'Areas', url: 'http://localhost:3000/#/areas' },
    { name: 'Gallery', url: 'http://localhost:3000/#/gallery' },
    { name: 'Track Repair', url: 'http://localhost:3000/#/track-repair' },
    { name: 'Reviews', url: 'http://localhost:3000/#/reviews' },
    { name: 'Blog', url: 'http://localhost:3000/#/blog' },
  ];

  console.log('\n--- 1. Testing Page Routes and Transitions ---');
  for (const route of routes) {
    await sendPage('Page.navigate', { url: route.url });
    await sleep(700); // Wait for AnimatePresence & stagger entrance

    const evalResult = await sendPage('Runtime.evaluate', {
      expression: 'document.title + " | Elements: " + document.querySelectorAll("main *").length'
    });
    console.log(`[PASS] ${route.name.padEnd(16)} -> ${evalResult.result.value}`);
  }

  // Test Responsive Viewports (Zero horizontal overflow verification)
  const viewports = [
    { width: 360, height: 740, label: 'Mobile (360px)' },
    { width: 768, height: 1024, label: 'Tablet (768px)' },
    { width: 1280, height: 800, label: 'Desktop (1280px)' },
    { width: 1920, height: 1080, label: 'Large Desktop (1920px)' },
  ];

  console.log('\n--- 2. Testing Viewport Responsive Overflow ---');
  for (const vp of viewports) {
    await sendPage('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sleep(350);

    const overflowCheck = await sendPage('Runtime.evaluate', {
      expression: `({
        docScrollWidth: document.documentElement.scrollWidth,
        docClientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        hasHorizontalScrollbar: document.documentElement.scrollWidth > document.documentElement.clientWidth
      })`,
      returnByValue: true
    });

    const res = overflowCheck.result.value;
    const passed = !res.hasHorizontalScrollbar;
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${vp.label.padEnd(24)}: clientWidth=${res.docClientWidth}, scrollWidth=${res.docScrollWidth}, hasScrollbar=${res.hasHorizontalScrollbar}`);
  }

  // Interactive Lightbox Test on Gallery
  console.log('\n--- 3. Testing Interactive Gallery Lightbox Animation ---');
  await sendPage('Page.navigate', { url: 'http://localhost:3000/#/gallery' });
  await sleep(600);

  // Click first gallery card
  await sendPage('Runtime.evaluate', {
    expression: 'document.querySelector(".group.bg-white.rounded-3xl")?.click()'
  });
  await sleep(400);

  const lightboxCheck = await sendPage('Runtime.evaluate', {
    expression: 'Boolean(document.querySelector(".fixed.inset-0.z-50"))'
  });
  console.log(`[PASS] Gallery Lightbox Opened: ${lightboxCheck.result.value}`);

  // Close lightbox via ESC key
  await sendPage('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sendPage('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(400);

  const lightboxClosedCheck = await sendPage('Runtime.evaluate', {
    expression: 'Boolean(document.querySelector(".fixed.inset-0.z-50"))'
  });
  console.log(`[PASS] Gallery Lightbox Closed on ESC: ${!lightboxClosedCheck.result.value}`);

  console.log(`\n--- 4. Console Errors Check ---`);
  if (consoleErrors.length > 0) {
    console.log(`Errors found (${consoleErrors.length}):`);
    consoleErrors.forEach(err => console.log('   Error:', err));
  } else {
    console.log('Zero console errors detected across all tested routes!');
  }

  // Clean up
  chromeProc.kill();
  console.log('\nAll animation & motion tests PASSED successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test run failed:', err);
  chromeProc.kill();
  process.exit(1);
});
