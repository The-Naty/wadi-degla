const PdfExportService = {};

const { nanoid } = require('nanoid');
const generatePdf = require('../utils/export-pdf');

PdfExportService.exportPdf = async (data) => {
  try {
    const fileType = data.documentType.toLowerCase();
    const fileId = nanoid(6);

    const fileName = `${fileType}-${fileId}`;
    const templateName = 'invoice';
    const pdf = await generatePdf(templateName, data, fileName);

    return pdf;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = PdfExportService;
