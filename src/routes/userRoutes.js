import { Router } from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { uploadAvatar } from '../middleware/multer.js';
const router = Router();
router.patch(
  '/users/me/avatar',
  authenticate,
  uploadAvatar.single('photo'),
  updateUserAvatar,
);
export default router;
