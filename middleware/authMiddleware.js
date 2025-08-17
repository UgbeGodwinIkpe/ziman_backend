const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant=require("../models/Restaurant")
const Rider=require("../models/rider")

// module.exports = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Access denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.userId);
//     next();
//   } catch {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };
module.exports = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    req.user = await User.findById(decoded.userId).select('-password');
    if(req.user){
      next()
    }
    else if(req.user==null){
      req.user = await Restaurant.findById(decoded.userId).select('-password');
      next();
    }else{
      req.user = await Rider.findById(decoded.userId).select('-password');
      next();
    }
  } catch (err) {
    res.status(401).json({ message: 'Token invalid', errr:err });
  }
};

// module.exports = protect;
