const playwright = require('playwright');
const path = require('path');
const http = require('http');

async function waitForUrl(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(url, (r) => { res(); r.resume(); });
        req.on('error', rej);
        req.setTimeout(2000, () => { req.destroy(); rej(new Error('timeout')) });
      })
      return true
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false
}

(async () => {
  const base = 'http://127.0.0.1:5173'
  const ok = await waitForUrl(base)
  if (!ok) {
    console.error('Frontend not reachable at', base)
    process.exit(2)
  }
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${base}/signup`, { waitUntil: 'load', timeout: 15000 });
    const ts = Date.now();
    const email = `e2e+${ts}@example.com`;
    await page.fill('input[placeholder="Name"]', 'E2E User');
    await page.fill('input[placeholder="Email"]', email);
    await page.fill('input[placeholder="Password"]', 'password123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    // Wait for nav to show logged-in text
    await page.waitForSelector('text=Logged in:', { timeout: 7000 });
    const navText = await page.locator('nav').innerText();
    console.log('NAV:', navText);

    const screenshotPath = path.join(__dirname, '..', 'headless.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('E2E test failed:', err);
    await page.screenshot({ path: path.join(__dirname, '..', 'headless-failure.png'), fullPage: true }).catch(()=>{})
    await browser.close();
    process.exit(1);
  }
})();
