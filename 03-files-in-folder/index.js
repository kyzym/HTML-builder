const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.error('Error:', err.message);
  }

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileExt = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, `.${fileExt}`);

      fs.stat(filePath, (err, { size }) => {
        if (err) {
          console.error('Error:', err.message);
          return;
        }

        const fileSizeKb = size / 1024;
        console.log(`${fileName} - ${fileExt} - ${fileSizeKb}kb`);
      });
    }
  });
});
