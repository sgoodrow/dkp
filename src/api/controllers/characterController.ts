import { characterRepository } from "@/api/repositories/characterRepository";

export const characterController = {
  createClass: async ({
    name,
    hexColor,
  }: {
    name: string;
    hexColor: string;
  }) => {
    return characterRepository.createClass({ name, hexColor });
  },

  createRace: async ({ name }: { name: string }) => {
    return characterRepository.createRace({ name });
  },
};
