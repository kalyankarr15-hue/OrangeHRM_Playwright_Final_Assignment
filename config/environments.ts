import dotenv from 'dotenv';

dotenv.config();

type EnvironmentConfig = {
    baseURL: string;
    username: string;
    password: string;
};

const environments: Record<string, EnvironmentConfig> = {

    qa: {
        baseURL:
            process.env.QA_BASE_URL ||
            'https://opensource-demo.orangehrmlive.com',

        username:
            process.env.QA_USERNAME ||
            'Admin',

        password:
            process.env.QA_PASSWORD ||
            'admin123'
    },

    staging: {
        baseURL:
            process.env.STAGING_BASE_URL ||
            'https://opensource-demo.orangehrmlive.com',

        username:
            process.env.STAGING_USERNAME ||
            'Admin',

        password:
            process.env.STAGING_PASSWORD ||
            'admin123'
    }
};

const environment =
    process.env.TEST_ENV || 'qa';

if (!environments[environment]) {
    throw new Error(
        `Unsupported TEST_ENV: ${environment}`
    );
}

export const currentEnvironment =
    environments[environment];

export const baseURL =
    currentEnvironment.baseURL;

export const credentials = {
    username: currentEnvironment.username,
    password: currentEnvironment.password
};