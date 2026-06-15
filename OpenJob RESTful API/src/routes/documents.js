const express = require('express');
const path = require('path');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const uploadDocument = require('../middlewares/uploadDocument');
const DocumentService = require('../services/DocumentService');

const router = express.Router();

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Get all documents
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: List of documents
 */
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

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Upload a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid file format
 */
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

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get/Download document by ID
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document file
 *         content:
 *           application/octet-stream: {}
 *       404:
 *         description: Document not found
 */
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

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Delete document by ID
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
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
