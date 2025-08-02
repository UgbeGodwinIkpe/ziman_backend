const Order = require('../models/Order');
const Restaurant=require('../models/Restaurant')
// const { io, onlineUsers } = require('./sockect');
const { io, onlineUsers } = require('../server');


exports.createOrder = async (req, res) => {
  console.log(req.body)
  const {deliveryAddress, packageSize, refId, restaurantId, total, items } = req.body;
  const orderItems = items.map(item => ({
    menuItem: item.menuItemId,
    quantity: item.quantity
  }));
  const restaurant = await Restaurant.findById(restaurantId);
  const price = { small: 1000, medium: 2000, large: 3000 }[packageSize]; // example logic
  // console.log("D: ",restaurant)
  const order = new Order({
    customer: req.user.id,
    restaurant:restaurantId,
    refId:refId,
    pickupAddress:restaurant.address,
    dropoffAddress:deliveryAddress,
    packageSize,
    totalPrice:total,
    items:orderItems
  });
  await order.save();
  console.log(order)
  res.status(201).json(order);
};

// fetch oorder by id
exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer').populate('items.menuItem');
  console.log(order)
  res.json(order);
};
// fetch all orders
exports.getOrders = async (req, res) => {
  try {
    console.log("I can reach here")
    const orders = await Order.find({paid:true}).populate('customer').populate('restaurant').populate('items.menuItem').sort({ createdAt: -1 });
    console.log(orders)
    res.status(200).json(orders);
    
  } catch (error) {
    console.log(error)
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    console.log("I can reach here", req.params.orderId)
    const orderItems = await Order.find({_id:req.params.orderId}).populate('items.menuItem');
    console.log(orderItems[0].items[0].menuItem.items)
    res.status(200).json(orderItems);
    
  } catch (error) {
    console.log(error)
  }
};

// get orders by customer id
exports.getUserOrders = async (req, res) => {
  // console.log(req.user)
  const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
  console.log({User_orders:orders})
  res.json(orders);
};

// get orders by merchant id
exports.getMerchantOrders = async (req, res) => {
  // console.log(req.user)
  const orders = await Order.find({ restaurant: req.params.id }).sort({ createdAt: -1 })
    .populate('customer', 'username') // Only get the username field
    .exec();
  res.json(orders);
};

// update order status and notify user
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  const order = await Order.findById(orderId).populate('customer');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await order.save();
  console.log(order.customer._id)
  // Notify the customer via Socket.IO
  // const customerSocketId = onlineUsers[order.customer._id.toString()];
  // if (customerSocketId) {
  //   io.to(customerSocketId).emit('order-status-update', {
  //     orderId: order._id,
  //     status,
  //   });
  // }

  res.json({ message: 'Order updated', order });
};

// package resquest
exports.pickupPackage = async (req, res) => {
  // console.log(req.user)
  const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
  console.log({User_orders:orders})
  res.json(orders);
};

