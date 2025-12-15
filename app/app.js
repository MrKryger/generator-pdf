const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const imageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const extension = path.extname(filePath).slice(1); // Get file extension without dot
      const base64Image = Buffer.from(data).toString('base64');
      const base64String = `data:image/${extension};base64,${base64Image}`;
      resolve(base64String);
    });
  });
};
async function generatePDF(content) {
  const browser = await puppeteer.launch({
    headless: true,
    // defaultViewport: null,
    // executablePath: '/usr/bin/chromium-browser',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setContent(content, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });
  await browser.close();
  return pdfBuffer;
}

module.exports = {
  generatePDF,
  imageToBase64
}
