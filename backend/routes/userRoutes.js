import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateShippingInfo,
  getMyCurrentAsks,
  getMyCurrentBids,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updatePayMethod,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/logout', logoutUser);
router.post('/auth', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.put('/shipping', protect, updateShippingInfo);
router.put('/payMethod', protect, updatePayMethod);
router.route('/asks/mine').get(protect, getMyCurrentAsks);
router.route('/bids/mine').get(protect, getMyCurrentBids);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
