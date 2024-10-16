import dotenv from "dotenv";
import path from "path";
import { type TransformableInfo } from "logform";
import winston, { type Logger } from "winston";

dotenv.config();

const logPath = process.env.LOG_PATH as string;
const logLevel = process.env.LOG_LEVEL as string;
const logSilent = process.env.LOG_SILENT as string;

const logger: Logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "test-order-app" },
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logPath, "info.log"),
      level: "info",
    }),
    new winston.transports.File({
      filename: path.join(logPath, "debug.log"),
      level: "debug",
    }),
    new winston.transports.File({
      filename: path.join(logPath, "all_combined.log"),
    }),
  ],
});

if (process.env.NODE_ENV !== "test") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          (info: TransformableInfo) =>
            `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

logger.silent = logSilent === "true";
if (logger.silent) {
  console.log("Logger is disabled");
}

export default logger;
