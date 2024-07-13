"use client";

import { RouteErrorBoundary } from "@/ui/shared/boundaries/RouteErrorBoundary";

export default function GlobalError(props: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <RouteErrorBoundary {...props} />
      </body>
    </html>
  );
}
