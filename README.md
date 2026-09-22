# OrangeHRM Testing Engineer Assignment

Playwright + TypeScript solution for the OrangeHRM.

## 1. Scope

The implementation covers all assignment requirements:

- Standard valid-login and navigation flow
- Invalid-login validation and protected-content check
- Employee-list data verification
- Four documented non-obvious/edge scenarios
- Two automated edge cases
- Page Object Model and reusable fixtures
- Parallel-safe execution
- Environment-based configuration
- CI retries
- Screenshots, video and trace diagnostics
- Network mocking/interception with `page.route()`
- HTML reporting
- GitHub Actions CI

Target application:

`https://opensource-demo.orangehrmlive.com`

The current demo login documented by the application is:

- Username: `Admin`
- Password: `admin123`

> Credentials are configurable through environment variables and are not embedded in page objects.

---

## 2. Repository Structure

```text
orangehrm-playwright-assignment/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── config/
│   ├── constants.ts
│   └── environments.ts
├── fixtures/
│   └── testFixtures.ts
├── pages/
│   ├── DashboardPage.ts
│   ├── EmployeeListPage.ts
│   └── LoginPage.ts
├── tests/
│   ├── part1.spec.ts
│   └── part2.spec.ts
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

### Architecture

**POM** keeps selectors and page behavior out of test cases.

**Fixtures** provide reusable authenticated setup and page objects.

**Tests** contain business intent rather than low-level locator details.

**Config** separates environment URLs, credentials and reusable constants.

This structure supports the assignment's requested separation of pages, tests and fixtures while keeping the suite small enough to maintain.

---

## Part 1- Test Coverage

| ID | Scenario | Type | Status |
|---|---|---|---|
| P1-T01 | Valid login, PIM navigation, employee page rendering, logout | Functional | Automated |
| P1-T02 | Invalid credentials show error and protected page is inaccessible | Negative | Automated |
| P1-T03 | Employee data renders after successful authentication | Functional | Automated |


## Part 2 - Edge Case Identification

### Complex Workflow Selected

Employee Search workflow in the PIM module.

### Edge Cases

| ID | Scenario | Expected Behavior | Automation Status |
|----|----------|-------------------|-------------------|
| EC01 | Search using a non-existing Employee ID | System should display "No Records Found" and should not show an error or broken page | Automated |
| EC02 | Search using special characters in Employee ID | Application should handle the input gracefully and should not crash or display unexpected errors | Automated |
| EC03 | Search with leading/trailing spaces in Employee Name | Application should handle whitespace gracefully and return appropriate search results or no results | Documented |
| EC04 | Click Reset after a search returns no results | Search fields should be cleared and the employee list should be restored | Documented |

### Why these are useful

These cases go beyond simply checking that the happy path works. They exercise empty data, backend failure, ambiguous input and asynchronous/stale-data behavior.

---

## 5. Locator Strategy

The implementation prioritizes semantic locators:

- `getByRole`
- `getByLabel`
- `getByText`

Generated CSS/XPath selectors and absolute paths are intentionally avoided.

The only CSS selectors retained are scoped application classes for table rows/toast containers where the application does not expose a stable semantic role.

No `waitForTimeout()` or arbitrary hardcoded sleeps are used.

Assertions are used as synchronization points.

## Part 2 - Task 2: Playwright Configuration

### Parallel Execution

Playwright is configured with:

```ts
fullyParallel: true

## 6. Parallel Execution

`fullyParallel: true` is enabled.

The tests are designed to be parallel-safe because:

1. Every test receives its own Playwright browser context.
2. Authentication is performed independently through a fixture.
3. Tests are read-only; they do not create, edit or delete employees.
4. Edge-case search data is generated dynamically using `Date.now()`.
5. No test relies on another test's execution order.

For a future CRUD suite, each worker should receive isolated test data rather than modifying a shared employee.

---

## 7. Environment Configuration

The suite supports:

```text
APP_ENV=demo
BASE_URL=https://opensource-demo.orangehrmlive.com
TEST_USERNAME=Admin
TEST_PASSWORD=admin123
```

Additional environments can be supplied through:

```text
STAGING_BASE_URL=...
QA_BASE_URL=...
```

Example:

```bash
APP_ENV=qa BASE_URL=https://qa.example.com npm test
```

This allows the same test code to execute against different environments.

---

## 8. Retry and Diagnostics Strategy

### Local

- Retries: `0`
- Fast feedback
- Failures immediately visible

### CI

- Retries: `2`
- Workers limited to `2`
- `forbidOnly` enabled
- HTML report generated

