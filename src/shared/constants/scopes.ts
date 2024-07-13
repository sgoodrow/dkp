import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  run_prompt: "run_prompt",
});

export type Scope = keyof typeof SCOPE;
