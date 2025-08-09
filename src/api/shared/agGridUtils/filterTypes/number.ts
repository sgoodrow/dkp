import { z } from "zod";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const filter = z.number();
const filterTo = z.number();
const filterType = z.literal("number");

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

const greaterThanOrEqual = z.object({
  type: z.literal("greaterThanOrEqual"),
  filter,
  filterType,
});

const lessThan = z.object({
  type: z.literal("lessThan"),
  filter,
  filterType,
});

const lessThanOrEqual = z.object({
  type: z.literal("lessThanOrEqual"),
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

export const numberFilterSchema = z.union([
  equals,
  notEqual,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  inRange,
  blank,
  notBlank,
]);

export type NumberFilter = z.infer<typeof numberFilterSchema>;

export const getNumberPrismaFilter = (
  filter: z.infer<typeof numberFilterSchema>,
) => {
  const { type } = filter;
  switch (type) {
    case "equals":
      return { equals: filter.filter };
    case "notEqual":
      return { not: filter.filter };
    case "greaterThan":
      return { gt: filter.filter };
    case "greaterThanOrEqual":
      return { gte: filter.filter };
    case "lessThan":
      return { lt: filter.filter };
    case "lessThanOrEqual":
      return { lte: filter.filter };
    case "inRange":
      return { gte: filter.filter, lte: filter.filterTo };
    case "blank":
      return { equals: null };
    case "notBlank":
      return { not: null };
    default:
      return exhaustiveSwitchCheck(type);
  }
};

export const getNumberPostgresFilter = (
  filter: z.infer<typeof numberFilterSchema>,
) => {
  const { type } = filter;
  switch (type) {
    case "equals":
      return `= ${filter.filter}`;
    case "notEqual":
      return `<> ${filter.filter}`;
    case "greaterThan":
      return `> ${filter.filter}`;
    case "greaterThanOrEqual":
      return `>= ${filter.filter}`;
    case "lessThan":
      return `< ${filter.filter}`;
    case "lessThanOrEqual":
      return `<= ${filter.filter}`;
    case "inRange":
      return `BETWEEN ${filter.filter} AND ${filter.filterTo}`;
    case "blank":
      return `IS NULL`;
    case "notBlank":
      return `IS NOT NULL`;
    default:
      return exhaustiveSwitchCheck(type);
  }
};
