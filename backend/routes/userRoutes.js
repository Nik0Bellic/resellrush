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
  getMyPendingAsks,
  getMyHistoryAsks,
  getMyCurrentBids,
  getMyPendingBids,
  getMyHistoryBids,
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
router.route('/asks/current').get(protect, getMyCurrentAsks);
router.route('/asks/pending').get(protect, getMyPendingAsks);
router.route('/asks/history').get(protect, getMyHistoryAsks);
router.route('/bids/current').get(protect, getMyCurrentBids);
router.route('/bids/pending').get(protect, getMyPendingBids);
router.route('/bids/history').get(protect, getMyHistoryBids);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
