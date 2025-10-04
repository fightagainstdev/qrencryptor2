const {
  writeFile,
  readFile,
} = require("fs").promises;
const { join } = require("path");

const main = async () => {
  try {
    const file = await readFile(join(__dirname, "out/404/index.html"));
    await writeFile(join(__dirname, "out/404.html"), file);
  } catch (error) {
    console.warn("Warning: out/404/index.html not found, skipping post-build step.");
  }
};

main();