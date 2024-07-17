import { z } from "zod";
import data from "prisma/data/eq/items.json";
import { itemController } from "@/api/controllers/itemController";

const schema = z.array(
  z.object({
    name: z.string(),
    wikiSlug: z.string(),
  }),
);

const items = schema.parse(data);

export const ingestItems = async () => {
  await Promise.all(
    items.map((i) => {
      return itemController.create(i);
    }),
  );

  console.log(`...ingested all items.`);
};
