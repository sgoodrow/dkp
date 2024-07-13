"use client";

import { UiQueryParamsType } from "@/app/uiQueryParams";
import { useSearchParams } from "next/navigation";

/**
 * @param keep list of query parameter names to keep
 * @returns the encoded query parameter string filtered to the provided list
 */
export const useFilteredQueryString = (
  ...keep: UiQueryParamsType[]
): string => {
  const searchParams = useSearchParams();
  const cleaned = new URLSearchParams();
  keep.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      cleaned.set(key, value);
    }
  });
  return cleaned.toString();
};
