const puppeteer = require('puppeteer');
const hbs = require('handlebars');
const fs = require('fs-extra');

const compile = async (templateName, data) => {
  const filePath = `../templates/${templateName}.hbs`;
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(data);
};

async function generatePDF(templateName, data, fileName) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlContent = await compile(templateName, data);
  await page.setContent(htmlContent);
  await page.pdf({ path: `./${fileName}.pdf`, format: 'A4', printBackground: true });
  await browser.close();
}

module.exports = { generatePDF };
