const { chromium } = require('playwright');

async function diagnose() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Find overflowing elements
  const overflowing = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    const elements = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > winWidth + 1 || el.scrollWidth > winWidth + 1) {
        elements.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          rectRight: rect.right,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth
        });
      }
    });
    return { docWidth, winWidth, elements: elements.slice(0, 10) };
  });

  console.log('Overflow diagnosis on 375px:', JSON.stringify(overflowing, null, 2));

  // 2. Check sidebar element visibility
  await page.click('#btnMobileMenu');
  await page.waitForTimeout(300);

  const sidebarCheck = await page.evaluate(() => {
    const sb = document.getElementById('leftSidebar');
    const rev = document.getElementById('navItemReviews');
    const sbStyle = sb ? window.getComputedStyle(sb) : null;
    const revStyle = rev ? window.getComputedStyle(rev) : null;
    const sbRect = sb ? sb.getBoundingClientRect() : null;
    const revRect = rev ? rev.getBoundingClientRect() : null;
    return {
      sbClass: sb?.className,
      sbDisplay: sbStyle?.display,
      sbVisibility: sbStyle?.visibility,
      sbLeft: sbStyle?.left,
      sbTransform: sbStyle?.transform,
      sbRect,
      revVisibility: revStyle?.visibility,
      revDisplay: revStyle?.display,
      revRect
    };
  });

  console.log('Sidebar diagnosis when opened:', JSON.stringify(sidebarCheck, null, 2));

  await browser.close();
}

diagnose().catch(console.error);
