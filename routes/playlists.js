const express = require("express");
const router = express.Router();
const { playlist } = require("../prisma/db");

// GET
router.get("/", async (req, res) => {
  const playlists = await playlist.findMany({
    include: {
      videos: true,
    },
  });

  res.status(200).json({
    success: true,
    data: playlists,
  });
});

// POST
router.post("/", async (req, res) => {
  const { title, desc } = req.body;
  const playlists = await playlist.create({
    title,
    desc,
  });

  res.status(200).json({
    success: true,
    data: playlists,
  });
});

module.exports = router;
