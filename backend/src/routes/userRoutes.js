import express from 'express';
import { loginController, registerController, createCompanyProfileController, getCurrentUserController  } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);

// recruiter onboarding
router.post(
  '/create-profile', 
  authMiddleware, // Must be logged in
  upload.single('companyLogo'), 
  createCompanyProfileController
);

router.get('/me', authMiddleware, getCurrentUserController);

export default router;