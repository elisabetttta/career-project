const currencyRepository = require("../repositories/currencyRepository");
module.exports = {
  async getAll(req, res) {
    const data = await currencyRepository.getAll();
    res.json(data);
  },
  async create(req, res) {
    const { name, ticker } = req.body;
    const result = await currencyRepository.create(name, ticker);
    res.status(201).json(result);
  },
  async update(req, res) {
    const { ticker } = req.params;
    const { name } = req.body;
    const result = await currencyRepository.update(name, ticker);
    if (!result) return res.status(404).send("Not found");
    res.json({ message: "Updated" });
  },
  async remove(req, res) {
    const { ticker } = req.params;
    const result = await currencyRepository.delete(ticker);
    if (!result) return res.status(404).send("Not found");
    res.json({ message: "Deleted" });
  }
};