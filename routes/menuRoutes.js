const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admAuth=require("../middleware/adminAuth")
const upload=require('../middleware/upload')
const { addMenuItem, getMenuItems, updatePrice, deleteMenuItem , getMenuItem, getMenus} = require('../controllers/menuController');



router.post('/:restaurantId', auth, upload.array('images'), addMenuItem);
router.get('/:restaurantId', getMenuItems);
router.put('/:itemId', auth, updatePrice)
router.delete('/:itemId', auth, deleteMenuItem)
router.get('/menu-items/:id', auth, getMenuItem)
router.get('/menus/:buzId', admAuth, getMenus)


module.exports = router;