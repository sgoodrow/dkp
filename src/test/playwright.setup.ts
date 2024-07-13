import {
  defaultHandlers,
  requireMockAllRestHandlers,
} from "@/test/defaultHandlers";
import { test as playwrightTest, expect } from "@playwright/test";
import type { MockServiceWorker } from "playwright-msw";
import { createWorkerFixture } from "playwright-msw";

const test = playwrightTest.extend<{
  mockServer: MockServiceWorker;
}>({
  mockServer: createWorkerFixture([
    ...defaultHandlers,
    requireMockAllRestHandlers,
  ]),
});

export { test, expect };
