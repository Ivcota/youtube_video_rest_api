const express = require("express");
const router = express.Router();
const { user } = require("../prisma/db");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//POST - Create User
router.post("/", async (req, res) => {
  // Extract Sent Request
  const { name, email, password } = req.body;
  // Encrypt Password
  const salt = await bycrpt.genSalt(10);
  const hashedPassword = await bycrpt.hash(password, salt);

  // Create new User
  const newUser = await user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Sign JWT and Return Token
  const token = jwt.sign({ id: newUser.id }, process.env.SECRET, {
    // Expires in 30 Days
    expiresIn: "30d",
  });

  // Send Token
  res.json({
    success: true,
    token,
  });
});

//POST - Login
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  // Validate Email and Password
  if (!email || !password) {
    res.status(400).json({
      error: "Please enter username or password",
    });
  }

  // Check for user
  const storedUser = await user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    res.status(401).json({
      error: "Invalid",
    });
  }

  // Check Password
  const isMatch = await bycrpt.compare(password, storedUser.password);
  if (!isMatch) {
    res.status(401).json({
      error: "Invalid",
    });
  }

  // Sign JWT and Return Token
  const token = jwt.sign({ id: storedUser.id }, process.env.SECRET, {
    // Expires in 30 Days
    expiresIn: "30d",
  });

  // Send Token
  res.json({
    success: true,
    token,
  });
});

module.exports = router;
