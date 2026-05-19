const config = require('./config');

const logger = {
    log(level, message) {
        const timestamp = new Date().toISOString();
        console.log("[" + timestamp + "] [" + config.appName + "] [" + level.toUpperCase() + "]: " + message);
    },

    info(message) { this.log('info', message); },
    warn(message) { this.log('warn', message); },
    error(message) { this.log('error', message); }
};

module.exports = logger;