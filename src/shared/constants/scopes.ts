import { keysAreSameAsValuesCheck } from "@/ui/shared/utils/keysAreSameAsValuesCheck";

export const SCOPE = keysAreSameAsValuesCheck({
  create_raid_activity: "create_raid_activity",
  get_all_raid_activity_types: "get_all_raid_activity_types",
  get_raid_activity_type_by_name: "get_raid_activity_type_by_name",
});

export type Scope = keyof typeof SCOPE;
