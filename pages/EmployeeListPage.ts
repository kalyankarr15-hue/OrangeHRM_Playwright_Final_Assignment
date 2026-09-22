import {expect,Page,Locator} from '@playwright/test';

export class EmployeeListPage {

    private readonly page: Page;

    readonly employeeInformationHeading: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;

    readonly employeeIdInput: Locator;
    readonly employeeTable: Locator;
    readonly employeeRows: Locator;
    readonly noRecordsFound: Locator;

    constructor(page: Page) {

        this.page = page;

        // Employee Information heading
        this.employeeInformationHeading =
            this.page.getByRole('heading', {
                name: /Employee Information/i
            });

        // Search button
        this.searchButton =
            this.page.getByRole('button', {
                name: 'Search',
                exact: true
            });

        // Reset button
        this.resetButton =
            this.page.getByRole('button', {
                name: 'Reset',
                exact: true
            });

        // Employee ID field
        this.employeeIdInput =
            this.page.locator(
                '.oxd-input-group:has(label:has-text("Employee Id")) input'
            );

        // Employee table
        this.employeeTable =
            this.page.locator('.oxd-table');

        // Employee rows
        this.employeeRows =
            this.page.locator(
                '.oxd-table-body .oxd-table-row'
            );

        // No Records Found
        this.noRecordsFound =
            this.page.getByText(
                'No Records Found',
                { exact: true }
            ).first();
    }


    async verifyEmployeePage(): Promise<void> {

        await expect(this.page)
            .toHaveURL(/pim\/viewEmployeeList/);

        await expect(
            this.employeeInformationHeading
        ).toBeVisible();

        await expect(
            this.searchButton
        ).toBeVisible();
    }


    async verifyEmployeeDataRenders(): Promise<void> {

        await expect(
            this.employeeTable
        ).toBeVisible();

        await expect(
            this.employeeRows.first()
        ).toBeVisible();

        const rowCount =
            await this.employeeRows.count();

        expect(rowCount).toBeGreaterThan(0);
    }


    async searchByEmployeeId(
        employeeId: string
    ): Promise<void> {

        await this.employeeIdInput.fill(employeeId);

        await this.searchButton.click();

        await this.page.waitForLoadState(
            'networkidle'
        );
    }


    async verifyNoRecordsFound(): Promise<void> {

        await expect(
            this.noRecordsFound
        ).toBeVisible({
            timeout: 10000
        });
    }


    async verifyNoErrorMessage(): Promise<void> {

        await expect(
            this.page.getByText(
                /Application Error|Something went wrong|500 Internal Server Error/i
            )
        ).not.toBeVisible();
    }
}