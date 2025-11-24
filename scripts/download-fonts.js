
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = [
  {
    name: 'MaShanZheng-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/mashanzheng/MaShanZheng-Regular.ttf'
  },
  {
    name: 'ZhiMangXing-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/zhimangxing/ZhiMangXing-Regular.ttf'
  }
];

const publicDir = path.join(__dirname, '../public/fonts');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function downloadAll() {
  console.log('Checking and downloading fonts...');
  for (const font of fonts) {
    const dest = path.join(publicDir, font.name);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading ${font.name}...`);
      try {
        await downloadFile(font.url, dest);
      } catch (e) {
        console.error(`Failed to download ${font.name}:`, e);
      }
    } else {
      console.log(`Font exists: ${font.name}`);
    }
  }
}

downloadAll();
