const config = require('../config');

const logger = {
    log(level, message) {
        const timestamp = new Date().toISOString();
        const requestId = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        console.log("[" + timestamp + "] [" + config.appName + "] [" + level.toUpperCase() + "] [ReqID: " + requestId + "]: " + message);
    },

    error(message) { this.log('error', message); },
    warn(message) { this.log('warn', message); },
    info(message) { this.log('info', message); },
    debug(message) { this.log('debug', message); },
    trace(message) { this.log('trace', message); }
};

module.exports = logger;