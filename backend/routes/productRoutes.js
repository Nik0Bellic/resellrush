import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  placeAsk,
  saleNow,
  placeBid,
  purchaseNow,
} from '../controllers/productController.js';
import { protect, seller, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/latest', getLatestProducts);
router
  .route('/:productId')
  .get(getProductByIdentifier)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:productId/asks').post(protect, seller, placeAsk);
router.route('/:productId/sale').post(protect, seller, saleNow);
router.route('/:productId/bids').post(protect, placeBid);
router.route('/:productId/purchase').post(protect, purchaseNow);

export default router;
