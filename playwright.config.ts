import {
    defineConfig,
    devices
} from '@playwright/test';

import {
    baseURL
} from './config/environments';


export default defineConfig({

    /*
     * Directory containing all test files
     */
    testDir: './tests',


    /*
     * Run tests in parallel
     */
    fullyParallel: true,


    /*
     * Prevent accidental test.only() in CI
     */
    forbidOnly:
        !!process.env.CI,


    /*
     * Retry failed tests in CI
     *
     * Local execution:
     * 0 retries
     *
     * CI execution:
     * 2 retries
     */
    retries:
        process.env.CI ? 2 : 0,


    /*
     * Number of parallel workers
     *
     * Local:
     * Playwright automatically determines workers
     *
     * CI:
     * Use 2 workers
     */
    workers:
        process.env.CI ? 2 : undefined,


    /*
     * Reporter configuration
     */
    reporter: [
        ['list'],
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never'
        }]
    ],


    /*
     * Shared settings for every test
     */
    use: {

        /*
         * Environment-based URL
         */
        baseURL,

        /*
         * Capture screenshot when test fails
         */
        screenshot: 'only-on-failure',

        /*
         * Record video when test fails
         */
        video: 'retain-on-failure',

        /*
         * Capture trace on first retry
         */
        trace: 'on-first-retry',

        /*
         * Browser action timeout
         */
        actionTimeout: 10000,

        /*
         * Navigation timeout
         */
        navigationTimeout: 30000,

        /*
         * Collect browser context information
         */
        ignoreHTTPSErrors: true
    },


    /*
     * Browser projects
     */
    projects: [

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        }

    ]
});