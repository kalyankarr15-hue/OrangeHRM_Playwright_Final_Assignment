import {expect,Page,Locator} from '@playwright/test';

export class LoginPage {

    private readonly page: Page;

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {

        this.page = page;

        // Username
        this.usernameInput =
            this.page.locator(
                'input[name="username"]'
            );

        // Password
        this.passwordInput =
            this.page.locator(
                'input[name="password"]'
            );

        // Login button
        this.loginButton =
            this.page.getByRole(
                'button',
                {
                    name: 'Login'
                }
            );
    }


    async openLoginPage(): Promise<void> {

        await this.page.goto(
            'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
        );

    }


    async verifyLoginPage(): Promise<void> {

        await expect(
            this.usernameInput
        ).toBeVisible();

        await expect(
            this.passwordInput
        ).toBeVisible();

        await expect(
            this.loginButton
        ).toBeVisible();

    }


    async enterUsername(
        username: string
    ): Promise<void> {

        await this.usernameInput.fill(
            username
        );

    }


    async enterPassword(
        password: string
    ): Promise<void> {

        await this.passwordInput.fill(
            password
        );

    }


    async clickLogin(): Promise<void> {

        await this.loginButton.click();

    }


    async login(
        username: string,
        password: string
    ): Promise<void> {

        await this.enterUsername(
            username
        );

        await this.enterPassword(
            password
        );

        await this.clickLogin();

    }


    async verifyInvalidCredentials(): Promise<void> {

        await expect(
            this.page.getByText(
                /invalid credentials/i
            )
        ).toBeVisible();

    }

}