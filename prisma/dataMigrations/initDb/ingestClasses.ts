import { z } from "zod";
import data from "prisma/data/eq/classes.json";
import { characterController } from "@/api/controllers/characterController";

const schema = z.array(
  z.object({
    name: z.string(),
    hexColor: z.string(),
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
