
// test.js
const puppeteer = require('puppeteer');
const assert = require('assert');
const { describe } = require('node:test');

const extensionPath = "C:/Users/surfy/Documents/Dissertation/NewChromeExtension/testchromeextension/build"; // For instance, 'dist'
let extensionPage = null;
let browser = null;


describe('Extension UI Testing', function() {
    beforeAll(async function() {
      await boot();
    }, 20000);
  
    it('Options Button Click', async function() {
        await extensionPage.click("#optionsButton")
    }),
    it('Help Button Click', async function() {
        await extensionPage.click("#helpButton")
    })
  
    /*afterAll(async function() {
      await browser.close();
    });*/
  });

async function boot() {
    browser = await puppeteer.launch({
        headless: false, // extension are allowed only in head-full mode
        args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
        ],
        devtools: true
    });
    
    const pages = await browser.pages();
    // this will return list of active tab (which is pages object in puppeteer)
    const visiblePages = pages.filter(async (p) => {
        const state = await p.evaluate(() => document.visibilityState);
        return state === 'visible';
    });
    const activeTab = visiblePages[0];

    extensionPage = activeTab;

    const workerTarget = await browser.waitForTarget(
        target => target.type() === 'service_worker'
      );
    const partialExtensionUrl = workerTarget.url() || '';
    const [, , extensionId] = partialExtensionUrl.split('/');

    const extensionUrl = `chrome-extension://${extensionId}/popup.html`;
    extensionPage.goto(extensionUrl);
}