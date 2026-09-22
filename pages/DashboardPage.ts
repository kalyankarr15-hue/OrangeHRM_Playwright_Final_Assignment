import {expect, Page, Locator} from '@playwright/test';

export class DashboardPage {

    private readonly page: Page;

    readonly pimMenu: Locator;
    readonly dashboardText: Locator;
    readonly userMenu: Locator;

    constructor(page: Page) {

        this.page = page;

        this.pimMenu =
            this.page.getByRole('link', {
                name: 'PIM',
                exact: true
            });

        this.dashboardText =
            this.page.getByRole('heading', {
                name: 'Dashboard',
                exact: true
            });

        this.userMenu =
            this.page.locator(
                '.oxd-userdropdown-tab'
            );
    }

    async verifyDashboardPage(): Promise<void> {

        await expect(this.page)
            .toHaveURL(/dashboard\/index/);

        await expect(
            this.dashboardText
        ).toBeVisible();
    }

    async clickPIM(): Promise<void> {

        await this.pimMenu.click();

        await expect(this.page)
            .toHaveURL(/pim\/viewEmployeeList/);
    }

    async logout(): Promise<void> {

        await this.userMenu.click();

        await this.page.getByText(
            'Logout',
            { exact: true }
        ).click();
    }
}