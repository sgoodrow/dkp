const BATCH_SIZE = 1000;

export const processBatch = async <T, R>(
  list: T[],
  processFn: (batch: T[]) => Promise<R>,
  onBatchComplete?: (batchNumber: number, totalBatches: number) => void,
) => {
  const totalBatches = Math.ceil(list.length / BATCH_SIZE);
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * BATCH_SIZE;
    const batch = list.slice(start, start + BATCH_SIZE);
    await processFn(batch);
    onBatchComplete?.(batchIndex + 1, totalBatches);
  }
};

export const logWorkflowStarted = (workflowName: string) => {
  logWorkflowMessage(workflowName, "Started.");
};

export const logWorkflowMessage = (
  workflowName: string,
  progressMessage: string,
) => {
  console.log(`${workflowName}: ${progressMessage}`);
};

export const logWorkflowComplete = (workflowName: string) => {
  logWorkflowMessage(workflowName, "Complete.");
};
