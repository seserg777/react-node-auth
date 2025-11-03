// Product controller
const Product = require('../models/Product');
const { Op } = require('sequelize');

class ProductController {
  // Get all products with pagination and filtering
  async getProducts(req, res) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        category, 
        inStock,
        minPrice,
        maxPrice,
        search
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where clause
      const where = {};
      
      if (category) {
        where.category = category;
      }
      
      if (inStock !== undefined) {
        where.inStock = inStock === 'true';
      }
      
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Product.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        products: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  // Get single product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ product });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  // Get product categories
  async getCategories(req, res) {
    try {
      const { sequelize } = require('../config/database');
      const categories = await Product.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
        where: {
          category: { [Op.ne]: null }
        },
        raw: true
      });

      res.json({
        categories: categories.map(c => c.category).filter(Boolean)
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
}

module.exports = new ProductController();

