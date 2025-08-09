import { z } from "zod";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const filter = z.boolean();
const filterType = z.literal("boolean");

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

export const booleanFilterSchema = z.union([equals, notEquals]);

export type BooleanFilter = z.infer<typeof booleanFilterSchema>;

export const getBooleanPrismaFilter = (
  filter: z.infer<typeof booleanFilterSchema>,
) => {
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

export const getBooleanPostgresFilter = (
  filter: z.infer<typeof booleanFilterSchema>,
): string => {
  const { type } = filter;
  switch (type) {
    case "equals":
      return `= ${filter.filter}`;
    case "notEquals":
      return `<> ${filter.filter}`;
    default:
      return exhaustiveSwitchCheck(type);
  }
};
