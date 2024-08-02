export const getAbbreviations = (names: string[], minLength: number = 1) => {
  const abbrev: { [name: string]: string } = {};

  for (const name of names) {
    for (let i = minLength; i <= name.length; i++) {
      const slice = name.slice(0, i);
      if (!names.some((n) => n !== name && n.startsWith(slice))) {
        abbrev[name] = slice;
        break;
      }
    }
  }

  return abbrev;
};
