const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const ApplicationService = require('../services/ApplicationService');
const CacheService = require('../services/CacheService');
const ProducerService = require('../services/ProducerService');
const {
  createApplicationSchema,
  updateApplicationSchema,
} = require('../validators/applications');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  validate(createApplicationSchema),
  asyncHandler(async (req, res) => {
    const jobId = req.body.jobId || req.body.job_id;
    const applicationId = await ApplicationService.createApplication(req.auth.id, req.body);
    await CacheService.delete(`applications:user:${req.auth.id}`);
    await CacheService.delete(`applications:job:${jobId}`);

    ProducerService.sendMessage(
      'export:applications',
      JSON.stringify({ application_id: applicationId }),
    ).catch((error) => {
      console.error('Gagal mengirim pesan RabbitMQ:', error);
    });

    res.status(201).json({
      status: 'success',
      message: 'Lamaran pekerjaan berhasil ditambahkan',
      data: {
        id: applicationId,
        user_id: req.auth.id,
        job_id: jobId,
        status: 'pending',
      },
    });
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const applications = await ApplicationService.getApplications();

    res.json({
      status: 'success',
      data: {
        applications,
      },
    });
  }),
);

router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    try {
      const applications = await CacheService.get(`applications:user:${req.params.userId}`);
      res.setHeader('X-Data-Source', 'cache');
      return res.json({
        status: 'success',
        data: {
          applications: JSON.parse(applications),
        },
      });
    } catch (error) {
      const applications = await ApplicationService.getApplicationsByUser(req.params.userId);
      await CacheService.set(`applications:user:${req.params.userId}`, JSON.stringify(applications));

      res.setHeader('X-Data-Source', 'database');
      res.json({
        status: 'success',
        data: {
          applications,
        },
      });
    }
  }),
);

router.get(
  '/job/:jobId',
  asyncHandler(async (req, res) => {
    try {
      const applications = await CacheService.get(`applications:job:${req.params.jobId}`);
      res.setHeader('X-Data-Source', 'cache');
      return res.json({
        status: 'success',
        data: {
          applications: JSON.parse(applications),
        },
      });
    } catch (error) {
      const applications = await ApplicationService.getApplicationsByJob(req.params.jobId);
      await CacheService.set(`applications:job:${req.params.jobId}`, JSON.stringify(applications));

      res.setHeader('X-Data-Source', 'database');
      res.json({
        status: 'success',
        data: {
          applications,
        },
      });
    }
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const application = await CacheService.get(`application:${req.params.id}`);
      res.setHeader('X-Data-Source', 'cache');
      return res.json({
        status: 'success',
        data: JSON.parse(application),
      });
    } catch (error) {
      const application = await ApplicationService.getApplicationById(req.params.id);
      await CacheService.set(`application:${req.params.id}`, JSON.stringify(application));

      res.setHeader('X-Data-Source', 'database');
      res.json({
        status: 'success',
        data: application,
      });
    }
  }),
);

router.put(
  '/:id',
  validate(updateApplicationSchema),
  asyncHandler(async (req, res) => {
    const applicationId = req.params.id;
    const application = await ApplicationService.getApplicationById(applicationId);
    await ApplicationService.updateApplicationStatus(applicationId, req.body.status);
    await CacheService.delete(`application:${applicationId}`);
    await CacheService.delete(`applications:user:${application.user.id}`);
    await CacheService.delete(`applications:job:${application.job.id}`);

    res.json({
      status: 'success',
      message: 'Status lamaran pekerjaan berhasil diperbarui',
    });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const application = await ApplicationService.getApplicationById(req.params.id);
    await ApplicationService.deleteApplicationById(req.auth.id, req.params.id);
    await CacheService.delete(`application:${req.params.id}`);
    await CacheService.delete(`applications:user:${req.auth.id}`);
    await CacheService.delete(`applications:job:${application.job.id}`);

    res.json({
      status: 'success',
      message: 'Lamaran pekerjaan berhasil dihapus',
    });
  }),
);

module.exports = router;
