/**
 * @swagger
 * tags:
 *   name: Merchants
 *   description: Merchant endpoints
 */
/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create new merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - email
 *               - password
 *               - category
 *               - image
 *             properties:
 *               name:
 *                 type: String
 *               address:
 *                 type: String
 *               email:
 *                 type: String
 *               password:
 *                 type: String
 *               phone:
 *                  type:String
 *               category:
 *                  type:String
 *               image:
 *                  type:String
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already exists
 
 */
/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all merchants
 *     tags: [Merchants]
 *     responses:
 *       200:
 *         description: A list of merchants
 */

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a single merchant by ID
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Not found
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/role');
const upload=require('../middleware/upload')
const {
    createRestaurant,
    login,
    searchRestaurants,
    getAllRestaurants,
    getRestaurantById,
    getRestaurantsByCategory,
    getPaginatedRestaurants,
    changePassword,
    setupBankAccount,
    setBuzLocation,
} = require('../controllers/restaurantController');
const {raiseQuery}=require("../controllers/query")

//register business
router.post('/register/business', upload.array('images'), createRestaurant);
router.post('/', auth, roleCheck('admin'), createRestaurant);
//login login business
router.post('/login/business', login)
//search restaurant
router.get('/search', auth, searchRestaurants);
router.get('/', auth, getAllRestaurants);
router.get('/filter', getRestaurantsByCategory);     // GET /api/restaurants/filter?category=pizza
router.get('/page', getPaginatedRestaurants);        // GET /api/restaurants/page?page=1&limit=5
router.get('/:id',  getRestaurantById);
router.put('/:id', auth, changePassword);
router.post('/bank/account/:buzId', auth, setupBankAccount);
router.put('/location/:id', auth, setBuzLocation)
router.post('/query/:id', auth, raiseQuery)

module.exports = router;
