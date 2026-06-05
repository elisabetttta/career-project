const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const formatMessage = (level, message, requestId) => {
  return `[${level}] [${new Date().toISOString()}] [ReqID: ${requestId}] ${message}`;
};

const logger = {
  info(message, requestId = generateRequestId()) {
    console.log(formatMessage('INFO', message, requestId));
  },

  warn(message, requestId = generateRequestId()) {
    console.warn(formatMessage('WARN', message, requestId));
  },

  error(message, requestId = generateRequestId()) {
    console.error(formatMessage('ERROR', message, requestId));
  },
};
module.exports = logger;