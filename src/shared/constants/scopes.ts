import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  create_raid_activity: "create_raid_activity",
  get_all_raid_activity_types: "get_all_raid_activity_types",
  upsert_raid_activity_type: "upsert_raid_activity_type",
});

export type Scope = keyof typeof SCOPE;
