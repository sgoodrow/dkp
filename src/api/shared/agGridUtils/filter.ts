import { z } from "zod";
import { set } from "lodash";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import {
  getNumberPostgresFilter,
  getNumberPrismaFilter,
  NumberFilter,
  numberFilterSchema,
} from "@/api/shared/agGridUtils/filterTypes/number";
import {
  getTextPostgresFilter,
  getTextPrismaFilter,
  TextFilter,
  textFilterSchema,
} from "@/api/shared/agGridUtils/filterTypes/text";
import {
  getDatePrismaFilter,
  DateFilter,
  dateFilterSchema,
  getDatePostgresFilter,
} from "@/api/shared/agGridUtils/filterTypes/date";
import {
  getEnumPrismaFilter,
  EnumFilter,
  enumFilterSchema,
  getEnumPostgresFilter,
} from "@/api/shared/agGridUtils/filterTypes/enum";
import {
  getBooleanPrismaFilter,
  BooleanFilter,
  booleanFilterSchema,
  getBooleanPostgresFilter,
} from "@/api/shared/agGridUtils/filterTypes/boolean";

export const agFilterModelSchema = z
  .record(
    z.string(),
    z.union([
      numberFilterSchema,
      textFilterSchema,
      dateFilterSchema,
      enumFilterSchema,
      booleanFilterSchema,
    ]),
  )
  .optional();

export type AgFilterModel = z.infer<typeof agFilterModelSchema>;

type Filters =
  | NumberFilter
  | TextFilter
  | DateFilter
  | EnumFilter
  | BooleanFilter;

const getPrismaFilter = (filter: Filters) => {
  const { filterType } = filter;
  switch (filterType) {
    case "number":
      return getNumberPrismaFilter(filter);
    case "text":
      return getTextPrismaFilter(filter);
    case "date":
      return getDatePrismaFilter(filter);
    case "enum":
      return getEnumPrismaFilter(filter);
    case "boolean":
      return getBooleanPrismaFilter(filter);
    default:
      return exhaustiveSwitchCheck(filterType);
  }
};

const getPostgresFilter = (filter: Filters) => {
  const { filterType } = filter;
  switch (filterType) {
    case "number":
      return getNumberPostgresFilter(filter);
    case "text":
      return getTextPostgresFilter(filter);
    case "date":
      return getDatePostgresFilter(filter);
    case "enum":
      return getEnumPostgresFilter(filter);
    case "boolean":
      return getBooleanPostgresFilter(filter);
    default:
      return exhaustiveSwitchCheck(filterType);
  }
};

export const agFilterModelToPrismaWhere = (filterModel: AgFilterModel) => {
  if (!filterModel) {
    return;
  }

  return Object.entries(filterModel).reduce(
    (where, [key, filter]) => set(where, key, getPrismaFilter(filter)),
    {},
  );
};

export const agFilterModelToPostgresWhere = (filterModel: AgFilterModel) => {
  if (!filterModel) {
    return;
  }

  return Object.entries(filterModel)
    .reduce<string[]>(
      (where, [columnName, filter]) => [
        ...where,
        `${columnName} ${getPostgresFilter(filter)}`,
      ],
      [],
    )
    .join(" AND ");
};
