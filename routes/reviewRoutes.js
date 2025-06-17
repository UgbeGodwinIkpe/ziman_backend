
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addReview, getReviews } = require('../controllers/reviewController');


router.post('/:restaurantId/reviews', auth, addReview);
router.get('/:restaurantId/reviews', getReviews);
