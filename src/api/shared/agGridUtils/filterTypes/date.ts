import { z } from "zod";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const dateFrom = z.string();
const dateTo = z.string();
const filterType = z.literal("date");

const equals = z.object({
  type: z.literal("equals"),
  dateFrom,
  dateTo: z.null(),
  filterType,
});

const notEqual = z.object({
  type: z.literal("notEqual"),
  dateFrom,
  dateTo: z.null(),
  filterType,
});

const greaterThan = z.object({
  type: z.literal("greaterThan"),
  dateFrom,
  dateTo: z.null(),
  filterType,
});

const lessThan = z.object({
  type: z.literal("lessThan"),
  dateFrom,
  dateTo: z.null(),
  filterType,
});

const inRange = z.object({
  type: z.literal("inRange"),
  dateFrom,
  dateTo,
  filterType,
});

const blank = z.object({
  type: z.literal("blank"),
  dateFrom: z.null(),
  dateTo: z.null(),
  filterType,
});

const notBlank = z.object({
  type: z.literal("notBlank"),
  dateFrom: z.null(),
  dateTo: z.null(),
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
      return { equals: new Date(filter.dateFrom) };
    case "notEqual":
      return { not: new Date(filter.dateFrom) };
    case "greaterThan":
      return { gt: new Date(filter.dateFrom) };
    case "lessThan":
      return { lt: new Date(filter.dateFrom) };
    case "inRange":
      return {
        gte: new Date(filter.dateFrom),
        lte: new Date(filter.dateTo),
      };
    case "blank":
      return { equals: undefined };
    case "notBlank":
      return { not: undefined };
    default:
      return exhaustiveSwitchCheck(type);
  }
};
