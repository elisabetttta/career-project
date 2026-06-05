const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const currencyController = require("../controllers/currencyController");
router.get("/", authMiddleware, currencyController.getAll);
router.post("/", authMiddleware, currencyController.create);
router.put("/:ticker", authMiddleware, currencyController.update);
router.delete("/:ticker", authMiddleware, currencyController.remove);
module.exports = router;