import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/latest', getLatestProducts);
router
  .route('/:productId')
  .get(getProductByIdentifier)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
