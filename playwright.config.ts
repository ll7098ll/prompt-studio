import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: "**/performance.spec.ts",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3200",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "msedge",
        viewport: { width: 1600, height: 1000 },
      },
    },
    {
      name: "desktop-firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1600, height: 1000 },
      },
    },
    {
      name: "desktop-webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1600, height: 1000 },
      },
    },
  ],
  webServer: {
    command: process.env.STUDIO_TEST_STATIC
      ? "node scripts/serve-static.mjs"
      : "npm run dev -- --port 3200 --hostname 127.0.0.1",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
