/**
 * @returns a HTML ID from a string by replacing spaces with hyphens
 */
export const getId = (s: string) => {
  return s.replace(/\W/g, "-");
};
