// Product routes
const express = require('express');
const productController = require('../controllers/productController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

// Get all products (with pagination and filters)
router.get('/', asyncHandler(async (req, res) => {
  await productController.getProducts(req, res);
}));

// Get product categories
router.get('/categories', asyncHandler(async (req, res) => {
  await productController.getCategories(req, res);
}));

// Get single product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  await productController.getProductById(req, res);
}));

module.exports = router;

