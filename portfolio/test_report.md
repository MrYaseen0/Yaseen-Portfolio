# Portfolio Test Report

**Project:** Yaseen Ahmad Portfolio (MERN Stack)  
**Date:** July 24, 2026  
**Environment:** Windows, Node.js v26.1.0, Vitest 3.2.7, Playwright

---

## Executive Summary

| Metric | Result |
|--------|--------|
| **Unit Tests** | 26/26 passing |
| **Lint** | 0 warnings, 0 errors |
| **Build** | Success (1.70s) |
| **Integration Tests** | 23 tests (BLOCKED - MongoDB) |
| **Regression Tests** | 15 tests (BLOCKED - MongoDB) |
| **Smoke Tests** | 12 tests (BLOCKED - MongoDB) |
| **E2E Tests** | 22 specs (BLOCKED - dev server) |
| **Total Test Cases** | **97** |

---

## 1. Unit Tests (26/26 PASSING) ✅

### 1.1 Auth Middleware (`tests/unit/auth.test.js`)

| # | Test | Status | Time |
|---|------|--------|------|
| 1 | generateTokens - generates access and refresh tokens | ✅ PASS | 38ms |
| 2 | generateTokens - access token contains user id and role | ✅ PASS | 5ms |
| 3 | generateTokens - refresh token has type refresh | ✅ PASS | 3ms |
| 4 | setTokenCookies - sets access and refresh cookies | ✅ PASS | 15ms |
| 5 | clearTokenCookies - clears both cookies | ✅ PASS | 3ms |
| 6 | adminOnly - calls next for admin user | ✅ PASS | 2ms |
| 7 | adminOnly - returns 403 for non-admin user | ✅ PASS | 2ms |
| 8 | adminOnly - returns 403 when no user | ✅ PASS | 2ms |

### 1.2 Validate Middleware (`tests/unit/validate.test.js`)

| # | Test | Status | Time |
|---|------|--------|------|
| 1 | isValidObjectId - returns true for valid ObjectId | ✅ PASS | 10ms |
| 2 | isValidObjectId - returns false for invalid ObjectId | ✅ PASS | 1ms |
| 3 | isValidObjectId - returns false for null/undefined | ✅ PASS | 1ms |
| 4 | validateObjectId - calls next for valid ObjectId | ✅ PASS | 5ms |
| 5 | validateObjectId - returns 400 for invalid ObjectId | ✅ PASS | 6ms |
| 6 | validateObjectId - calls next when no id param | ✅ PASS | 6ms |

### 1.3 Model Schemas (`tests/unit/models.test.js`)

| # | Test | Status | Time |
|---|------|--------|------|
| 1 | Contact - has required fields | ✅ PASS | 9ms |
| 2 | Contact - has maxlength constraints | ✅ PASS | 1ms |
| 3 | Contact - read defaults to false | ✅ PASS | 1ms |
| 4 | HireRequest - has valid service enum values | ✅ PASS | 1ms |
| 5 | HireRequest - has valid status enum values | ✅ PASS | 1ms |
| 6 | HireRequest - status defaults to new | ✅ PASS | 1ms |
| 7 | Project - has required fields | ✅ PASS | 1ms |
| 8 | Project - has valid category enum | ✅ PASS | 1ms |
| 9 | Project - featured defaults to false | ✅ PASS | 1ms |
| 10 | Settings - has profile nested object | ✅ PASS | 1ms |
| 11 | Settings - has social nested object | ✅ PASS | 1ms |
| 12 | Settings - has seo nested object | ✅ PASS | 1ms |

---

## 2. Integration Tests (BLOCKED - requires server)

**File:** `tests/integration/api.test.js`  
**Tests:** 23  
**Status:** ⏭️ SKIPPED (server not running)  
**Reason:** MongoDB Atlas connection blocked (IP not whitelisted)

### Planned Tests:

#### Auth Flow (7 tests)
- POST /api/auth/login returns tokens
- POST /api/auth/login fails with wrong credentials
- POST /api/auth/login fails with missing fields
- POST /api/auth/refresh works
- GET /api/auth/me returns user with valid token
- GET /api/auth/me fails without token
- POST /api/auth/logout clears session

#### Protected Admin Endpoints (5 tests)
- GET /api/admin/dashboard returns stats
- GET /api/admin/contacts returns array
- GET /api/admin/hires returns array
- GET /api/admin/security returns sessions
- Fails without auth token

#### CRUD Operations (11 tests)
- POST /api/projects creates project
- GET /api/projects returns array
- GET /api/projects/:slug returns project
- PUT /api/projects/:id updates project
- DELETE /api/projects/:id deletes project
- POST /api/experience creates experience
- GET /api/experience returns array
- DELETE /api/experience/:id deletes experience
- POST /api/testimonials creates testimonial
- GET /api/testimonials returns array
- DELETE /api/testimonials/:id deletes testimonial

---

## 3. Regression Tests (BLOCKED - requires server)

**File:** `tests/integration/regression.test.js`  
**Tests:** 15  
**Status:** ⏭️ SKIPPED (server not running)

### Planned Tests:

#### Auth Security (3 tests)
- Register validates email format
- Register requires minimum password length
- Login rate limiting exists

#### Mass Assignment Prevention (2 tests)
- PUT settings ignores non-whitelisted fields
- PUT projects ignores role escalation

#### Health Check (2 tests)
- Health returns status and timestamp
- Health includes uptime

#### Stats Endpoint Security (2 tests)
- Stats requires authentication
- Stats requires admin role

