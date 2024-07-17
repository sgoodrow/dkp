import { z } from "zod";
import data from "prisma/data/eq/races.json";
import { characterController } from "@/api/controllers/characterController";

const schema = z.array(
  z.object({
    name: z.string(),
  }),
);

const races = schema.parse(data);

export const ingestRaces = async () => {
  await Promise.all(
    races.map((r) => {
      return characterController.createRace(r);
    }),
  );
  console.log(`...ingested all races.`);
};
