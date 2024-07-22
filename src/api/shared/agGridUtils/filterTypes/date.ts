import { z } from "zod";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const filter = z.date();
const filterTo = z.date();
const filterType = z.literal("date");

const equals = z.object({
  type: z.literal("equals"),
  filter,
  filterType,
});

const notEqual = z.object({
  type: z.literal("notEqual"),
  filter,
  filterType,
});

const greaterThan = z.object({
  type: z.literal("greaterThan"),
  filter,
  filterType,
});

const lessThan = z.object({
  type: z.literal("lessThan"),
  filter,
  filterType,
});

const inRange = z.object({
  type: z.literal("inRange"),
  filter,
  filterTo,
  filterType,
});

const blank = z.object({
  type: z.literal("blank"),
  filterType,
});

const notBlank = z.object({
  type: z.literal("notBlank"),
  filterType,
});

export const dateFilterSchema = z.union([
  equals,
  notEqual,
  greaterThan,
  lessThan,
  inRange,
  blank,
  notBlank,
]);

export type DateFilter = z.infer<typeof dateFilterSchema>;

export const getDateFilter = (filter: z.infer<typeof dateFilterSchema>) => {
  const { type } = filter;
  switch (type) {
    case "equals":
      return { equals: filter };
    case "notEqual":
      return { not: filter };
    case "greaterThan":
      return { gt: filter };
    case "lessThan":
      return { lt: filter };
    case "inRange":
      return { gte: filter, lte: filterTo };
    case "blank":
      return { equals: null };
    case "notBlank":
      return { not: null };
    default:
      return exhaustiveSwitchCheck(type);
  }
};
