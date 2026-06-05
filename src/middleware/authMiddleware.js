require("dotenv").config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send("Forbidden");
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.TOKEN) {
    return res.status(403).send("Forbidden");
  }

  next();
}

module.exports = authMiddleware;