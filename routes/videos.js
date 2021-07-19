const express = require("express");
const router = express.Router();
const { video } = require("../prisma/db");
const youtubeEmbed = require("youtube-embed");

// GET
router.get("/", async (req, res) => {
  const vidoes = await video.findMany();

  res.status(200).json({
    success: true,
    database: process.env.DATABASE_TYPE,
    data: vidoes,
  });
});

// GET ONE

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const baseId = parseInt(id);
  const video_ = await video.findUnique({
    where: {
      id: baseId,
    },
  });

  res.status(200).json({
    success: true,
    database: process.env.DATABASE_TYPE,
    data: video_,
  });
});

// POST
router.post("/", async (req, res) => {
  const { title, desc, url, playlistId } = req.body;
  const embed = youtubeEmbed(url);

  try {
    const videos = await video.create({
      data: {
        title,
        desc,
        url: embed,
        playlistId,
      },
    });

    res.status(200).json({
      success: true,
      database: process.env.DATABASE_TYPE,
      data: videos,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

module.exports = router;
