import pino from "pino";

const transport = pino.transport({
  target: "pino/file",
  options: {
    destination: "./logs/output.log",
    mkdir: true
  }
});



export const logger = pino(
  {
    customLevels: { catastrophe: 70 },
    level: process.env.PINO_LOG_LEVEL || "info",
    formatters: {
      level: (label) => ({ level: label.toUpperCase() })
    },
    redact: {
      paths: ["user.password", "user.token"],
      censor: "[REDACTED]"
    }
  },
  transport
);
