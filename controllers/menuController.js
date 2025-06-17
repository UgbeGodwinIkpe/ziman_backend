const MenuItem = require('../models/menu');

exports.addMenuItem = async (req, res) => {
  const images = req.files.map(file => file.path);
  console.log(req.body, images)
  const item = new MenuItem({ items:[{name:req.body.item, description:req.body.description, price:req.body.price, image:images[0]}], restaurant: req.user.id });
  await item.save();
  console.log(item)
  res.status(201).json(item);
};

exports.updatePrice=async(req, res)=>{
  const {newprice, itemId}=req.body
  const updatedMenu=await MenuItem.findOneAndUpdate({'items._id':itemId}, { $set: { "items.$.price": newprice } },          // update just its price
    { new: true })

    if (!updatedMenu)
      return res.status(404).json({ message: "Menu or item not found" });

    res.json({
      message: "Price updated",
      menu: updatedMenu,
    });
}
exports.getMenuItems = async (req, res) => {
  const items = await MenuItem.find({ restaurant: req.params.restaurantId });
  console.log(items[0])
  res.json(items);
};

exports.deleteMenuItem = async (req, res) => {
  const items = await MenuItem.findByIdAndDelete(req.params.itemId);
  res.json(items);
};

exports.getMenuItem = async (req, res) => {
  console.log(req.params.id)
  const items = await MenuItem.find({ _id: req.params.id });
  console.log(items)
  res.json(items);
};