const { exec } = require("child_process");
const path = require("path");

const jsFilesPath = path.join(__dirname, "../docs/src");
const outputDir = path.join(__dirname, "../docs/output");

// Command to generate the JSDoc documentation
const command = `npx jsdoc ${jsFilesPath} -d ${outputDir}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating documentation: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`JSDoc stderr: ${stderr}`);
    return;
  }
  console.log(`JSDoc output: ${stdout}`);
});
