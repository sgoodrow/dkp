import { z } from "zod";
import data from "prisma/data/eq/classes.json";
import { characterController } from "@/api/controllers/characterController";
import {
  logWorkflowComplete,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const schema = z.array(
  z.object({
    name: z.string(),
    colorHexLight: z.string(),
    colorHexDark: z.string(),
    allowedRaces: z.array(z.string()),
  }),
);

const classes = schema.parse(data);

const workflowName = "Ingesting classes";

export const ingestClasses = async () => {
  logWorkflowStarted(workflowName);

  for (const c of classes) {
    await characterController.createClass(c);
  }

  logWorkflowComplete(workflowName);
};
