const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { ApplicationCreatePayloadSchema, ApplicationUpdatePayloadSchema } = require('../validators/applications');

// ALL PROTECTED
router.use(authMiddleware);

router.post('/', validate(ApplicationCreatePayloadSchema), applicationsController.createApplication);
router.get('/', applicationsController.getApplications);
router.get('/:id', applicationsController.getApplicationById);
router.get('/user/:userId', applicationsController.getApplicationsByUserId);
router.get('/job/:jobId', applicationsController.getApplicationsByJobId);
router.put('/:id', validate(ApplicationUpdatePayloadSchema), applicationsController.updateApplication);
router.delete('/:id', applicationsController.deleteApplication);

module.exports = router;
