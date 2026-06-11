const axios = require("axios");
module.exports = {
async getPrice(symbol) {
const response = await axios.get
("https://api.binance.com/api/v3/ticker/price",
{
params: {
symbol,},
});
 return Number(response.data.price);
 },
};