process.env.DB_FILE = ":memory:";
process.env.TOKEN = "test-token";
process.env.PRICE_UPDATE_INTERVAL_MS = "60000";
 const request = require("supertest");
 const app = require("../src/app");
 const db = require("../src/db/database");
 const priceRepository = require("../src/repositories/priceRepository");
 const binanceService = require("../src/services/binanceService");
 const TaskScheduler = require("../src/taskScheduler");
 const authHeader = { Authorization: "Bearer test-token" };
 function runSql(sql, params = []) {
 return new Promise((resolve, reject) => {
db.run(sql, params, function (err) {
 if (err) return reject(err);
resolve(this);
 });
});
}
beforeEach(async () => {
 await runSql("DELETE FROM currency_prices");
 await runSql("DELETE FROM currencies");
});
afterEach(() => {
jest.restoreAllMocks();
});
afterAll((done) => {
db.close(done);
});
describe("Currencies API with SQLite", () => {
test("GET /currencies requires authorization", async () => {
 const res = await request(app).get("/currencies");
expect(res.statusCode).toBe(403);
});
test("creates, reads, updates and deletes currency in SQLite", async () => {
 const createRes = await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: "Bitcoin", ticker: "btc" });
expect(createRes.statusCode).toBe(201);
expect(createRes.body).toMatchObject({ name: "Bitcoin", ticker: "BTC" });
 const listRes = await request(app).get("/currencies").set(authHeader);
expect(listRes.body).toEqual([
expect.objectContaining({ name: "Bitcoin", ticker: "BTC" }),
]);
 const updateRes = await request(app)
.put("/currencies/BTC")
.set(authHeader)
.send({ name: "Bitcoin Updated" });
expect(updateRes.statusCode).toBe(200);
expect(updateRes.body).toEqual({ message: "Updated" });
 const deleteRes = await request(app).delete("/currencies/BTC").set(authHeader);
expect(deleteRes.statusCode).toBe(200);
expect(deleteRes.body).toEqual({ message: "Deleted" });
});
test("SQL injection payload is saved as plain text", async () => {
 const injectionPayload = "Bitcoin'); DROP TABLE currencies; --";
 const createRes = await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: injectionPayload, ticker: "INJ" });
expect(createRes.statusCode).toBe(201);
 const listRes = await request(app).get("/currencies").set(authHeader);
expect(listRes.body).toEqual([
expect.objectContaining({ name: injectionPayload, ticker: "INJ" }),
]);
});
test("duplicate ticker returns 409", async () => {
 await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: "Ethereum", ticker: "ETH" });
 const duplicateRes = await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: "Ethereum Duplicate", ticker: "ETH" });
expect(duplicateRes.statusCode).toBe(409);
});
test("scheduler updates prices from Binance and saves them to SQLite", async () => {
 await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: "Bitcoin", ticker: "BTC" });
jest.spyOn(binanceService, "getPrice").mockResolvedValue("73412.18000000");
 const scheduler = new TaskScheduler({ intervalMs: 60000 });
 await scheduler.updatePrices();
 const savedPrice = await priceRepository.getByTicker("BTC");
expect(savedPrice).toMatchObject({
ticker: "BTC",
price: 73412.18,
});
 expect(binanceService.getPrice).toHaveBeenCalledWith("BTCUSDT");
});
test("GET /price returns saved price from SQLite and does not call Binance", async () => {
 await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: "Bitcoin", ticker: "BTC" });
 await priceRepository.save("BTC", "73412.18000000");
jest.spyOn(binanceService, "getPrice");
 const res = await request(app).get("/price?currency=BTC").set(authHeader);
expect(res.statusCode).toBe(200);
expect(res.body).toMatchObject({
currency: "BTC",
price: 73412.18,
});
expect(binanceService.getPrice).not.toHaveBeenCalled();
});
});