
  # Website Builder

  This is a code bundle for Website Builder. The original project is available at https://www.figma.com/design/AeVz4y20nVORNsGEDWfALK/Website-Builder.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## End-to-end tests (Playwright)

  We include a Playwright e2e test suite that supports two modes:

  - Mocked mode (default): fast, uses network stubbing for backend and Stripe interactions.
  - Real mode (optional): runs against a real backend and Stripe test keys. Set `E2E_REAL=1` to enable.

  Setup:
  1. Install Playwright browsers: `npm run test:e2e:install`
  2. Run the tests (mocked): `npm run test:e2e`

  To run a real end-to-end test (requires a running backend at `http://localhost:8000` and Stripe test keys):

  E2E_REAL=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 npm run test:e2e

  The primary mocked test is `tests/checkout.spec.ts` (signup/login is stubbed, products and payments are stubbed).
  
  Note: if running in CI, ensure `PLAYWRIGHT_BASE_URL` points to your deployed front test server and set `E2E_REAL=1` only when a backend + Stripe test environment is available.

  