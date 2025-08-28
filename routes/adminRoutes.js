/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin panel routes
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

/**
 * @swagger
 * /api/admin/users/promote/{id}:
 *   put:
 *     summary: Promote a user to admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User promoted
 */

/**
 * @swagger
 * /api/admin/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant deleted
 */


// routes/adminRoutes.js
const express = require('express');
const { login, createUser, getAllUsers,
        getAllMerchants, getTotalPayments,
        getOrdersAndCustomers, deleteRestaurant,
        promoteUser,getUserOrders,
        getAllOrdersAndCustomers,
        createNotification,
        fetchNotifications,
        getMerchantSalesPayout,
     } = require('../controllers/adminController');
// const{getUserOrders}=require('../controllers/orderController')
const auth = require('../middleware/adminAuth');
// const roleCheck = require('../middleware/role');

const router = express.Router();


router.post('/', login)
router.post('/create_user', createUser)
// router.use(auth, roleCheck('admin')); // Protect all routes here

router.get('/users', auth, getAllUsers);
router.get('/merchants', auth, getAllMerchants);
router.get('/total/payments', auth, getTotalPayments);
router.get('/customers/oreders', auth, getOrdersAndCustomers);
router.delete('/restaurants/:id', auth, deleteRestaurant);
router.put('/users/promote/:id', auth, promoteUser);
router.get('/user/orders/:userId', auth, getUserOrders);
router.get('/users/orders/all', auth, getAllOrdersAndCustomers);
router.post('/notification', auth, createNotification);
router.get('/notifications', auth, fetchNotifications);
router.get('/salespayout', auth, getMerchantSalesPayout);

module.exports = router;
