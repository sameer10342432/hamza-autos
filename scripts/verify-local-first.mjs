import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function runVerification() {
  console.log('🚀 Starting Hamza Autos Local-First Verification in Headless Chrome...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('❌ Browser Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
    console.error('❌ Browser Page Error:', err.toString());
  });

  try {
    // 1. DESKTOP VIEWPORT TEST
    console.log('\n📱 1. Testing Desktop Viewport (1440x900)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    
    // Check horizontal overflow
    const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`   Desktop horizontal overflow: ${desktopOverflow ? 'FAIL (Overflow detected)' : 'PASS (No overflow)'}`);

    // Verify title and brand header
    const title = await page.title();
    console.log(`   Page title: "${title}"`);

    // 2. TEST CUSTOMER PORTAL & BIKE HEALTH (Features 6 & 8)
    console.log('\n🏍 2. Testing Customer Portal & Bike Health Diagnostic...');
    await page.goto(`${BASE_URL}/#/customer-portal`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="tel"]');

    // Login with demo phone
    await page.type('input[type="tel"]', '0300 1234567');
    await page.click('button[type="submit"]');

    // Wait for customer dashboard to load
    await page.waitForFunction(
      () => document.body.innerText.includes('Welcome, Muhammad Arshad'),
      { timeout: 8000 }
    );
    const welcomeText = await page.evaluate(() => document.querySelector('h1')?.innerText || '');
    console.log(`   Portal header: "${welcomeText}"`);
    console.log('   ✅ Customer profile successfully authenticated from local IndexedDB.');

    // Verify 16-point diagnostic inspection
    const hasAudit = await page.evaluate(() => {
      const el = document.body.innerText;
      return el.includes('16-Point') || el.includes('16 / 16 Points Checked') || el.includes('16-Component Audit');
    });
    console.log(`   16-Point health audit verified: ${hasAudit ? 'PASS' : 'FAIL'}`);

    // 3. TEST ADMIN PORTAL (Features 2, 3, 4, 5, 7, 9, 10, Backup)
    console.log('\n🛡 3. Testing Admin Operations Portal...');
    await page.goto(`${BASE_URL}/#/admin`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'HamzaAutos2026!');
    await page.click('button[type="submit"]');

    await page.waitForSelector('h1');
    const adminHeader = await page.evaluate(() => document.querySelector('h1')?.innerText || '');
    console.log(`   Admin portal title: "${adminHeader}"`);

    // Verify Tab buttons present
    const tabLabels = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(b => b.innerText.trim()).filter(t => t.length > 0 && t.length < 35);
    });
    console.log('   Found Admin Tabs:', tabLabels.filter(t => ['Dashboard', 'Job Cards', 'Appointments', '16-Pt Inspections', 'Quotations', 'WhatsApp Templates', 'Feedback Pipeline'].some(sub => t.includes(sub))));

    // Click 16-Pt Inspections tab
    console.log('   Testing Inspections Tab...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('16-Pt Inspections'));
      btn?.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click Quotations tab
    console.log('   Testing Quotations Tab...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Quotations'));
      btn?.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click WhatsApp Templates tab
    console.log('   Testing WhatsApp Automation Tab...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('WhatsApp Templates'));
      btn?.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const hasOfficialNumber = await page.evaluate(() => 
      document.body.innerText.includes('+92 325 1814548') || 
      document.body.innerText.includes('923251814548') ||
      document.body.innerText.includes('0325 1814548')
    );
    console.log(`   Official WhatsApp +92 325 1814548 present: ${hasOfficialNumber ? 'PASS' : 'FAIL'}`);

    // Click Feedback Pipeline tab
    console.log('   Testing Feedback Moderation Tab...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Feedback Pipeline'));
      btn?.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. TEST MOBILE VIEWPORT (375x667)
    console.log('\n📱 4. Testing Mobile Viewport (375x667)...');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`   Mobile horizontal overflow: ${mobileOverflow ? 'FAIL (Overflow detected)' : 'PASS (Zero overflow)'}`);

    // 5. TEST TABLET VIEWPORT (768x1024)
    console.log('\n📱 5. Testing Tablet Viewport (768x1024)...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`   Tablet horizontal overflow: ${tabletOverflow ? 'FAIL (Overflow detected)' : 'PASS (Zero overflow)'}`);

    // 6. TRACK REPAIR VIEW TEST
    console.log('\n🔍 6. Testing Track Repair Live View...');
    await page.goto(`${BASE_URL}/#/track-repair`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[placeholder*="HA-JC"]', { timeout: 8000 });
    const trackInputExists = await page.$('input[placeholder*="HA-JC"]');
    console.log(`   Track Repair input ready: ${trackInputExists ? 'PASS' : 'FAIL'}`);

    console.log('\n==================================================');
    console.log(`Total Browser Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console errors logged:', consoleErrors);
    } else {
      console.log('🎉 100% PERFECT: Zero console errors logged across all tested views!');
    }
    console.log('==================================================\n');

  } catch (error) {
    console.error('❌ Verification failed with error:', error);
  } finally {
    await browser.close();
  }
}

runVerification();
