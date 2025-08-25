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
        pickupOrders, cancelPickupOrders,
        getMerchantSales,
     } = require('../controllers/orderController');
const router = express.Router();

router.post('/', auth, createOrder);
router.post('/status', auth, updateOrderStatus)
router.get('/user', auth, getUserOrders);
router.get('/orders/:id', auth, getOrder);
router.get('/merchant/:id', auth, getMerchantOrders);
router.get('/merchant/sales/:id', auth, getMerchantSales);
router.get('/assigned', riderAuth, getOrders);
router.get('/:orderId/items', auth, getOrderItems);
router.get('/:id', auth, getOrder);
router.post('/pickup', auth, pickupPackage);
router.get('/user/pickup/requests', auth, pickupOrders);
router.delete('/cancel/pickup', auth, cancelPickupOrders);
/*
CastError: Cast to ObjectId failed for value "pickup" (type string) at path "_id" for model "Order"
    at SchemaObjectId.cast (/opt/render/project/src/node_modules/mongoose/lib/schema/objectId.js:251:11)
    at SchemaType.applySetters (/opt/render/project/src/node_modules/mongoose/lib/schemaType.js:1255:12)
    at SchemaType.castForQuery (/opt/render/project/src/node_modules/mongoose/lib/schemaType.js:1673:17)
    at cast (/opt/render/project/src/node_modules/mongoose/lib/cast.js:390:32)
    at Query.cast (/opt/render/project/src/node_modules/mongoose/lib/query.js:4999:12)
    at Query._castConditions (/opt/render/project/src/node_modules/mongoose/lib/query.js:2325:10)
    at model.Query._findOne (/opt/render/project/src/node_modules/mongoose/lib/query.js:2648:8)
    at model.Query.exec (/opt/render/project/src/node_modules/mongoose/lib/query.js:4548:80)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getOrder (/opt/render/project/src/controllers/orderController.js:35:17)
*/

module.exports = router;
