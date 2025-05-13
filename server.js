const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Behzad Video Downloader backend is live!");
});

// Main video fetch route
app.post("/api/fetch-video", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  const cmd = `yt-dlp -g -e "${url}"`; // -g for URL, -e for title

  exec(cmd, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).json({ error: "Failed to fetch video" });
    }

    const lines = stdout.trim().split("\n");
    const title = lines[0];
    const downloadUrl = lines[1];

    if (!title || !downloadUrl) {
      return res.status(500).json({ error: "Invalid video data" });
    }

    res.json({ title, downloadUrl });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
