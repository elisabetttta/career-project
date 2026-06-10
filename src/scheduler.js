require("dotenv").config();
const app = require("./app");
const TaskScheduler = require("./taskScheduler");
const PORT = process.env.PORT || 3000;
const scheduler = new TaskScheduler();
const server = app.listen(PORT, () => {
console.log(`Server started on port ${PORT}`);
scheduler.start();
});
function gracefulShutdown() {
scheduler.stop();
server.close(() => {
process.exit(0);
 });
}
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);