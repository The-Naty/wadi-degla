const express = require('express');
const PdfExportController = require('../controllers/pdfExport.controller');

const router = express.Router();

router.post('/invoice', PdfExportController.exportPdf);

module.exports = router;
