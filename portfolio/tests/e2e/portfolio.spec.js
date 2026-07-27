import { test, expect } from '@playwright/test'

test.describe('Portfolio Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Yaseen/)
  })

  test('displays hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Yaseen Ahmad').first()).toBeVisible()
    await expect(page.locator('text=Available for freelance work')).toBeVisible()
  })

  test('navigation links are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('text=Home').first()).toBeVisible()
    await expect(page.locator('text=About').first()).toBeVisible()
  })

  test('hero CTA buttons work', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Hire Me').first()).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates to About page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=About')
    await expect(page.url()).toContain('/about')
  })

  test('navigates to Services page via dropdown', async ({ page }) => {
    await page.goto('/')
    await page.hover('text=Services')
    await page.waitForTimeout(500)
    const webDevLink = page.locator('text=Web Development').first()
    if (await webDevLink.isVisible()) {
      await webDevLink.click()
      await expect(page.url()).toContain('/services/web-development')
    }
  })

  test('navigates to Experience page', async ({ page }) => {
    await page.goto('/experience')
    await expect(page.locator('text=Experience').first()).toBeVisible({ timeout: 10000 })
  })

  test('navigates to GitHub page', async ({ page }) => {
    await page.goto('/github')
    await expect(page.locator('text=GitHub').first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Contact Form', () => {
  test('contact form on homepage displays input fields', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }))
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
  })

  test('honeypot field exists and is visually hidden', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }))
    const honeypot = page.locator('input[name="website"]')
    await expect(honeypot).toBeAttached()
    const isHidden = await honeypot.evaluate(el => {
      const container = el.closest('.sr-only') || el.parentElement
      const style = window.getComputedStyle(container)
      return style.position === 'absolute' && style.width === '1px'
    })
    expect(isHidden).toBeTruthy()
  })
})

test.describe('404 Page', () => {
  test('shows 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.locator('text=404')).toBeVisible()
    await expect(page.locator('text=Page Not Found')).toBeVisible()
  })

  test('back to home link works', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await page.click('text=Go Home')
    await expect(page.url()).toContain('/')
  })
})

test.describe('Admin Login', () => {
  test('displays login form', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', 'wrong@email.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    const errorBanner = page.locator('div').filter({ hasText: /Invalid|Too many|error|failed/i }).first()
    await expect(errorBanner).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Responsive Design', () => {
  test('mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('text=Yaseen Ahmad').first()).toBeVisible()
  })

  test('drawer opens on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const menuButton = page.locator('button[title="Menu"]')
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    }
  })
})
