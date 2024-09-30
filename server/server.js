const express = require("express");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.get("/generate-docs", (req, res) => {
  exec("node generate-docs.js", (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Error generating documentation: ${error.message}`);
      return;
    }
    if (stderr) {
      res.status(500).send(`JSDoc stderr: ${stderr}`);
      return;
    }
    res.send(`Documentation generated: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
