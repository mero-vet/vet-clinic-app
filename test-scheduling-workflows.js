// Test script to verify scheduling workflows work without errors
const puppeteer = require('puppeteer');

async function testSchedulingWorkflows() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // Navigate to the scheduling screen
    await page.goto('http://localhost:5173/cornerstone/scheduler', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for the scheduling screen to load
    await page.waitForSelector('.scheduling-container', { timeout: 10000 });
    
    console.log('✓ Scheduling screen loaded successfully');
    
    // Test 1: Slot selection workflow
    console.log('\nTesting Workflow 1: Slot Selection');
    try {
      // Click on a time slot
      const slot = await page.$('.time-slot:not(.occupied)');
      if (slot) {
        await slot.click();
        // Check if appointment form appears
        await page.waitForSelector('.appointment-form', { timeout: 5000 });
        console.log('✓ Appointment form appears when clicking empty slot');
        
        // Close the form
        const cancelBtn = await page.$('.cancel-button, button[type="button"]');
        if (cancelBtn) await cancelBtn.click();
      }
    } catch (e) {
      console.log('✗ Slot selection workflow failed:', e.message);
    }
    
    // Test 2: New appointment workflow
    console.log('\nTesting Workflow 2: New Appointment');
    try {
      // Look for "New Appointment" button
      const newApptBtn = await page.$('button:contains("New Appointment"), .new-appointment-btn');
      if (newApptBtn) {
        await newApptBtn.click();
        await page.waitForSelector('.appointment-form', { timeout: 5000 });
        console.log('✓ New appointment form opens');
      }
    } catch (e) {
      console.log('✗ New appointment workflow failed:', e.message);
    }
    
    // Test 3: Find available workflow
    console.log('\nTesting Workflow 3: Find Available');
    try {
      // Look for availability or search functionality
      const findBtn = await page.$('button:contains("Find"), .find-available-btn');
      if (findBtn) {
        await findBtn.click();
        console.log('✓ Find available functionality accessible');
      }
    } catch (e) {
      console.log('✗ Find available workflow failed:', e.message);
    }
    
    // Report any console errors
    if (errors.length > 0) {
      console.log('\n❌ Console errors found:');
      errors.forEach(err => console.log('  -', err));
    } else {
      console.log('\n✅ No console errors detected');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) await browser.close();
  }
}

// Run if we have puppeteer, otherwise skip
try {
  require.resolve('puppeteer');
  testSchedulingWorkflows();
} catch (e) {
  console.log('Puppeteer not installed. Skipping automated tests.');
  console.log('Run: npm install puppeteer --save-dev');
}