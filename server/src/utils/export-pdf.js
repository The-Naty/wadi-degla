const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');

const compile = async (templateName, data) => {
  const filePath = `../server/src/templates/${templateName}.hbs`;
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(data);
};

const generatePDF = async (templateName, data, fileName) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
  const page = await browser.newPage();
  const htmlContent = await compile(templateName, data);
  await page.setContent(htmlContent, { timeout: 60000 });
  await page.pdf({ path: `../server/src/common/uploads/${fileName}.pdf`, format: 'A4', printBackground: true });
  await browser.close();
};

module.exports = generatePDF;
