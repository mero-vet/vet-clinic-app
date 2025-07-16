import puppeteer from 'puppeteer';
import { runVisualTests } from '../src/test/visual/visualTests.js';

const runTests = async () => {
  console.log('Starting visual regression tests...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    await runVisualTests(page);
    
    console.log('Visual tests completed successfully!');
  } catch (error) {
    console.error('Visual tests failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
};

if (process.env.PERCY_TOKEN) {
  runTests();
} else {
  console.warn('PERCY_TOKEN not set. Skipping visual tests.');
  console.log('To run visual tests, set PERCY_TOKEN environment variable');
}