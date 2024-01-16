const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const uuid = require("uuid");

const db = require("../DatabaseConfig/db");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

const registerUser = (user, res) => {

  db.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const token = generateToken(user);
      return res.status(201).json({
        email: user.email,
        token: token,
      });
    }
  });
};

exports.signup = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email not valid" });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: "Password not strong enough" });
  }
  
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else if (results.length > 0) {
      console.log("hai");
      return res.status(409).json({
        error: "Email already exists",
      });
    } else {
      // Hash the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const timestampUUID = uuid.v1();
          const user = { userID: timestampUUID, email, password: hash };
          return registerUser(user, res);
        }
      });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email not valid" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else if (results.length < 1) {
      return res.status(401).json({
        error: "User Not Found",
      });
    } else {
      const storedHash = results[0].password;

      // Compare the stored hash with the input password
      bcrypt.compare(password, storedHash, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: "Authentication failed",
          });
        } else if (result) {
          console.log(results);
          const token = generateToken(results[0]);
          return res.status(200).json({
            email: email,
            token: token,
          });
        } else {
          return res.status(401).json({
            error: "Wrong password",
          });
        }
      });
    }
  });
};
