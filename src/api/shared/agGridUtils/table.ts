import { agFilterModelSchema } from "@/api/shared/agGridUtils/filter";
import { agSortModelSchema } from "@/api/shared/agGridUtils/sort";
import { z } from "zod";

export const agGridSchema = z.object({
  startRow: z.number().nonnegative().int(),
  endRow: z.number().nonnegative().int(),
  filterModel: agFilterModelSchema,
  sortModel: agSortModelSchema,
});

export type AgGrid = z.infer<typeof agGridSchema>;