#### ObjectId Validation (3 tests)
- Rejects invalid ObjectId in project routes
- Rejects invalid ObjectId in experience routes
- Rejects invalid ObjectId in testimonial routes

#### Contact Form (1 test)
- Honeypot field present

#### Compression (1 test)
- Response headers include encoding

---

## 4. Smoke Tests (BLOCKED - requires server)

**File:** `tests/integration/smoke.test.js`  
**Tests:** 12  
**Status:** ⏭️ SKIPPED (server not running)

### Planned Tests:

#### Server Health (2 tests)
- Server is running
- Health returns ok status

#### Public API Endpoints (5 tests)
- Experience endpoint responds
- Testimonials endpoint responds
- Projects endpoint responds
- Settings endpoint responds
- GitHub repos endpoint responds

#### Auth Endpoints (2 tests)
- Login endpoint accepts POST
- Me endpoint requires auth

#### Protected Endpoints (2 tests)
- Admin dashboard blocks without auth
- Stats blocks without auth

#### Route Handling (1 test)
- 404 for unknown API routes

---

## 5. E2E Tests (BLOCKED - requires dev server)

**Files:** `tests/e2e/portfolio.spec.js`, `tests/e2e/smoke.spec.js`  
**Specs:** 22  
**Status:** ⏭️ SKIPPED (dev server not running)

### Planned Specs:

#### Homepage
- Loads successfully
- Displays hero section with name
- Navigation links visible
- Hero CTA buttons visible

#### Navigation
- Navigates to About page
- Navigates to Projects page
- Navigates to Contact page
- Navigates to Services page
- Navigates to Experience page
- Navigates to GitHub page

#### Contact Form
- Displays contact form
- Form validation works
- Honeypot field hidden

#### 404 Page
- Shows 404 for unknown routes
- Back to home link works

#### Admin Login
- Displays login form
- Login fails with wrong credentials

#### Responsive Design
- Mobile viewport renders
- Drawer opens on mobile

#### Smoke: Critical Business Paths
- Homepage loads with conversion elements
- Services page shows all services
- Projects page loads
- Experience page loads
- GitHub page loads
- Contact page has working form
- Admin login accessible
- Footer contains key links

---

## 6. Code Quality

### Lint Results ✅
```
Found 0 warnings and 0 errors.
Finished in 36ms on 72 files with 91 rules using 4 threads.
```

### Build Results ✅
```
✓ built in 1.70s
2218 modules transformed
0 warnings, 0 errors
Bundle size: 476.31 KB (145.55 KB gzipped)
```

---

## 7. Test Infrastructure

### Test Files Created

| File | Type | Tests |
|------|------|-------|
| `tests/unit/auth.test.js` | Unit | 8 |
| `tests/unit/validate.test.js` | Unit | 6 |
| `tests/unit/models.test.js` | Unit | 12 |
| `tests/integration/api.test.js` | Integration | 23 |
| `tests/integration/regression.test.js` | Regression | 15 |
| `tests/integration/smoke.test.js` | Smoke | 12 |
| `tests/e2e/portfolio.spec.js` | E2E | 14 |
| `tests/e2e/smoke.spec.js` | E2E | 8 |
| `tests/run-tests.js` | Runner | - |
| `vitest.config.js` | Config | - |
| `playwright.config.js` | Config | - |

### Test Commands

```bash
npm run test              # All unit tests (offline)
npm run test:unit         # Unit tests only
npm run test:integration  # API tests (needs server)
npm run test:regression   # Regression tests (needs server)
npm run test:smoke        # Smoke tests (needs server)
npm run test:e2e          # E2E tests (needs Playwright)
npm run test:coverage     # With coverage report
```

---

## 8. Blocked Tests - Root Cause

### MongoDB Atlas Connection Issue

**Error:** `Could not connect to any servers in your MongoDB Atlas cluster`

**Cause:** Current IP address is not whitelisted in MongoDB Atlas security settings.

**Solution:**
1. Log in to MongoDB Atlas dashboard
2. Go to Network Access
3. Add current IP address to whitelist
4. Or add `0.0.0.0/0` for all IPs (not recommended for production)

### Dev Server Not Running

**Error:** `fetch failed` / `ECONNREFUSED`

**Cause:** Playwright tests require the Vite dev server running on port 5173.

**Solution:**
```bash
npm run dev:client  # Start Vite dev server
# In another terminal:
npm run test:e2e    # Run E2E tests
```

---

## 9. Recommendations

1. **Whitelist IP in MongoDB Atlas** to enable integration tests
2. **Use MongoDB Memory Server** for CI/CD (no external dependency)
3. **Add GitHub Actions** workflow for automated testing
4. **Enable coverage** with `vitest --coverage`
5. **Add visual regression** tests with Playwright screenshots

---

## 10. Test Execution Summary

| Command | Status | Output |
|---------|--------|--------|
| `npm run test` | ✅ PASS | 26/26 unit tests passing |
| `npm run lint` | ✅ PASS | 0 warnings, 0 errors |
| `npm run build` | ✅ PASS | Built in 1.70s |
| `npm run test:integration` | ⏭️ SKIP | Needs server + MongoDB |
| `npm run test:regression` | ⏭️ SKIP | Needs server + MongoDB |
| `npm run test:smoke` | ⏭️ SKIP | Needs server + MongoDB |
| `npm run test:e2e` | ⏭️ SKIP | Needs dev server |

---

**Report Generated:** July 24, 2026, 12:40 PM  
**Tool:** Vitest 3.2.7 + Playwright  
**Total Test Cases:** 97  
**Passing (offline):** 26/26 (100%)  
**Blocked (need server):** 71 tests
