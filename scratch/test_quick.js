const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/');
  const guideExists = await page.$('#btnNavGuide');
  console.log('btnNavGuide exists:', !!guideExists);
  await page.click('#btnNavGuide');
  const open = await page.evaluate(() => {
    const modal = document.getElementById('guideModal');
    return modal ? !modal.classList.contains('hidden') : false;
  });
  console.log('guideModal open:', open);
  await browser.close();
})();
