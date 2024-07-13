import { SECONDS } from "@/shared/constants/time";
import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:3000";
const outputDirectoryName = "playwright-test-results";

export default defineConfig({
  testDir: "src/test/",
  testMatch: "*.test.ts",
  outputDir: outputDirectoryName,
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  snapshotDir: "src/test/integration/snapshots",
  workers: undefined,
  reporter: [
    ["list"],
    ["junit", { outputFile: `${outputDirectoryName}/junit.xml` }],
  ],
  expect: {
    timeout: 15 * SECONDS,
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
  webServer: {
    command: "make run",
    url: baseURL,
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
  },
});
