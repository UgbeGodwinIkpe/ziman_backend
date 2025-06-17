const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
   try {
    console.log(req.body)
    const { username, email, password, fullName, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, fullName, email, password: hashed, role, refid: crypto.randomUUID() });
    await user.save();
    console.log(user)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({user:user,token:token, message: 'User registered' });
    
   } catch (error) {
    console.log(error)
    
   }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(password)
  // let isMatch=await bcrypt.compare(password, user.password)
  console.log(user)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user });
};

exports.assignAgent = async (req, res) => {
  const { orderId, agentId } = req.body;

  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'delivery') return res.status(400).json({ message: 'Invalid agent' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.deliveryAgent = agentId;
  order.status = 'out-for-delivery';
  await order.save();

  res.json({ message: 'Agent assigned', order });
};


// edit profile controller
exports.editProfile=async (req, res) => {
  try {
    const userId = req.user;
    console.log("ID",userId)
    const {fullName, address, phoneNumber}=req.body
    console.log(req.body)
    // const updates = {fullName, address, phoneNumber};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.fullName = fullName;
    user.address=address;
    user.phoneNumber=phoneNumber;
    await user.save();

    console.log(user)
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Change password controller
exports.changePassword=async (req, res) => {
  try {
    const user = req.user;
    const {oldPassword, newPassword}=req.body
    console.log(req.body, user._id)
    // const updates = {fullName, address, phoneNumber};
    if(!oldPassword || !newPassword){

      return res.status(401).json({ error: 'Bad Request!' });
    }
    const cUser = await User.findOne({email:user.email});
    console.log(oldPassword, cUser.password)
    let isMatch=await bcrypt.compare(oldPassword, cUser.password);
    console.log(isMatch)
    if (!cUser || !isMatch) {
      console.log("Invalid credentials or password", user.email)
      return res.status(401).json({ error: 'Invalid credentials or password!' });
    }
    // encript the new password 
    const hashed = await bcrypt.hash(newPassword, 10);
    cUser.password = hashed;
    await cUser.save();
    
    // console.log(cUser)
    console.log("Password updated!")
    res.json(cUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// delete account request
exports.deleteMyAccount= async (req, res) => {
  try {
    const userId = req.user._id.toString(); // Assuming authentication middleware sets req.user
    console.log(userId, req.user)
    await User.findByIdAndDelete(userId);
    res.json({statusCode:200, message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting account' });
  }
};

