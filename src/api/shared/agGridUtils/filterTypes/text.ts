import { z } from "zod";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

const filter = z.string();
const filterType = z.literal("text");

const contains = z.object({
  type: z.literal("contains"),
  filter,
  filterType,
});

const notContains = z.object({
  type: z.literal("notContains"),
  filter,
  filterType,
});

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

const startsWith = z.object({
  type: z.literal("startsWith"),
  filter,
  filterType,
});

const endsWith = z.object({
  type: z.literal("endsWith"),
  filter,
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

export const textFilterSchema = z.union([
  contains,
  notContains,
  equals,
  notEqual,
  startsWith,
  endsWith,
  blank,
  notBlank,
]);

export type TextFilter = z.infer<typeof textFilterSchema>;

export const getTextPrismaFilter = (
  filter: z.infer<typeof textFilterSchema>,
) => {
  const { type } = filter;
  switch (type) {
    case "contains":
      return { contains: filter.filter, mode: "insensitive" };
    case "notContains":
      return { not: { contains: filter.filter }, mode: "insensitive" };
    case "equals":
      return { equals: filter.filter, mode: "insensitive" };
    case "notEqual":
      return { not: filter.filter, mode: "insensitive" };
    case "startsWith":
      return { startsWith: filter.filter, mode: "insensitive" };
    case "endsWith":
      return { endsWith: filter.filter, mode: "insensitive" };
    case "blank":
      return { equals: null };
    case "notBlank":
      return { not: null };
    default:
      return exhaustiveSwitchCheck(type);
  }
};

export const getTextPostgresFilter = (
  filter: z.infer<typeof textFilterSchema>,
) => {
  const { type } = filter;
  switch (type) {
    case "contains":
      return `ILIKE '%${filter.filter}%'`;
    case "notContains":
      return `NOT ILIKE '%${filter.filter}%'`;
    case "equals":
      return `= '${filter.filter}'`;
    case "notEqual":
      return `<> '${filter.filter}'`;
    case "startsWith":
      return `ILIKE '${filter.filter}%'`;
    case "endsWith":
      return `ILIKE '%${filter.filter}'`;
    case "blank":
      return `IS NULL`;
    case "notBlank":
      return `IS NOT NULL`;
    default:
      return exhaustiveSwitchCheck(type);
  }
};
