import { defineConfig , devices} from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: 1,
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://samecommers.netlify.app/',
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

//   projects: [
//     {
//       name: 'chromium',
//       use: {
//         launchOptions: {
//           args: ['--start-maximized', '--window-size=1920,1080'],
//         },
//       },
//     },
//   ],



  projects: [
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome', // Uses locally installed Google Chrome
    //   },
    // },
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge', // Uses locally installed Microsoft Edge
      },
    },
    // {
    //   name: 'Chrome Beta',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome-beta', // Optional: uses Chrome Beta if installed
    //   },
    // },
  ],
});
