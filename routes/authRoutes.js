/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */

const express = require('express');
const { register, login, editProfile, changePassword, deleteMyAccount } = require('../controllers/authController');
const {setUpPaymentMethod, CreatePayment, VerifyPayment}=require('../controllers/payment')
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/users/profile', auth, editProfile)
router.patch('/users/password', auth, changePassword)
router.delete('/users/delete/myaccount', auth, deleteMyAccount)
router.patch('/users/payment/method', auth, setUpPaymentMethod)
router.post('/users/order/create/payment', auth, CreatePayment)
router.get('/users/paystack/verify/:reference', auth, VerifyPayment)
router.get("/users/paymentComplete", VerifyPayment)
router.get("/test",(req, res)=>{
    res.send("Welcome to ziman APIs")
})

module.exports = router;
