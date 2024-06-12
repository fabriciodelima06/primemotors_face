// const randomUseragent = require('random-useragent');
// const pup = require('puppeteer-extra')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')

import randomUseragent from 'random-useragent'
import pup from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

pup.use(StealthPlugin())

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

export async function createPage(url, options) {

    const browser = await pup.launch({
        // CAMINHO DO CHROME PARA LINUX (REMOVER O COMENTÁRIO ABAIXO)
        // executablePath: '/usr/bin/chromium-browser',
        headless: true,
        // ignoreDefaultArgs: ['--disable-extensions'],
        args: [
            // '--proxy-server=http://45.239.175.19:8080',
            // '--no-sandbox',
            // '--disable-setuid-sandbox',
            // '--disable-dev-shm-usage',
            // '--disable-accelerated-2d-canvas',
            // '--no-first-run',
            // '--no-zygote',
            // '--single-process', // <- this one doesn't works in Windows
            // '--disable-gpu'
        ],
        ...options
    });

    //Randomize User agent or Set a valid one
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;
    const page = await browser.newPage();

    //Randomize viewport size
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });

    await page.setUserAgent(UA);
    // await page.setJavaScriptEnabled(true);
    // await page.setDefaultNavigationTimeout(0);

    // //Skip images/styles/fonts loading for performance
    // await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //     if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
    //         req.abort();
    //     } else {
    //         req.continue();
    //     }
    // });

    await page.evaluateOnNewDocument(() => {
        // Pass webdriver check
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    await page.evaluateOnNewDocument(() => {
        // Pass chrome check
        window.chrome = {
            runtime: {},
            // etc.
        };
    });

    await page.evaluateOnNewDocument(() => {
        //Pass notifications check
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    await page.evaluateOnNewDocument(() => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'plugins', {
            // This just needs to have `length > 0` for the current test,
            // but we could mock the plugins too if necessary.
            get: () => [1, 2, 3, 4, 5],
        });
    });

    await page.evaluateOnNewDocument(() => {
        // Overwrite the `languages` property to use a custom getter.
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });

    await page.goto(url);
    return { browser, page };
}