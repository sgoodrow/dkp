type MatchingKeysAndValues<M> = { [k in keyof M]: k };

export const keysAreSameAsValuesCheck = <M>(
  map: MatchingKeysAndValues<M>,
): typeof map => map;
