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

export const agFilterModelSchema = z
  .record(
    z.string(),
    z.union([numberFilterSchema, textFilterSchema, dateFilterSchema]),
  )
  .optional();

export type AgFilterModel = z.infer<typeof agFilterModelSchema>;

const getPrismaFilter = (filter: NumberFilter | TextFilter | DateFilter) => {
  const { filterType } = filter;
  switch (filterType) {
    case "number":
      return getNumberFilter(filter);
    case "text":
      return getTextFilter(filter);
    case "date":
      return getDateFilter(filter);
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
