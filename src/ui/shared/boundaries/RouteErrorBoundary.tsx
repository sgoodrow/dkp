import { ErrorPane } from "@/ui/shared/components/alerts/ErrorPane";
import { FC } from "react";

export const RouteErrorBoundary: FC<{
  error: Error;
  reset: () => void;
}> = ({ error, reset }) => {
  return <ErrorPane error={error} onReset={reset} />;
};
