const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// PUBLIC
router.get('/', documentsController.getDocuments);
router.get('/:id', documentsController.getDocumentById);

// PROTECTED
router.post('/', authMiddleware, upload.single('document'), documentsController.uploadDocument);
router.delete('/:id', authMiddleware, documentsController.deleteDocument);

module.exports = router;
