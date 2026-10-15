const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Clear any old 7-slide localStorage cache
  await page.evaluate(() => {
    localStorage.removeItem('REDMIND_CUSTOM_SLIDES_V2');
    localStorage.removeItem('REDMIND_CUSTOM_SLIDES');
  });

  // Click "Trình chiếu 16:9" button
  await page.click('#btnPresentationMode');
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => {
    const indicator = document.getElementById('slideIndicator').textContent.trim();
    const title = document.getElementById('slideTitle').textContent.trim();
    const img = document.querySelector('#slideScreen img');
    return {
      slidesCount: window.SLIDES ? window.SLIDES.length : (window.app ? window.app.currentSlideIndex : -1),
      indicator,
      title,
      imgSrc: img ? img.getAttribute('src') : 'none'
    };
  });

  console.log('Main Web Presentation Modal State:', state);

  // Capture screenshot of the modal with 16 slides
  await page.screenshot({ path: 'scratch/screenshot_main_modal_16_slides.png' });
  console.log('Saved screenshot_main_modal_16_slides.png');

  // Navigate to slide 5
  for (let i = 0; i < 4; i++) {
    await page.click('#btnNextSlide');
    await page.waitForTimeout(200);
  }
  const stateSlide5 = await page.evaluate(() => {
    return {
      indicator: document.getElementById('slideIndicator').textContent.trim(),
      imgSrc: document.querySelector('#slideScreen img').getAttribute('src')
    };
  });
  console.log('State at Slide 5:', stateSlide5);

  // Navigate to slide 16
  for (let i = 0; i < 11; i++) {
    await page.click('#btnNextSlide');
    await page.waitForTimeout(200);
  }
  const stateSlide16 = await page.evaluate(() => {
    return {
      indicator: document.getElementById('slideIndicator').textContent.trim(),
      imgSrc: document.querySelector('#slideScreen img').getAttribute('src')
    };
  });
  console.log('State at Slide 16:', stateSlide16);

  await page.screenshot({ path: 'scratch/screenshot_main_modal_slide16.png' });
  console.log('Saved screenshot_main_modal_slide16.png');

  await browser.close();
})();
