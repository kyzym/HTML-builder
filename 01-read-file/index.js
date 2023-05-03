const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});

readStream.on('error', (error) => {
  console.error('Произошла ошибка при чтении файла:', error.message);
});
