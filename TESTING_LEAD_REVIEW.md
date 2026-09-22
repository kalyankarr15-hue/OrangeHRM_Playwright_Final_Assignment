# Testing Lead Review

## Requirement-to-solution traceability

| Assignment requirement | Implementation |
|---|---|
| POM / clean modular structure | `pages/`, `fixtures/`, `tests/` |
| Separate pages/tests/fixtures | Yes |
| DRY/reusable components | Shared page objects + fixture |
| Semantic locators | Role/label/text-first strategy |
| Avoid hard waits | No `waitForTimeout()` |
| 4+ edge cases | 4 documented in README |
| 2 edge cases automated | No-result + HTTP 500 |
| Parallel execution | `fullyParallel: true` |
| Multiple environments | `APP_ENV` + `BASE_URL` |
| CI retries | `retries: 2` in CI |
| Screenshots/videos/traces | Failure-only retention |
| `page.route()` | Employee API interception |
| HTML reporter | Playwright HTML reporter |
| Graceful network failure | Resilience assertion |
| README | Comprehensive setup, architecture, coverage and limitations |

## Test design decisions

### Why no employee creation/update/delete?

The supplied application is a public shared demo. Mutation would introduce data coupling between parallel workers and could leave persistent state behind. The assignment does not require CRUD mutation, so the suite deliberately favors deterministic read-only coverage.

### Why authenticate per test?

The suite is small and the goal is reliability and isolation. Each test owns its browser context and establishes its own session. This avoids hidden dependencies on setup-test ordering.

For a larger regression suite, authentication storage state could be introduced after the authentication flow itself is covered.

### Why mock HTTP 500 instead of aborting the request?

Returning a deterministic 500 gives the application a realistic server-failure response and makes the test repeatable. It also proves the UI receives and handles an unsuccessful backend response.



## Important execution note

The public demo should be considered shared and mutable infrastructure. Exact employee data can change. Therefore the tests intentionally avoid asserting a hard-coded employee name and generate a unique non-existent search value.

Before submission, execute:

```bash
npm install
npx playwright install chromium
npm run typecheck
npm test
```

Then review `playwright-report/`.
