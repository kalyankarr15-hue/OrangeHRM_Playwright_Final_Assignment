import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { credentials } from '../config/environments';


test.describe('Part 2 - Edge Case Testing', () => {

    test(
        'EC01 - Search with non-existing Employee ID',
        async ({ page }) => {

            const loginPage =
                new LoginPage(page);

            const dashboardPage =
                new DashboardPage(page);

            const employeeListPage =
                new EmployeeListPage(page);


            // Step 1: Login
            await loginPage.openLoginPage();

            await loginPage.login(
                credentials.username,
                credentials.password
            );


            // Step 2: Navigate to PIM
            await dashboardPage.verifyDashboardPage();

            await dashboardPage.clickPIM();


            // Step 3: Verify Employee List
            await employeeListPage.verifyEmployeePage();


            // Step 4: Search non-existing employee
            await employeeListPage.searchByEmployeeId(
                '999999999'
            );


            // Step 5: Verify no records found
            await employeeListPage.verifyNoRecordsFound();


            // Step 6: Verify application did not show an error
            await employeeListPage.verifyNoErrorMessage();
        }
    );

});

test(
    'EC02 - Search using special characters',
    async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        const dashboardPage =
            new DashboardPage(page);

        const employeeListPage =
            new EmployeeListPage(page);


        // Step 1: Login
        await loginPage.openLoginPage();

        await loginPage.login(
            credentials.username,
            credentials.password
        );


        // Step 2: Navigate to PIM
        await dashboardPage.verifyDashboardPage();

        await dashboardPage.clickPIM();


        // Step 3: Verify Employee List
        await employeeListPage.verifyEmployeePage();


        // Step 4: Search using special characters
        await employeeListPage.searchByEmployeeId(
            '@@##!!'
        );


        // Step 5: Application should handle input gracefully
        await employeeListPage.verifyNoRecordsFound();


        // Step 6: Application should not show an error
        await employeeListPage.verifyNoErrorMessage();
    }
);

test(
    'TC04 - Employee API failure is handled gracefully',
    async ({ page }, testInfo) => {

        const loginPage =
            new LoginPage(page);

        const dashboardPage =
            new DashboardPage(page);

        const employeeListPage =
            new EmployeeListPage(page);


        // Step 1: Login
        await loginPage.openLoginPage();

        await loginPage.login(
            credentials.username,
            credentials.password
        );


        // Step 2: Verify Dashboard
        await dashboardPage.verifyDashboardPage();


        // Step 3: Mock Employee API failure
        await page.route(
            '**/api/v2/pim/employees**',
            async route => {

                await route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: 'Employee service unavailable'
                    })
                });
            }
        );


        // Step 4: Navigate to Employee List
        await dashboardPage.clickPIM();


        // Step 5: Verify Employee page is still rendered
        await employeeListPage.verifyEmployeePage();


        // Step 6: Verify application has not crashed
        await expect(
            employeeListPage.employeeInformationHeading
        ).toBeVisible();


        // Step 7: Add custom diagnostic attachment
        await testInfo.attach(
            'network-failure-details',
            {
                body: JSON.stringify(
                    {
                        endpoint:
                            '/api/v2/pim/employees',

                        status: 500,

                        scenario:
                            'Employee API unavailable',

                        expectedBehavior:
                            'Application should remain usable'
                    },
                    null,
                    2
                ),

                contentType:
                    'application/json'
            }
        );
    }
);

test(
    'TC05 - Employee API request failure does not crash application',
    async ({ page }, testInfo) => {

        const loginPage =
            new LoginPage(page);

        const dashboardPage =
            new DashboardPage(page);

        const employeeListPage =
            new EmployeeListPage(page);


        // Login
        await loginPage.openLoginPage();

        await loginPage.login(
            credentials.username,
            credentials.password
        );


        // Dashboard
        await dashboardPage.verifyDashboardPage();


        // Simulate network failure
        await page.route(
            '**/api/v2/pim/employees**',
            async route => {

                await route.abort(
                    'failed'
                );
            }
        );


        // Navigate to Employee List
        await dashboardPage.clickPIM();


        // Employee page should still render
        await expect(
            employeeListPage.employeeInformationHeading
        ).toBeVisible();


        // Attach diagnostic information
        await testInfo.attach(
            'network-abort-details',
            {
                body: JSON.stringify(
                    {
                        endpoint:
                            '/api/v2/pim/employees',

                        failureType:
                            'Network request aborted',

                        expected:
                            'Application should not crash'
                    },
                    null,
                    2
                ),

                contentType:
                    'application/json'
            }
        );
    }
);



