const express = require('express');
const path = require('path');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const uploadDocument = require('../middlewares/uploadDocument');
const DocumentService = require('../services/DocumentService');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const documents = await DocumentService.getDocuments();

    res.json({
      status: 'success',
      data: {
        documents,
      },
    });
  }),
);

router.post(
  '/',
  authenticate,
  uploadDocument.single('document'),
  asyncHandler(async (req, res) => {
    const data = await DocumentService.createDocument(req.auth.id, req.file);

    res.status(201).json({
      status: 'success',
      message: 'Dokumen berhasil diunggah',
      data: {
        documentId: data.id,
        filename: data.filename,
        originalName: data.original_name,
        size: data.size,
      },
    });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const document = await DocumentService.getDocumentById(req.params.id);

    const absolutePath = path.resolve(document.path);
    res.attachment(document.originalName);
    res.type(document.mimeType);
    res.sendFile(absolutePath);
  }),
);

router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await DocumentService.deleteDocumentById(req.auth.id, req.params.id);

    res.json({
      status: 'success',
      message: 'Dokumen berhasil dihapus',
    });
  }),
);

module.exports = router;
