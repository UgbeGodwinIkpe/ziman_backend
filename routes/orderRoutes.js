/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     quantity: { type: integer }
 *                     price: { type: number }
 *     responses:
 *       201:
 *         description: Order created
 */

/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get orders for current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */

const express = require('express');
const auth = require('../middleware/authMiddleware');
const riderAuth = require("../middleware/riderAuth");
const { createOrder, getUserOrders,
        getOrder, getOrders,
        getMerchantOrders, getOrderItems,
        updateOrderStatus,
        pickupPackage,
        pickupOrders,
     } = require('../controllers/orderController');
const router = express.Router();

router.post('/', auth, createOrder);
router.post('/status', auth, updateOrderStatus)
router.get('/user', auth, getUserOrders);
router.post('/pickup', auth, pickupPackage);
router.get('/pickup', auth, pickupOrders);
router.get('/orders/:id', auth, getOrder);
router.get('/merchant/:id', auth, getMerchantOrders)
router.get('/assigned', riderAuth, getOrders)
router.get('/:orderId/items', auth, getOrderItems)
router.get('/:id', auth, getOrder);
module.exports = router;
