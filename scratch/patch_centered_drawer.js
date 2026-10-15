const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');

// 1. Patch resetSelection
appCode = appCode.replace(
  `    const drawer = document.getElementById('rightDrawer');\r\n    if (drawer) drawer.classList.add('closed');`,
  `    const drawer = document.getElementById('rightDrawer');\r\n    const backdrop = document.getElementById('drawerBackdrop');\r\n    if (drawer) drawer.classList.add('closed');\r\n    if (backdrop) backdrop.classList.add('hidden');`
);
appCode = appCode.replace(
  `    const drawer = document.getElementById('rightDrawer');\n    if (drawer) drawer.classList.add('closed');`,
  `    const drawer = document.getElementById('rightDrawer');\n    const backdrop = document.getElementById('drawerBackdrop');\n    if (drawer) drawer.classList.add('closed');\n    if (backdrop) backdrop.classList.add('hidden');`
);

// 2. Patch selectBranch
appCode = appCode.replace(
  `    const drawer = document.getElementById('rightDrawer');\r\n    if (drawer && openDrawer) {\r\n      drawer.classList.remove('closed');\r\n    }`,
  `    const drawer = document.getElementById('rightDrawer');\r\n    const backdrop = document.getElementById('drawerBackdrop');\r\n    if (drawer && openDrawer) {\r\n      drawer.classList.remove('closed');\r\n      if (backdrop) backdrop.classList.remove('hidden');\r\n    }`
);
appCode = appCode.replace(
  `    const drawer = document.getElementById('rightDrawer');\n    if (drawer && openDrawer) {\n      drawer.classList.remove('closed');\n    }`,
  `    const drawer = document.getElementById('rightDrawer');\n    const backdrop = document.getElementById('drawerBackdrop');\n    if (drawer && openDrawer) {\n      drawer.classList.remove('closed');\n      if (backdrop) backdrop.classList.remove('hidden');\n    }`
);

// 3. Patch bindDrawerEvents for backdrop click and Escape key
const oldBindDrawer = `  bindDrawerEvents() {
    const btnClose = document.getElementById('btnCloseDrawer');
    const drawer = document.getElementById('rightDrawer');
    if (btnClose && drawer) {
      btnClose.addEventListener('click', () => {
        audio.click();
        drawer.classList.add('closed');
        this.resetSelection();`;

const newBindDrawer = `  bindDrawerEvents() {
    const btnClose = document.getElementById('btnCloseDrawer');
    const drawer = document.getElementById('rightDrawer');
    const backdrop = document.getElementById('drawerBackdrop');

    const closeCenteredModal = () => {
      audio.click();
      if (drawer) drawer.classList.add('closed');
      if (backdrop) backdrop.classList.add('hidden');
      this.resetSelection();
    };

    if (backdrop) backdrop.addEventListener('click', closeCenteredModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && !drawer.classList.contains('closed')) {
        closeCenteredModal();
      }
    });

    if (btnClose && drawer) {
      btnClose.addEventListener('click', () => {
        audio.click();
        drawer.classList.add('closed');
        if (backdrop) backdrop.classList.add('hidden');
        this.resetSelection();`;

appCode = appCode.replace(oldBindDrawer.replace(/\n/g, '\r\n'), newBindDrawer.replace(/\n/g, '\r\n'));
if (!appCode.includes('closeCenteredModal')) {
  appCode = appCode.replace(oldBindDrawer, newBindDrawer);
}

fs.writeFileSync('app.js', appCode, 'utf8');
console.log('app.js successfully patched with centered drawer events!');
