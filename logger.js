const config = require('./config');

const createLogger = () => {
  return (message) => {
    console.log([${config.appName}]: ${message});
  };
};

module.exports = createLogger;