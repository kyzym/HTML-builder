const fs = require('fs').promises;
const path = require('path');

const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(distDir, 'style.css');

async function createDistFolder() {
  try {
    await fs.access(distDir);
  } catch {
    await fs.mkdir(distDir);
  }
}

async function replaceTemplateTags(templateContent) {
  const regex = /{{(\w+)}}/g;
  let match;
  let result = templateContent;

  while ((match = regex.exec(templateContent)) !== null) {
    const componentName = match[1];
    const componentPath = path.join(componentsDir, `${componentName}.html`);

    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      result = result.replace(`{{${componentName}}}`, componentContent);
    } catch (err) {
      console.error(`Alarma! Error reading"${componentName}":`, err.message);
    }
  }

  return result;
}

async function buildHTML() {
  try {
    const templateContent = await fs.readFile(templateFile, 'utf-8');
    const modifiedContent = await replaceTemplateTags(templateContent);
    await fs.writeFile(path.join(distDir, 'index.html'), modifiedContent);
  } catch (err) {
    console.error('Alarma! Error building:', err.message);
  }
}

async function buildCSS() {
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
}

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src, { withFileTypes: true });

    for (const file of files) {
      const fromFilePath = path.join(src, file.name);
      const toFilePath = path.join(dest, file.name);

      if (file.isFile()) {
        await fs.copyFile(fromFilePath, toFilePath);
      } else if (file.isDirectory()) {
        await copyAssets(fromFilePath, toFilePath);
      }
    }
  } catch (err) {
    console.error('Alarma, Error:', err.message);
  }
}

async function buildPage() {
  await createDistFolder();
  await buildHTML();
  await buildCSS();
  await copyAssets(assetsDir, path.join(distDir, 'assets'));
}

buildPage();
