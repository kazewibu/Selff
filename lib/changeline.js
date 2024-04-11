const fs = require('fs');
const util = require('util');

async function changeline(linenya, linebaru, filePath) {
  const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile);

  try {
    const data = await readFile(filePath, 'utf8');
    const lines = data.split('\n');
    lines[linenya] = linebaru;
    const updatedContent = lines.join('\n');

    await writeFile(filePath, updatedContent, 'utf8');
    return 'Baris berhasil diubah.'
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  changeline
}
