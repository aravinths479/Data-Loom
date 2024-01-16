const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../DatabaseConfig/db");

const requireAuth = async (req, res, next) => {
  // verify user is authenticated

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Query the MySQL database to get user information
    const [rows] = await db
      .promise()
      .query("SELECT userId,email FROM users WHERE userId = ?", [userId]);

    if (rows.length > 0) {
      req.user = rows[0];
      next();
    } else {
      res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.TokenExpiredError) {
      // Handle expired token
      return res.status(401).json({ error: "Token expired" });
    } else {
      // Handle other verification errors
      res.status(401).json({ error: "Request is not authorized" });
    }
  }
};

module.exports = requireAuth;
