const express = require("express");
const router = express.Router();
const { video } = require("../prisma/db");
const youtubeEmbed = require("youtube-embed");

// GET
router.get("/", async (req, res) => {
  const vidoes = await video.findMany();

  res.status(200).json({
    success: true,
    data: vidoes,
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
      data: videos,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

module.exports = router;
