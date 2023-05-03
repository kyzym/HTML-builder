const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const outputStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt('Write something ("exit" to exit): ');
rl.prompt();

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
  } else {
    outputStream.write(`${input}\n`, (err) => {
      if (err) {
        console.error('Error. call exorcist:', err.message);
      } else {
        console.log('As you wish. Done.');
      }
      rl.prompt();
    });
  }
});

rl.on('close', () => {
  console.log('\nThats all. See ya!');
  outputStream.end();
  process.exit();
});

process.on('SIGINT', () => {
  process.stdout.write('\n');
  rl.close();
});
