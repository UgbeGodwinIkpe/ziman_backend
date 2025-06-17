const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload=require('../middleware/upload')
const { addMenuItem, getMenuItems, updatePrice, deleteMenuItem , getMenuItem} = require('../controllers/menuController');



router.post('/:restaurantId', auth, upload.array('images'), addMenuItem);
router.get('/:restaurantId', getMenuItems);
router.put('/:itemId', auth, updatePrice)
router.delete('/:itemId', auth, deleteMenuItem)
router.get('/menu-items/:id', auth, getMenuItem)


module.exports = router;