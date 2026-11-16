/**
 * Hamza Autos - Performance Audit Benchmark Script
 * Location: Abu Bakar Road, Badami Bagh, Lahore
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const PAGES_TO_TEST = [
  { name: 'Homepage', url: `${BASE_URL}/` },
  { name: 'Services', url: `${BASE_URL}/#/services` },
  { name: 'Blog', url: `${BASE_URL}/#/blog` },
  { name: 'Contact', url: `${BASE_URL}/#/contact` },
  { name: 'Track Repair', url: `${BASE_URL}/#/track-repair` }
];

async function measurePage(browser, pageInfo, isMobile = false) {
  const page = await browser.newPage();
  
  if (isMobile) {
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  } else {
    await page.setViewport({ width: 1440, height: 900 });
  }

  let totalTransferSize = 0;
  let jsTransferSize = 0;
  let cssTransferSize = 0;
  let imgTransferSize = 0;
  let requestCount = 0;

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  client.on('Network.loadingFinished', (event) => {
    totalTransferSize += event.encodedDataLength || 0;
  });

  client.on('Network.responseReceived', (event) => {
    requestCount++;
    const mime = event.response.mimeType || '';
    const size = event.response.encodedDataLength || 0;
    if (mime.includes('javascript')) jsTransferSize += size;
    else if (mime.includes('css')) cssTransferSize += size;
    else if (mime.includes('image')) imgTransferSize += size;
  });

  // Evaluate Performance Metrics inside page
  await page.evaluateOnNewDocument(() => {
    window.__perf_metrics = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      lcpElement: ''
    };

    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.__perf_metrics.fcp = entry.startTime;
          }
        }
      }).observe({ type: 'paint', buffered: true });

      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          window.__perf_metrics.lcp = lastEntry.startTime;
          window.__perf_metrics.lcpElement = lastEntry.element ? lastEntry.element.tagName : '';
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__perf_metrics.cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
  });

  const startTime = Date.now();
  await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
  const loadDuration = Date.now() - startTime;

  // Wait a moment to capture LCP and layout shifts
  await new Promise(r => setTimeout(r, 1200));

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    return {
      fcp: Math.round(window.__perf_metrics.fcp || 0),
      lcp: Math.round(window.__perf_metrics.lcp || 0),
      cls: parseFloat(window.__perf_metrics.cls.toFixed(4)),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
      loadEvent: Math.round(nav.loadEventEnd || 0),
      lcpElement: window.__perf_metrics.lcpElement || 'Unknown'
    };
  });

  const jsHeapUsed = await page.evaluate(() => {
    return (performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0).toFixed(2);
  });

  await page.close();

  return {
    page: pageInfo.name,
    isMobile,
    loadDuration,
    fcp: metrics.fcp,
    lcp: metrics.lcp,
    cls: metrics.cls,
    lcpElement: metrics.lcpElement,
    domContentLoaded: metrics.domContentLoaded,
    requestCount,
    totalTransferKB: (totalTransferSize / 1024).toFixed(1),
    jsTransferKB: (jsTransferSize / 1024).toFixed(1),
    cssTransferKB: (cssTransferSize / 1024).toFixed(1),
    imgTransferKB: (imgTransferSize / 1024).toFixed(1),
    jsHeapMB: jsHeapUsed
  };
}

async function runAudit() {
  console.log('Running Performance Benchmark Audit across key pages...\n');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const p of PAGES_TO_TEST) {
    console.log(`Auditing Desktop: ${p.name}...`);
    const resDesktop = await measurePage(browser, p, false);
    results.push(resDesktop);

    console.log(`Auditing Mobile (390px): ${p.name}...`);
    const resMobile = await measurePage(browser, p, true);
    results.push(resMobile);
  }

  await browser.close();

  console.log('\n================ AUDIT RESULTS ================');
  console.table(results);
  fs.writeFileSync('scripts/audit-results.json', JSON.stringify(results, null, 2));
}

runAudit().catch(console.error);
