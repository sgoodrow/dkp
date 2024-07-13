import { ErrorPane } from "@/ui/shared/components/alerts/ErrorPane";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

export const ReactErrorBoundary: FCWithChildren = ({ children }) => {
  return (
    <QueryErrorResetBoundary>
      {() => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorPane error={error} onReset={resetErrorBoundary} />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
