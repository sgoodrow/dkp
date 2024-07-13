import { HttpResponse, RequestHandler, http } from "msw";

const printError = (message: string, ...additional: unknown[]) => {
  console.error(`\x1b[31mERROR: ${message}:\x1b[0m`);
  console.error(...additional);
};

export const requireMockAllRestHandlers = http.all(
  /.*/,
  ({ params, request }) => {
    const message =
      "Test is making a request to a REST endpoint that hasn't been mocked";
    printError(message, params, request);
    return new HttpResponse(null, { status: 500 });
  },
);

export const defaultHandlers: RequestHandler[] = [];
