import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'qa-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runQA() {
  console.log('Launching Chrome for Hamza Autos Admin Panel QA...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Public Homepage
  console.log('1. Testing Public Homepage (http://localhost:3000/)...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('nav, header', { timeout: 10000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_public_homepage.png'), fullPage: false });

  // Verify public elements
  const hasPublicHeader = await page.evaluate(() => {
    return !!document.querySelector('header') && document.body.innerText.includes('Home') && document.body.innerText.includes('Services');
  });
  const hasWhatsAppButton = await page.evaluate(() => {
    return document.body.innerText.includes('WhatsApp') || !!document.querySelector('a[href*="whatsapp"]');
  });
  console.log(`Public Homepage: Has Header = ${hasPublicHeader}, Has WhatsApp = ${hasWhatsAppButton}`);

  // 2. Test Admin Login (Unauthenticated /admin)
  console.log('2. Testing Unauthenticated /admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_admin_login_screen.png'), fullPage: false });

  const adminLoginHasPublicHeader = await page.evaluate(() => {
    return document.body.innerText.includes('Track Repair') || document.body.innerText.includes('Areas We Serve');
  });
  const adminLoginHasWhatsApp = await page.evaluate(() => {
    return !!document.querySelector('button[aria-label*="WhatsApp"]') || !!document.querySelector('div.fixed.bottom-4');
  });
  console.log(`Admin Login: Has Public Header = ${adminLoginHasPublicHeader} (MUST BE FALSE), Has WhatsApp = ${adminLoginHasWhatsApp} (MUST BE FALSE)`);

  // 3. Authenticate Admin
  console.log('3. Authenticating Admin Session...');
  await page.evaluate(() => {
    localStorage.setItem('hamza_admin_logged_in', 'true');
    localStorage.setItem('hamza_autos_admin_token', 'qa-session-token');
    localStorage.setItem('hamza_autos_admin_user', JSON.stringify({ username: 'admin', displayName: 'Administrator' }));
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForFunction(() => document.body.innerText.includes('Dashboard Overview') || document.body.innerText.includes('WORKSHOP OPERATIONS'), { timeout: 10000 });

  // 4. Test Admin Dashboard Desktop (1440x900)
  console.log('4. Testing Admin Dashboard Desktop (1440x900)...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_admin_dashboard_desktop.png'), fullPage: false });

  const dashboardHasPublicHeader = await page.evaluate(() => {
    return document.body.innerText.includes('Track Repair') && document.body.innerText.includes('Areas We Serve');
  });
  const dashboardHasWhatsApp = await page.evaluate(() => {
    return !!document.querySelector('button[aria-label*="WhatsApp"]') || !!document.querySelector('div.fixed.bottom-4');
  });
  const dashboardUrl = page.url();
  console.log(`Dashboard Desktop: URL = ${dashboardUrl}, Has Public Header = ${dashboardHasPublicHeader} (MUST BE FALSE), Has WhatsApp = ${dashboardHasWhatsApp} (MUST BE FALSE)`);

  // Check sidebar numbering
  const sidebarNumberingPresent = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return false;
    const text = aside.innerText;
    return text.includes('1. Dashboard') || text.includes('21. Reports') || text.includes('20. Notifications');
  });
  console.log(`Sidebar Numbering Present (e.g. "1. Dashboard"): ${sidebarNumberingPresent} (MUST BE FALSE)`);

  // 5. Test Date Filter interaction
  console.log('5. Testing Date Filter interaction...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn7d = buttons.find(b => b.innerText.includes('Last 7 Days'));
    if (btn7d) btn7d.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_admin_dashboard_date_filter.png'), fullPage: false });

  // 6. Test Admin Inquiries Page
  console.log('6. Testing Admin Inquiries Page (/admin/inquiries)...');
  await page.goto('http://localhost:3000/admin/inquiries', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_admin_inquiries_page.png'), fullPage: false });
  console.log(`Inquiries Page: URL = ${page.url()}`);

  // 7. Test Admin Blog Management Page
  console.log('7. Testing Admin Blogs Page (/admin/blogs)...');
  await page.goto('http://localhost:3000/admin/blogs', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_admin_blogs_page.png'), fullPage: false });
  console.log(`Blogs Page: URL = ${page.url()}`);

  // 8. Test Admin Settings Page
  console.log('8. Testing Admin Settings Page (/admin/settings)...');
  await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_admin_settings_page.png'), fullPage: false });
  console.log(`Settings Page: URL = ${page.url()}`);

  // 9. Test Mobile Responsiveness (390x844 - iPhone 14/15 size)
  console.log('9. Testing Mobile Responsiveness (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_admin_dashboard_mobile.png'), fullPage: false });

  // Check horizontal overflow on mobile
  const hasMobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`Mobile Dashboard: Horizontal Overflow = ${hasMobileOverflow} (MUST BE FALSE)`);

  // 10. Open Mobile Sidebar Drawer
  console.log('10. Testing Mobile Sidebar Drawer...');
  await page.evaluate(() => {
    const toggleBtn = document.querySelector('button[aria-label*="Navigation Sidebar"]');
    if (toggleBtn) toggleBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_admin_mobile_sidebar_open.png'), fullPage: false });

  await browser.close();
  console.log('All QA Tests and Screenshots Completed Successfully!');
}

runQA().catch(err => {
  console.error('QA Runner error:', err);
  process.exit(1);
});
