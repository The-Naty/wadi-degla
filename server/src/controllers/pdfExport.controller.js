const PdfExportController = {};
const PdfExportService = require('../services/pdfExport.service');


PdfExportController.exportPdf = async (req, res) => {
  try {
    const data = req.body;
    const respond = await PdfExportService.exportPdf(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    res.status(200).send(respond);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = PdfExportController;
