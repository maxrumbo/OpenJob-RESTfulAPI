const path = require('path');
const fs = require('fs');
const documentsService = require('../services/documentsService');
const InvariantError = require('../utils/InvariantError');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new InvariantError('Document file is required');
    }

    const userId = req.userId;
    const { originalname, filename, mimetype, size } = req.file;
    const file_url = `/uploads/${filename}`;

    const documentId = await documentsService.addDocument({
      userId,
      name: originalname,
      file_url,
      mime_type: mimetype,
      size,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: { documentId },
    });
  } catch (error) {
    return next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await documentsService.getDocuments();
    return res.status(200).json({
      status: 'success',
      data: { documents },
    });
  } catch (error) {
    return next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const document = await documentsService.getDocumentById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { document },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const doc = await documentsService.deleteDocumentById(req.params.id);

    // Delete file from disk
    const filePath = path.join(__dirname, '..', '..', doc.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { uploadDocument, getDocuments, getDocumentById, deleteDocument };
