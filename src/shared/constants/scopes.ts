import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  create_raid_activity: "create_raid_activity",
  count_uncleared_transactions: "count_uncleared_transactions",
  sync_discord_metadata: "sync_discord_metadata",
  reject_transaction: "reject_transaction",
  assign_transaction_pilot: "assign_transaction_pilot",
  assign_transaction_item: "assign_transaction_item",
});

export type Scope = keyof typeof SCOPE;
