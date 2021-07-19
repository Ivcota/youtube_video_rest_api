const express = require("express");
const router = express.Router();
const { user } = require("../prisma/db");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  res.json({
    success: true,
    token,
  });
});

module.exports = router;
