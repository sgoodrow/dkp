import { z } from "zod";
import { set } from "lodash";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import {
  getNumberFilter,
  NumberFilter,
  numberFilterSchema,
} from "@/api/shared/agGridUtils/filterTypes/number";
import {
  getTextFilter,
  TextFilter,
  textFilterSchema,
} from "@/api/shared/agGridUtils/filterTypes/text";
import {
  DateFilter,
  dateFilterSchema,
  getDateFilter,
} from "@/api/shared/agGridUtils/filterTypes/date";
import {
  EnumFilter,
  enumFilterSchema,
  getEnumFilter,
} from "@/api/shared/agGridUtils/filterTypes/enum";
import {
  BooleanFilter,
  booleanFilterSchema,
  getBooleanFilter,
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

const getPrismaFilter = (
  filter: NumberFilter | TextFilter | DateFilter | EnumFilter | BooleanFilter,
) => {
  const { filterType } = filter;
  switch (filterType) {
    case "number":
      return getNumberFilter(filter);
    case "text":
      return getTextFilter(filter);
    case "date":
      return getDateFilter(filter);
    case "enum":
      return getEnumFilter(filter);
    case "boolean":
      return getBooleanFilter(filter);
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
