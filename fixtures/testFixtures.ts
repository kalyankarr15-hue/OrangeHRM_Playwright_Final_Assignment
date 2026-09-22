import {
    test as base,
    expect,
    Page
} from '@playwright/test';

import {
    LoginPage
} from '../pages/LoginPage';

import {
    DashboardPage
} from '../pages/DashboardPage';

import {
    EmployeeListPage
} from '../pages/EmployeeListPage';

import {
    credentials
} from '../config/environments';


type Fixtures = {

    loggedInPage: Page;

    loginPage: LoginPage;

    dashboardPage: DashboardPage;

    employeeListPage: EmployeeListPage;

};


export const test =
    base.extend<Fixtures>({


        loginPage: async (
            { page },
            use
        ) => {

            const loginPage =
                new LoginPage(page);

            await use(loginPage);

        },


        dashboardPage: async (
            { page },
            use
        ) => {

            const dashboardPage =
                new DashboardPage(page);

            await use(dashboardPage);

        },


        employeeListPage: async (
            { page },
            use
        ) => {

            const employeeListPage =
                new EmployeeListPage(page);

            await use(employeeListPage);

        },


        loggedInPage: async (
            { page },
            use
        ) => {

            const loginPage =
                new LoginPage(page);


            // Open login page

            await loginPage
                .openLoginPage();


            // Login

            await loginPage.login(
                credentials.username,
                credentials.password
            );


            // Verify successful login

            await expect(page)
                .toHaveURL(
                    /dashboard\/index/
                );


            await use(page);

        }

    });


export { expect };