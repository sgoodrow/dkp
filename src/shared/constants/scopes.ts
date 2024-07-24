import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  create_raid_activity: "create_raid_activity",
  count_pending_transactions: "count_pending_transactions",
});

export type Scope = keyof typeof SCOPE;
