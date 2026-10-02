import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

// No competing browser workers or trace rasterization during latency measurements.
export default defineConfig({
  ...config,
  testMatch: "**/performance.spec.ts",
  testIgnore: [],
  fullyParallel: false,
  workers: 1,
  use: { ...config.use, trace: "off", screenshot: "off" },
});
