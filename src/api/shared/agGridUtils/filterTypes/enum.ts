import { z } from "zod";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const filter = z.string();
const filterType = z.literal("enum");

const equals = z.object({
  type: z.literal("equals"),
  filter,
  filterType,
});

const notEquals = z.object({
  type: z.literal("notEquals"),
  filter,
  filterType,
});

export const enumFilterSchema = z.union([equals, notEquals]);

export type EnumFilter = z.infer<typeof enumFilterSchema>;

export const getEnumFilter = (filter: z.infer<typeof enumFilterSchema>) => {
  const { type } = filter;
  switch (type) {
    case "equals":
      return { equals: filter.filter };
    case "notEquals":
      return { not: filter.filter };
    default:
      return exhaustiveSwitchCheck(type);
  }
};
