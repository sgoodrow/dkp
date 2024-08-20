import { upperFirst } from "lodash";

export const character = {
  isValidName: (name: string) => {
    return /^[a-zA-Z]+$/.test(name);
  },

  normalizeName: (name: string) => {
    return upperFirst(name.trim().toLowerCase());
  },
};
