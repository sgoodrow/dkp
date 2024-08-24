import { maxBy } from "lodash";

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

export const processManyInBatches = async <
  TItem extends { id: number },
  TResult,
>({
  get,
  process,
  batchSize,
}: {
  get: ({
    take,
    cursor,
  }: {
    take: number;
    cursor: number | null;
  }) => Promise<TItem[]>;
  process: BatchProcessor<TItem, TResult>;
  batchSize: number;
}) => {
  let results: TResult[] = [];
  let cursor = null;
  do {
    const batch = await get({ take: batchSize, cursor });

    if (batch.length === 0) {
      break;
    }

    results = results.concat(await process(batch));

    cursor = maxBy(batch, (b) => b.id)?.id || null;
  } while (true);

  return results;
};
