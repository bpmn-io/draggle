import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { preview } from '@vitest/browser-preview';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vite';

const HEADLESS = !!process.env.HEADLESS;

const TEST_BROWSERS = (process.env.TEST_BROWSERS || 'chrome').split(',');

function browserProvider(browser) {
  const chrome = browser === 'chrome';
  const browserBinary = chrome ? process.env.CHROME_BIN : process.env.FIREFOX_BIN;
  const driverBinary = chrome ? process.env.CHROMEDRIVER_PATH : process.env.GECKODRIVER_PATH;

  if (process.env.GITHUB_ACTIONS && (!browserBinary || !driverBinary || !existsSync(browserBinary) || !existsSync(driverBinary))) {
    throw new Error(`Missing hosted ${browser} browser or driver`);
  }

  const capabilities = {};

  if (browserBinary) {
    capabilities[chrome ? 'goog:chromeOptions' : 'moz:firefoxOptions'] = { binary: browserBinary };
  }

  if (driverBinary) {
    capabilities[chrome ? 'wdio:chromedriverOptions' : 'wdio:geckodriverOptions'] = { binary: driverBinary };
  }

  return webdriverio({ capabilities });
}

export default defineConfig({
  test: {
    globals: true,
    setupFiles: [
      resolve(__dirname, 'test', 'setup.js')
    ],
    browser: {
      enabled: true,
      headless: HEADLESS,
      instances: TEST_BROWSERS.map(
        browser => ({
          browser,
          provider: HEADLESS ? browserProvider(browser) : preview()
        })
      )
    }
  }
});
