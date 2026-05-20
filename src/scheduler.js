const logger = require('./logger');

logger.info('scheduler.js запущен');

const scheduleTask = (name, interval, task) => {
  logger.info(`Задача ${name} запланирована`);

  setInterval(() => {
    logger.info(`Выполнение задачи: ${name}`);
    task();
  }, interval);
};

scheduleTask('RunningTask', 10000, () => {
  logger.info('running');
});