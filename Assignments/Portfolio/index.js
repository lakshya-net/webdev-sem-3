const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;
const rootDir = __dirname;

// Serve the HTML, CSS, and browser JavaScript from this portfolio folder.
app.use(express.static(rootDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "portfolio" });
});

app.listen(port, () => {
  console.log(`Portfolio is running at http://localhost:${port}`);
});
