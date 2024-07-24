import {
  format,
  transports,
  createLogger as winstonCreateLogger,
} from "winston";

export const createLogger = (workflowName: string) =>
  winstonCreateLogger({
    format: format.combine(
      format.timestamp(),
      format.printf(
        ({ level, message, timestamp }) =>
          `${timestamp} ${level}: ${workflowName} - ${message}`,
      ),
    ),
    transports: [new transports.Console()],
  });
