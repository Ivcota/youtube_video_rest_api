const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const playlistRoutes = require("./routes/playlists");
const videoRoutes = require("./routes/videos");

// Init App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/videos", videoRoutes);
app.use("/playlists", playlistRoutes);

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
);
