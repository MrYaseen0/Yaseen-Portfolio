import { test, expect } from '@playwright/test'

test.describe('Smoke: Critical Business Paths', () => {
  test('homepage loads with key conversion elements', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Yaseen Ahmad').first()).toBeVisible()
    await expect(page.locator('text=Available for freelance work')).toBeVisible()
    await expect(page.locator('text=Hire Me').first()).toBeVisible()
  })

  test('services page shows all services', async ({ page }) => {
    await page.goto('/services')
    await expect(page.locator('text=Web Development').first()).toBeVisible()
    await expect(page.locator('text=Mobile Development').first()).toBeVisible()
    await expect(page.locator('text=Backend Engineering').first()).toBeVisible()
  })

  test('experience page loads', async ({ page }) => {
    await page.goto('/experience')
    await expect(page.locator('text=Experience').first()).toBeVisible({ timeout: 10000 })
  })

  test('github page loads', async ({ page }) => {
    await page.goto('/github')
    await expect(page.locator('text=GitHub').first()).toBeVisible({ timeout: 10000 })
  })

  test('contact form on homepage has input fields', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }))
    await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[name="email"]')).toBeVisible()
  })

  test('admin login page accessible', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('footer contains key links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})
