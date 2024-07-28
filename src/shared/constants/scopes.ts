import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  create_raid_activity: "create_raid_activity",
  count_uncleared_transactions: "count_uncleared_transactions",
  sync_discord_metadata: "sync_discord_metadata",
  archive_transaction: "archive_transaction",
});

export type Scope = keyof typeof SCOPE;
