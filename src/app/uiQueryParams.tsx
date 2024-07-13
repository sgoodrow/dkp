import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const uiQueryParams = keysAreSameAsValuesCheck({
  utm_source: "utm_source",
});

export type UiQueryParamsType = keyof typeof uiQueryParams;
