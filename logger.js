const config = require('./config');

const createLogger = () => {
  return function(message) {
    console.log("[" + config.appName + "]: " + message);
  };
};

module.exports = createLogger;