### Artifacts

**Screenshot:** only when a test fails.

**Video:** retained on failure.

**Trace:** retained on failure.

This keeps normal CI runs lightweight while preserving enough evidence to debug failures.

---

## 9. Network Mocking

The employee API is intercepted with:

```ts
page.route('**/api/v2/pim/employees*', ...)
```

The test returns an HTTP 500 response.

This validates that the UI has a graceful failure state without depending on an actual backend outage.

This is preferable to deliberately taking down the environment because the test remains deterministic and repeatable.

---

## 10. Reporting

The suite uses the Playwright HTML reporter.

Run:

```bash
npm test
```

Then:

```bash
npm run report
```

The report contains:

- test status
- duration
- steps
- screenshots for failures
- videos for failures
- traces for failures

---

## 11. Setup

### Prerequisites

- Node.js 20+
- npm
- Git

### Install

```bash
npm install
npx playwright install
```

Create local environment file:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### Run all tests

```bash
npm test
```

### Run Part 1

```bash
npm run test:part1
```

### Run Part 2

```bash
npm run test:part2
```

### Run headed

```bash
npm run test:headed
```

### Run UI mode

```bash
npm run test:ui
```

### Type-check

```bash
npm run typecheck
```

---

## 12. CI

GitHub Actions is configured in:

```text
.github/workflows/playwright.yml
```

The workflow:

1. Checks out the repository.
2. Installs Node.js.
3. Runs `npm ci`.
4. Installs Chromium.
5. Executes the suite.
6. Uploads the HTML report.
7. Uploads test artifacts.

## 13. Coverage Summary

### Assignment Part 1

- Valid login: covered
- Employee management navigation: covered
- Successful page rendering: covered
- Logout: covered
- Invalid login: covered
- Error message: covered
- Protected-content verification: covered
- Employee list/data rendering: covered

### Assignment Part 2

- 4+ edge cases documented: covered
- 2 edge cases automated: covered
- POM: covered
- Fixtures: covered
- Parallel execution: covered
- Multi-environment configuration: covered
- CI retries: covered
- Screenshots/videos/traces: covered
- `page.route()` network interception: covered
- HTML reporting: covered

## 14. Known Limitations / Workarounds

### Demo environment stability

The public OrangeHRM demo is a shared environment. Availability and test data can change.

**Workaround:** Tests avoid asserting a specific employee's name and use dynamic search data for the empty-result case.

### Network failure UI wording

The exact error wording can vary by OrangeHRM version.

**Workaround:** The resilience assertion checks semantic error signals such as an alert, toast, or failure/empty-state text instead of one exact string.

### Credential management

Demo credentials are defaults supplied by the public demo. For enterprise environments, credentials should be stored in GitHub Actions Secrets or a secret manager rather than committed to source control.

## 16. Testing Lead Review

From a testing-lead perspective, the implementation intentionally prioritizes:

1. **Requirement traceability** — every assignment item maps to a test/config/documentation artifact.
2. **Isolation** — tests do not depend on execution order.
3. **Maintainability** — selectors and actions are encapsulated in POMs.
4. **Determinism** — network failures are injected rather than waiting for real outages.
5. **Diagnostics** — failed tests retain trace, screenshot and video evidence.
6. **Scalability** — environment configuration and fixtures allow additional modules to be added without rewriting the framework.
7. **Risk awareness** — the shared public demo is treated as unstable/shared infrastructure, so destructive tests are intentionally excluded.


## 17. Future Enhancements

For a production-grade suite, I would add:

- API-based authentication/data setup where supported
- Authentication storage state to reduce repeated UI login
- Accessibility checks
- Cross-browser projects: Chromium, Firefox and WebKit
- Mobile viewport coverage
- Allure or centralized test reporting
- Test tagging: `@smoke`, `@regression`, `@edge`
- Schema validation for API responses
- Contract/API tests
- Test-data factory
- Automatic quarantine/retry analysis for flaky tests
- Secret management through CI secrets
- Coverage trend dashboard

---

## 18. Submission Checklist

Before publishing:

- [ ] `npm install` succeeds
- [ ] `npx playwright install` succeeds
- [ ] `npm run typecheck` succeeds
- [ ] `npm test` passes
- [ ] HTML report opens
- [ ] Failure artifacts are generated when a test is intentionally failed
- [ ] GitHub Actions passes
- [ ] README is complete
- [ ] No secrets are committed
- [ ] Repository is public
- [ ] Git history contains meaningful commits
- [ ] Repository URL is included in the submission email
