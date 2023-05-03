const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

const mergeStyles = async () => {
  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css'
    );

    const stylesContentArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      })
    );

    const mergedStyles = stylesContentArray.join('\n');
    await fs.writeFile(outputFile, mergedStyles);
  } catch (err) {
    console.error('Alarma! Error:', err.message);
  }
};

mergeStyles();
