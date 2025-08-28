const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Admin=require('../models/Admin');
const Order=require('../models/Order');
const Notification=require('../models/notification')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BankAccount=require('../models/bankAccount');



exports.createUser=async (req, res)=>{
  //
  try {
      console.log(req.body)
      const { username, email, password, role } = req.body;
      const existing = await Admin.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      const hashed = await bcrypt.hash(password, 10);
      const user = new Admin({ username, email, password: hashed, role });
      await user.save();
      console.log(user)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({user:user,token:token, message: 'User successfully added.' });
      
     } catch (error) {
      console.log(error)
      
     }
}
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  // console.log(password)
  // let isMatch=await bcrypt.compare(password, user.password)
  console.log(user)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.getAllMerchants = async (req, res) => {
  const users = await Restaurant.find().select('-password');
  res.json(users);
};
exports.getTotalPayments = async (req, res) => {
  const users = await Order.find({paid:true});
  res.json(users);
};


exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByIdAndDelete(id);
  if (!restaurant) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Restaurant deleted' });
};

exports.promoteUser = async (req, res) => {
  const { id } = req.params;
  const user = await Admin.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = 'admin';
  await user.save();
  res.json({ message: 'User promoted to admin', user });
};

// fetch all paid orders with users
exports.getOrdersAndCustomers = async (req, res) => {
  try {
    console.log("I can reach here")
    const orders = await Order.find({paid:true}).populate('customer').sort({ createdAt: -1 });
    console.log(orders)
    res.status(200).json(orders);
    
  } catch (error) {
    console.log(error)
  }
};

exports.getAllOrdersAndCustomers = async (req, res) => {
  try {
    // console.log("I can reach here")
    const orders = await Order.find({}).populate('customer').populate('restaurant').sort({ createdAt: -1 });
    console.log("All: ",orders)
    res.status(200).json(orders);
    
  } catch (error) {
    console.log(error)
  }
};

// get users' oreders
exports.getUserOrders = async (req, res) => {
  // console.log(req.user)
  const orders = await Order.find({ customer: req.params.userId }).populate('restaurant').sort({ createdAt: -1 });
  res.json(orders);
};

// create notification
exports.createNotification=async (req, res)=>{
  //
  try {
      console.log(req.body)
      const { title, message, to } = req.body;
      const notification = new Notification({ title, users:to, message });
      await notification.save();
      console.log(notification)
      res.status(201).json({notification, message: 'Notification created.' });
      
     } catch (error) {
      console.log(error)
      
     }
}

// fetch notifications
exports.fetchNotifications=async(req, res)=>{
   try {
    const notifications=await Notification.find({})
    if(!notifications) return res.status(301).json({ notifications:[]});
    res.status(203).json({notifications});
    
   } catch (error) {
    console.log(error)
    res.status(501).json({error:"Something went wrong!"})
    
   }


};

// get sales payments 
exports.getMerchantSalesPayout=async (req, res) => {
  try {
    // console.log(req.user)
  const orders = await Order.find({ paid: true })
    .sort({ createdAt: -1 })
    .populate('restaurant')
    .exec();
  
  const bankAccounts = await BankAccount.find({ restaurant: { $in: orders.map(order => order.restaurant._id) } });
  
  orders.forEach(order => {
    order.restaurant.bankAccount = bankAccounts.find(account => account.restaurant.toString() === order.restaurant._id.toString()) || "Acct Details";
  });
  res.status(200).json(orders);
  
  // const orders1 = await Order.find({paid:true }).sort({ createdAt: -1 })
  //   .populate('restaurant', 'name') // Only get the username field
  //   .exec();
  } catch (error) {
     console.log(error)
    res.status(501).json({message:"Something went wrong..."});
    
  }
};
