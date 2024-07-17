import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  assign_character: "assign_character",
});

export type Scope = keyof typeof SCOPE;
