export const character = {
  isValidName: (name: string) => {
    return /^[a-zA-Z]+$/.test(name);
  },
};
