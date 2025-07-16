import percySnapshot from '@percy/puppeteer';

const PIMS_THEMES = ['cornerstone', 'avimark', 'easyvet', 'intravet', 'covetrus'];

export const runVisualTests = async (page) => {
  const baseUrl = 'http://localhost:5173';
  
  for (const theme of PIMS_THEMES) {
    await page.goto(`${baseUrl}?pims=${theme}`);
    await page.waitForSelector('[data-testid="pims-container"]', { timeout: 10000 });
    
    await percySnapshot(page, `Dashboard - ${theme}`, {
      widths: [375, 768, 1280, 1920]
    });
    
    const routes = [
      { path: '/check-in', name: 'Check In' },
      { path: '/appointments', name: 'Appointments' },
      { path: '/diagnostics', name: 'Diagnostics' },
      { path: '/billing', name: 'Billing' },
      { path: '/emergency', name: 'Emergency' }
    ];
    
    for (const route of routes) {
      await page.goto(`${baseUrl}${route.path}?pims=${theme}`);
      await page.waitForSelector('[data-testid="screen-container"]', { timeout: 10000 });
      
      await percySnapshot(page, `${route.name} - ${theme}`, {
        widths: [375, 768, 1280, 1920]
      });
    }
  }
};