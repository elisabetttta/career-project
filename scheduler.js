const createLogger = require('./logger');
const logger = createLogger();

// Синхронный запуск
logger("scheduler.js запущен");

const scheduleTask = (name, interval, task) => {
  logger("Задача " + name + " запланирована (интервал: " + interval + "мс)");
  setInterval(task, interval);
};

// Добавляем задачу: каждые 10 секунд (10000 миллисекунд)
scheduleTask("RunningTask", 10000, () => {
  logger("running");
});