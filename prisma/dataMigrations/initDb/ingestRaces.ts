import { z } from "zod";
import data from "prisma/data/eq/races.json";
import { characterController } from "@/api/controllers/characterController";
import {
  logWorkflowComplete,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const schema = z.array(
  z.object({
    name: z.string(),
  }),
);

const races = schema.parse(data);

const workflowName = "Ingesting races";

export const ingestRaces = async () => {
  logWorkflowStarted(workflowName);

  for (const r of races) {
    await characterController.createRace(r);
  }

  logWorkflowComplete(workflowName);
};
