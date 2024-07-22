import { merge } from "lodash";
import { z } from "zod";

export const agSortModelSchema = z.array(
  z.object({
    colId: z.string(),
    sort: z.enum(["asc", "desc"]),
  }),
);

export type AgSortModel = z.infer<typeof agSortModelSchema>;

type PrismaOrderBy = {
  [key: string]: "asc" | "desc" | PrismaOrderBy;
};

export const agSortModelToPrismaOrderBy = (sortModel?: AgSortModel) => {
  if (!sortModel?.length) {
    return;
  }

  const recurse = (parts: string[], sort: "asc" | "desc"): PrismaOrderBy => {
    const [current, ...rest] = parts;
    if (current === "_count") {
      return { [rest[0]]: { _count: sort } };
    }
    return rest.length === 0
      ? { [current]: sort }
      : { [current]: recurse(rest, sort) };
  };

  return sortModel.reduce<PrismaOrderBy>(
    (acc, { colId, sort }) => merge(acc, recurse(colId.split("."), sort)),
    {},
  );
};
