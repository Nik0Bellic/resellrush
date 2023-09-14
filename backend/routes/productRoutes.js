import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductByIdentifier,
} from '../controllers/productController.js';

router.route('/').get(getProducts);
router.route('/:productId').get(getProductByIdentifier);

export default router;
