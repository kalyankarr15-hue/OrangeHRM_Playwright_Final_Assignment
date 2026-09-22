import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { credentials } from '../config/environments';


test.describe('Part 1 - Functional Coverage', () => {


    // =====================================================
    // TC01 - Valid Login, Navigation and Logout
    // =====================================================

    test(
        'TC01 - Valid Login, Navigate to Employee Management and Logout',
        async ({ page }) => {

            const loginPage =
                new LoginPage(page);

            const dashboardPage =
                new DashboardPage(page);

            const employeeListPage =
                new EmployeeListPage(page);


            // Step 1: Open login page
            await loginPage.openLoginPage();

            // Step 2: Verify login page
            await loginPage.verifyLoginPage();

            // Step 3: Login with valid credentials
            await loginPage.login(
                credentials.username,
                credentials.password
            );

            // Step 4: Verify Dashboard
            await dashboardPage.verifyDashboardPage();

            // Step 5: Navigate to PIM
            await dashboardPage.clickPIM();

            // Step 6: Verify Employee Information
            await employeeListPage.verifyEmployeePage();

            // Step 7: Logout
            await dashboardPage.logout();

            // Step 8: Verify Login page
            await loginPage.verifyLoginPage();
        }
    );


    // =====================================================
    // TC02 - Negative Login Validation
    // =====================================================

    test(
        'TC02 - Invalid Login Credentials',
        async ({ page }) => {

            const loginPage =
                new LoginPage(page);


            // Step 1: Open login page
            await loginPage.openLoginPage();

            // Step 2: Verify login page
            await loginPage.verifyLoginPage();

            // Step 3: Login with invalid credentials
            await loginPage.login(
                'InvalidUser',
                'InvalidPassword'
            );

            // Step 4: Verify error message
            await loginPage.verifyInvalidCredentials();

            // Step 5: Verify Dashboard is not accessible
            await expect(page)
                .not
                .toHaveURL(/dashboard/);

            // Step 6: Verify protected content is not visible
            await expect(
                page.getByText(
                    'Dashboard',
                    { exact: true }
                )
            ).not.toBeVisible();
        }
    );


    // =====================================================
    // TC03 - Employee Data Verification
    // =====================================================

    test(
        'TC03 - Employee Data Verification',
        async ({ page }) => {

            const loginPage =
                new LoginPage(page);

            const dashboardPage =
                new DashboardPage(page);

            const employeeListPage =
                new EmployeeListPage(page);


            // Step 1: Open login page
            await loginPage.openLoginPage();

            // Step 2: Verify login page
            await loginPage.verifyLoginPage();

            // Step 3: Login with valid credentials
            await loginPage.login(
                credentials.username,
                credentials.password
            );

            // Step 4: Verify Dashboard
            await dashboardPage.verifyDashboardPage();

            // Step 5: Navigate to Employee List
            await dashboardPage.clickPIM();

            // Step 6: Verify Employee Information page
            await employeeListPage.verifyEmployeePage();

            // Step 7: Verify employee data renders
            await employeeListPage.verifyEmployeeDataRenders();
        }
    );

});