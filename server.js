const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/fetch-video", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  exec(`yt-dlp -f best -g --print title "${url}"`, (error, stdout) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch video" });
    }

    const lines = stdout.trim().split("\n");
    if (lines.length < 2) return res.status(500).json({ error: "Invalid yt-dlp response" });

    const title = lines[0];
    const downloadUrl = lines[1];
    res.json({ title, downloadUrl });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
