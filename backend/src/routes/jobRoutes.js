import express from 'express';
import authMiddleware from '../middleware/auth.js';
import authorizePermissions from '../middleware/authorizePermissions.js';
import upload from '../middleware/multer.js';
import {
  createJobController,
  getAllJobsController,
  updateJobController,
  deleteJobController,
  applyToJobController,
  getMyJobsController,
  viewApplicantsController,
  getJobByIdController,
  updateApplicantStatusController,
  getMyApplicationsController 
} from '../controllers/jobController.js';

const router = express.Router();

// user routes
router.get('/get-jobs', getAllJobsController);
router.get('/job/:id', getJobByIdController);
router.post('/apply-to-job/:id', authMiddleware, upload.single('resume'), applyToJobController);
router.get('/my-applications', authMiddleware, authorizePermissions('user'), getMyApplicationsController); 
 
// recruiter routes
router.post('/create-job', authMiddleware, authorizePermissions('recruiter'), upload.single('companyLogo'), createJobController);
router.patch('/update-job/:id', authMiddleware, authorizePermissions('recruiter'), upload.single('companyLogo'), updateJobController);
router.delete('/delete-job/:id', authMiddleware, authorizePermissions('recruiter'), deleteJobController);
router.get('/my-jobs', authMiddleware, authorizePermissions('recruiter'), getMyJobsController);
router.get('/job/:id/applicants', authMiddleware, authorizePermissions('recruiter'), viewApplicantsController);

router.patch(
  '/job/:jobId/applicant/:applicantId/status',
  authMiddleware,
  authorizePermissions('recruiter'),
  updateApplicantStatusController
);


export default router;