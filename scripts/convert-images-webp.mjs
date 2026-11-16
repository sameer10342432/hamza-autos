/**
 * Hamza Autos - Automated Image WebP Conversion Pipeline
 * Uses Chrome Canvas WebP encoder to convert all JPEG/PNG assets
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function findImages(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findImages(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function convertAllImages() {
  console.log('Starting automated WebP conversion...');
  const images = findImages('public/assets/images');
  console.log(`Found ${images.length} images to convert to WebP.\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();

  let totalOriginal = 0;
  let totalOptimized = 0;
  const reportData = [];

  for (const imgPath of images) {
    const originalSize = fs.statSync(imgPath).size;
    totalOriginal += originalSize;

    const base64Data = fs.readFileSync(imgPath).toString('base64');
    const ext = path.extname(imgPath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const dataUri = `data:${mime};base64,${base64Data}`;

    // Convert via Chrome canvas to webp at 0.82 quality (optimal balance of quality and size)
    const result = await page.evaluate(async (uri) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const webpDataUri = canvas.toDataURL('image/webp', 0.82);
          resolve({
            width: img.width,
            height: img.height,
            webpBase64: webpDataUri.split(',')[1]
          });
        };
        img.onerror = reject;
        img.src = uri;
      });
    }, dataUri);

    const webpBuffer = Buffer.from(result.webpBase64, 'base64');
    const webpPath = imgPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    fs.writeFileSync(webpPath, webpBuffer);

    const newSize = webpBuffer.length;
    totalOptimized += newSize;
    const savingPercent = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

    console.log(`Converted: ${path.basename(imgPath)} -> ${path.basename(webpPath)}`);
    console.log(`  Size: ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (-${savingPercent}%) [${result.width}x${result.height}]`);

    reportData.push({
      originalPath: imgPath.replace(/\\/g, '/'),
      webpPath: webpPath.replace(/\\/g, '/'),
      dimensions: `${result.width}x${result.height}`,
      originalSizeKB: (originalSize / 1024).toFixed(1),
      optimizedSizeKB: (newSize / 1024).toFixed(1),
      savingsPercent: `${savingPercent}%`
    });
  }

  await browser.close();

  const totalSaved = totalOriginal - totalOptimized;
  const overallPercent = ((totalSaved / totalOriginal) * 100).toFixed(1);

  console.log('\n================ WEBP CONVERSION COMPLETE ================');
  console.log(`Original Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized Total: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Space Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (-${overallPercent}%)`);
  console.log('==========================================================\n');

  fs.writeFileSync('scripts/image-optimization-stats.json', JSON.stringify(reportData, null, 2));
}

convertAllImages().catch(console.error);
