import {
  format,
  transports,
  createLogger as winstonCreateLogger,
} from "winston";

export const createLogger = (workflowName: string) =>
  winstonCreateLogger({
    format: format.combine(
      format.timestamp(),
      format.printf(({ level, message, timestamp, durationMs, ...rest }) => {
        let log = `${timestamp} ${level}: ${workflowName} - ${message}`;

        // Include duration if present
        if (durationMs) {
          log += ` (duration: ${durationMs}ms)`;
        }

        // Include any other extra metadata
        const restMetadata = Object.keys(rest).length
          ? JSON.stringify(rest)
          : "";
        return `${log} ${restMetadata}`;
      }),
    ),
    transports: [new transports.Console()],
  });
