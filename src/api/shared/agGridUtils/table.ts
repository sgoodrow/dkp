import { agFilterModelSchema } from "@/api/shared/agGridUtils/filter";
import { agSortModelSchema } from "@/api/shared/agGridUtils/sort";
import { z } from "zod";

export const agTableSchema = z.object({
  startRow: z.number().nonnegative().int(),
  endRow: z.number().nonnegative().int(),
  filterModel: agFilterModelSchema,
  sortModel: agSortModelSchema,
});

export type AgTable = z.infer<typeof agTableSchema>;
