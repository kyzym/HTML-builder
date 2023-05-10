const fs = require('fs').promises;
const path = require('path');

const fromFolderPath = path.join(__dirname, 'files');
const toFolderPath = path.join(__dirname, 'files-copy');

const copyDir = async (src, dest) => {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src, { withFileTypes: true });

    for (const file of files) {
      const fromFilePath = path.join(src, file.name);
      const toFilePath = path.join(dest, file.name);

      if (file.isFile()) {
        await fs.copyFile(fromFilePath, toFilePath);
      }
    }
  } catch (err) {
    console.error('Alarma,  Error:', err.message);
  }
};

copyDir(fromFolderPath, toFolderPath);
