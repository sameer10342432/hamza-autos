import { spawn } from 'child_process';

const widths = [
  320, 360, 375, 390, 430, 480, 600, 768, 820, 900, 1024, 1100, 1200, 1280, 1366, 1440, 1600, 1920
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debuggingPort = 9333;
const userDataDir = 'C:\\Users\\Sameer\\AppData\\Local\\Temp\\chrome-test-profile-' + Date.now();

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${debuggingPort}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

let isExited = false;
chromeProc.on('exit', () => { isExited = true; });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  await sleep(1500);

  const versionRes = await fetch(`http://localhost:${debuggingPort}/json/version`);
  const versionData = await versionRes.json();
  const wsEndpoint = versionData.webSocketDebuggerUrl;

  const ws = new WebSocket(wsEndpoint);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, (res) => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Create new target for test
  const { targetId } = await sendCommand('Target.createTarget', { url: 'http://localhost:3000/' });
  const { sessionId } = await sendCommand('Target.attachToTarget', { targetId, flatten: true });

  function sendSession(method, params = {}) {
    return sendCommand('Target.sendMessageToTarget', {
      sessionId,
      message: JSON.stringify({ id: msgId++, method, params })
    });
  }

  // Use direct target session
  const targetWs = new WebSocket(`ws://localhost:${debuggingPort}/devtools/page/${targetId}`);
  await new Promise(resolve => targetWs.onopen = resolve);

  let targetMsgId = 1;
  const targetPending = new Map();
  targetWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && targetPending.has(data.id)) {
      targetPending.get(data.id)(data);
      targetPending.delete(data.id);
    }
  };

  function sendTarget(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = targetMsgId++;
      targetPending.set(id, (res) => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      targetWs.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendTarget('Page.enable');
  await sendTarget('Runtime.enable');
  await sendTarget('Page.navigate', { url: 'http://localhost:3000/' });

  await sleep(2000);

  console.log('=== HAMZA AUTOS RESPONSIVE VIEWPORT TEST SUITE ===\n');
  console.log('| Viewport | Page ScrollWidth | InnerWidth | Overflow? | Header Fit? | Logo Visible? |');
  console.log('|:--------:|:----------------:|:----------:|:---------:|:-----------:|:-------------:|');

  let allPassed = true;

  for (const width of widths) {
    await sendTarget('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    await sleep(200);

    const evalRes = await sendTarget('Runtime.evaluate', {
      expression: `
        (() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const header = document.querySelector('header');
          const headerRect = header ? header.getBoundingClientRect() : null;
          const logo = header ? header.querySelector('button[aria-label*="Hamza Autos"]') : null;
          const logoRect = logo ? logo.getBoundingClientRect() : null;

          return {
            scrollWidth,
            innerWidth,
            hasOverflow: scrollWidth > innerWidth,
            headerFits: headerRect ? (headerRect.left >= 0 && headerRect.right <= innerWidth + 1) : false,
            headerRight: headerRect ? Math.round(headerRect.right) : 0,
            logoVisible: logoRect ? (logoRect.left >= 0 && logoRect.width > 50) : false,
            logoWidth: logoRect ? Math.round(logoRect.width) : 0
          };
        })()
      `,
      returnByValue: true
    });

    const result = evalRes.result.value;
    const overflowStr = result.hasOverflow ? 'FAIL (OVERFLOW)' : 'PASS (Clean)';
    const headerFitStr = result.headerFits ? 'PASS' : `FAIL (${result.headerRight}px > ${result.innerWidth}px)`;
    const logoStr = result.logoVisible ? `PASS (${result.logoWidth}px)` : 'FAIL';

    if (result.hasOverflow || !result.headerFits || !result.logoVisible) {
      allPassed = false;
    }

    console.log(`| ${String(width).padEnd(8)} | ${String(result.scrollWidth).padEnd(16)} | ${String(result.innerWidth).padEnd(10)} | ${overflowStr.padEnd(9)} | ${headerFitStr.padEnd(11)} | ${logoStr.padEnd(13)} |`);
  }

  // Test other views
  console.log('\n=== TESTING VIEWS / ROUTES FOR OVERFLOW ===\n');
  const viewsToTest = [
    { name: 'Services', hash: '#/services' },
    { name: 'Track Repair', hash: '#/track-repair' },
    { name: 'Contact', hash: '#/contact' },
    { name: 'Brands', hash: '#/brands' },
    { name: 'Areas We Serve', hash: '#/areas' },
    { name: 'Workshop Gallery', hash: '#/gallery' }
  ];

  for (const v of viewsToTest) {
    await sendTarget('Page.navigate', { url: `http://localhost:3000/${v.hash}` });
    await sleep(600);

    for (const testW of [375, 768, 1024, 1366, 1920]) {
      await sendTarget('Emulation.setDeviceMetricsOverride', {
        width: testW,
        height: 900,
        deviceScaleFactor: 1,
        mobile: testW < 768
      });
      await sleep(150);

      const check = await sendTarget('Runtime.evaluate', {
        expression: 'document.documentElement.scrollWidth > window.innerWidth',
        returnByValue: true
      });

      if (check.result.value) {
        console.log(`[FAIL] View ${v.name} at ${testW}px has horizontal overflow!`);
        allPassed = false;
      } else {
        console.log(`[PASS] View ${v.name} at ${testW}px - Clean, 0 overflow.`);
      }
    }
  }

  console.log(`\nOverall Result: ${allPassed ? 'ALL TESTS PASSED 100%' : 'SOME CHECKS FAILED'}`);

  targetWs.close();
  ws.close();
  chromeProc.kill();
  process.exit(allPassed ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  try { chromeProc.kill(); } catch (e) {}
  process.exit(1);
});

