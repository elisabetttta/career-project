process.env.DB_FILE = ":memory:";
process.env.TOKEN = "test-token";
const axios = require("axios");
const request = require("supertest");
jest.mock("axios");
const app = require("../src/app");
const db = require("../src/db/database");
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
 await runSql("DELETE FROM currencies");
});
afterEach(() => {
 jest.restoreAllMocks();
});
afterAll((done) => {
 db.close(done);
});
describe("Currencies API", () => {
 test("GET /currencies requires authorization", async () => {
const res = await request(app).get("/currencies");
 expect(res.statusCode).toBe(403);
});
 test("POST /currencies creates currency in SQLite", async () => {
const res = await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "US Dollar",
 ticker: "usd",
});
 expect(res.statusCode).toBe(201);
 expect(res.body).toMatchObject({
 name: "US Dollar",
 ticker: "USD",
});
 expect(res.body.id).toBeDefined();
});
 test("POST /currencies validates request body", async () => {
const res = await request(app)
.post("/currencies")
.set(authHeader)
.send({ name: "Bitcoin" });
 expect(res.statusCode).toBe(400);
 expect(res.text).toBe("Name and ticker are required");
});
 test("GET /currencies returns currencies from SQLite", async () => {
await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "Bitcoin",
 ticker: "BTC",
});
const res = await request(app).get("/currencies").set(authHeader);
 expect(res.statusCode).toBe(200);
 expect(res.body).toEqual([
 expect.objectContaining({
 name: "Bitcoin",
 ticker: "BTC",
}),
]);
});
 test("PUT /currencies/:ticker updates currency in SQLite", async () => {
await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "Bitcoin",
 ticker: "BTC",
});
const updateRes = await request(app)
.put("/currencies/BTC")
.set(authHeader)
.send({
 name: "Bitcoin Updated",
});
 expect(updateRes.statusCode).toBe(200);
 expect(updateRes.body).toEqual({ message: "Updated" });
const listRes = await request(app).get("/currencies").set(authHeader);
 expect(listRes.body).toEqual([
 expect.objectContaining({
 name: "Bitcoin Updated",
 ticker: "BTC",
}),
]);
});
 test("DELETE /currencies/:ticker deletes currency from SQLite", async () => {
await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "Bitcoin",
 ticker: "BTC",
});
const deleteRes = await request(app).delete("/currencies/BTC").set(authHeader);
 expect(deleteRes.statusCode).toBe(200);
 expect(deleteRes.body).toEqual({ message: "Deleted" });
const listRes = await request(app).get("/currencies").set(authHeader);
 expect(listRes.body).toEqual([]);
});
 test("SQL injection payload is saved as plain text", async () => {
const injectionPayload = "Bitcoin'); DROP TABLE currencies; --";
const createRes = await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: injectionPayload,
 ticker: "INJ",
});
 expect(createRes.statusCode).toBe(201);
const listRes = await request(app).get("/currencies").set(authHeader);
 expect(listRes.statusCode).toBe(200);
 expect(listRes.body).toEqual([
 expect.objectContaining({
 name: injectionPayload,
 ticker: "INJ",
}),
]);
});
 test("duplicate ticker returns 409", async () => {
const firstRes = await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "Ethereum",
 ticker: "ETH",
});
 expect(firstRes.statusCode).toBe(201);
const duplicateRes = await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "Ethereum Duplicate",
 ticker: "ETH",
});
 expect(duplicateRes.statusCode).toBe(409);
const listRes = await request(app).get("/currencies").set(authHeader);
 expect(listRes.body).toEqual([
 expect.objectContaining({
 name: "Ethereum",
 ticker: "ETH",
}),
]);
});
test("GET /price returns price for existing currency", async () => {
await request(app)
.post("/currencies")
.set(authHeader)
.send({
 name: "Ethereum",
 ticker: "ETH",
});
axios.get.mockResolvedValue({
 data: {
 symbol: "ETHUSDT",
 price: "3500.12000000",
},
});
const res = await request(app).get("/price?currency=ETH").set(authHeader);
 expect(res.statusCode).toBe(200);
 expect(res.body).toEqual({
 currency: "ETH",
 price: "3500.12000000",
});
 expect(axios.get).toHaveBeenCalledWith("https://api.binance.com/api/v3/ticker/price", {
params: { symbol: "ETHUSDT" },
});
});
});