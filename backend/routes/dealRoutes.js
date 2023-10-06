import express from 'express';
const router = express.Router();
import {
  getDeals,
  getDealById,
  updateDealToSentBySeller,
  updateDealToVerificationInProgress,
  updateDealToVerified,
  updateDealToSentToBuyer,
  updateDealToShipped,
} from '../controllers/dealController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getDeals);
router.route('/:id').get(protect, getDealById);
router.route('/:id/bySeller').put(protect, admin, updateDealToSentBySeller);
router
  .route('/:id/verification')
  .put(protect, admin, updateDealToVerificationInProgress);
router.route('/:id/verify').put(protect, admin, updateDealToVerified);
router.route('/:id/toBuyer').put(protect, admin, updateDealToSentToBuyer);
router.route('/:id/shipped').put(protect, admin, updateDealToShipped);

export default router;
