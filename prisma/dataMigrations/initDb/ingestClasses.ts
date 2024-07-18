import { z } from "zod";
import data from "prisma/data/eq/classes.json";
import { characterController } from "@/api/controllers/characterController";

const schema = z.array(
  z.object({
    name: z.string(),
    colorHexLight: z.string(),
    colorHexDark: z.string(),
    allowedRaces: z.array(z.string()),
  }),
);

const classes = schema.parse(data);

export const ingestClasses = async () => {
  await Promise.all(
    classes.map((c) => {
      return characterController.createClass(c);
    }),
  );
  console.log(`...ingested all classes.`);
};
