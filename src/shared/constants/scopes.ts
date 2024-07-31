import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  create_raid_activity: "create_raid_activity",
  count_uncleared_transactions: "count_uncleared_transactions",
  sync_discord_metadata: "sync_discord_metadata",
  update_transaction: "update_transaction",
  create_raid_activity_type: "create_raid_activity_type",
  update_raid_activity_type: "update_raid_activity_type",
});

export type Scope = keyof typeof SCOPE;
