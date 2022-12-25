import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import { dkp } from "./paths";

export const useMatchesData = (
  id: string
): Record<string, unknown> | undefined => {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
};

export const useUsername = (): string => {
  const data = useMatchesData(`routes/${dkp}`);
  if (!data || typeof data.username !== "string") {
    throw new Error("Username was not found in dkp data loader.");
  }
  return data.username;
};
