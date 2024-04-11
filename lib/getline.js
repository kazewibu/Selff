const fs = require('fs');

async function getLine(targetline, filepath) {
  try {
    const fileContent = await fs.promises.readFile(filepath, 'utf-8');
    const lines = fileContent.split('\n');
    if (targetline <= lines.length) {
      return lines[targetline - 1];
    } else {
      return 'Baris tidak tersedia dalam file ini.';
    }
  } catch (error) {
    console.log('Terjadi kesalahan:', error);
    return 'Gagal membaca file';
  }
}

module.exports = {
  getLine
}
