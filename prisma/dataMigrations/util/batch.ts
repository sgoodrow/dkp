export const processAllInBatches = async <T>({
  items,
  process,
  batchSize,
}: {
  items: T[];
  process: (batch: T[]) => Promise<unknown>;
  batchSize: number;
}) => {
  const totalBatches = Math.ceil(items.length / batchSize);
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const batch = items.slice(start, start + batchSize);
    await process(batch);
  }
};

export type BatchProcessor<TItem, TResult> = (
  batch: TItem[],
) => Promise<TResult[]>;

export const processManyInBatches = async <TItem, TResult>({
  get,
  process,
  batchSize,
}: {
  get: ({ take, skip }: { take: number; skip: number }) => Promise<TItem[]>;
  process: BatchProcessor<TItem, TResult>;
  batchSize: number;
}) => {
  let results: TResult[] = [];
  let skip = 0;
  do {
    const batch = await get({ take: batchSize, skip });

    if (batch.length === 0) {
      break;
    }

    results = results.concat(await process(batch));

    skip += batchSize;
  } while (true);

  return results;
};
