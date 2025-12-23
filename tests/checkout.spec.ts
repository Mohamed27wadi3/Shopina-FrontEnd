import { test, expect } from '@playwright/test';

test.describe('Checkout (mocked)', () => {
  test.beforeEach(async ({ page }) => {
    // Provide a lightweight Stripe stub before the library loads
    await page.addInitScript(() => {
      // @ts-ignore
      window.Stripe = (..._args: any[]) => ({
        confirmCardPayment: async () => ({ paymentIntent: { status: 'succeeded' } }),
        elements: () => ({
          create: () => ({ mount: () => {}, getElement: () => ({}) }),
        }),
      });
    });

    // Mock shop endpoints
    await page.route('**/api/shop/products/', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Test Product', price: 9.99, image: '/test.png', stock: 10, rating: 4, reviews: 0, category: 'Default' },
        ]),
      });
    });
    await page.route('**/api/shop/categories/', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ name: 'Default' }]) });
    });

    // Mock authenticated profile
    await page.route('**/api/users/profile/', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, email: 'test@example.com', plan: 'free' }) });
    });

    // Mock order creation
    await page.route('**/api/orders/', (route, request) => {
      if (request.method() === 'POST') {
        route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 123, items: [], total: 9.99 }) });
      } else {
        route.continue();
      }
    });

    // Mock create-intent
    await page.route('**/api/payments/create-intent/', (route, request) => {
      if (request.method() === 'POST') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ client_secret: 'test_secret' }) });
      } else {
        route.continue();
      }
    });
  });

  test('completes checkout flow with mocked backend & stripe', async ({ page }) => {
    // Ensure AuthProvider will try to fetch profile
    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'fake_access');
    });

    await page.goto('/shop');
    await expect(page.locator('text=Test Product')).toBeVisible();

    // Add product to cart
    await page.locator('button', { hasText: 'Ajouter' }).first().click();

    // Open cart
    await page.locator('button', { hasText: /Panier \(/ }).click();
    await expect(page).toHaveURL(/.*\/checkout/);

    // Proceed to payment (creates order + intent)
    await page.locator('button', { hasText: 'Procéder au paiement' }).click();

    // Wait for Payer (Pay) and click it
    const payBtn = page.locator('button', { hasText: 'Payer' });
    await payBtn.waitFor();
    await payBtn.click();

    // Expect success message
    await expect(page.locator('text=Paiement réussi')).toBeVisible();
  });
});

// Optional: a skeleton test for running real e2e against a running backend/Stripe.
test.describe('Checkout (real mode)', () => {
  test.skip(!process.env.E2E_REAL, 'E2E_REAL not set; skipping real end-to-end test');
  test('full e2e (requires running backend + real stripe test keys)', async ({ page }) => {
    // This test is intentionally a skeleton – adapt to your local environment if you enable E2E_REAL=1.
    await page.goto('/shop');
    // Manual steps would be: signup/login, add to cart, create order, enter test card 4242 4242 4242 4242, confirm.
  });
});
