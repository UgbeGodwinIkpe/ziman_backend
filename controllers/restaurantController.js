const Restaurant = require('../models/Restaurant');
const bankAccount=require('../models/bankAccount');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// create restaurant controller
exports.setupBankAccount = async (req, res) => {
    try {
        const { bank_name, account_name, account_number} = req.body;
        const restaurantId=req.params.buzId
        
        const existing= await bankAccount.findOne({restaurant:restaurantId})
        
        if (existing){
          console.log(existing)
          return res.status(400).json({ message: 'Contact support on support@ziman.com to reset your bank details.' });
        } 
        const restaurant = await bankAccount.create({
        bank_name, account_name, account_number, restaurant:restaurantId
        });
        console.log({"Res":restaurant})
        res.status(201).json({paymentData:restaurant, message: 'Bank account details has been saved!' });
    } catch (error) {
        console.log(error)
        // res.status(501).json({error:"Something went wrong!"})
        
    }
};

// update business location
exports.setBuzLocation = async (req, res) => {
  try {
      const { buz_location} = req.body;
      const restaurantId=req.params.id
      if(!buz_location) return res.status(403).json({ message: 'Business location/address is require for changes!' });
      const existing= await Restaurant.findByIdAndUpdate(restaurantId, {address:buz_location}, {new:true})
      
      if (!existing){
        console.log(existing)
        return res.status(404).json({ message: 'Business Not found!' });
      } 
      console.log({"Res":existing})
      res.status(202).json({restaurant:existing, message: 'Business location address has been saved!' });
  } catch (error) {
      console.log(error)
      // res.status(501).json({error:"Something went wrong!"})
      
  }
};

exports.createRestaurant = async (req, res) => {
  try {
      const { name, address, category, email, password, phone} = req.body;
      const images = req.files.map(file => file.path);
      console.log({images:images})
      
      const existing= await Restaurant.findOne({email:email})
      
      if (existing){
        console.log(existing)
        return res.status(400).json({ message: 'Email already in use' });
      } 
        
      const hashed = await bcrypt.hash(password, 10);
      
      const restaurant = await Restaurant.create({
      name,
      address,
      email,
      password:hashed,
      phone,
      category,
      images,
      });
      console.log({"Res":restaurant})
      const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({merchant:restaurant,token:token, message: 'Registration successfulled!' });
  } catch (error) {
      console.log(error)
      // res.status(501).json({error:"Something went wrong!"})
      
  }
};

  
//login registaurant
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  if(!email || !password){
    return res.status(401).json({ error: 'Both email and password are required!' });
  }
  const restaurant = await Restaurant.findOne({ email });
  // console.log(password)
  // let isMatch=await bcrypt.compare(password, user.password)
  console.log(restaurant)
  if (!restaurant || !(await bcrypt.compare(password, restaurant.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: restaurant._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, restaurant });
};

// change restaurant password
exports.changePassword=async(req, res)=>{
  try {
    const {old_pass, new_pass, con_pass}=req.body
    const id=req.params.id
    if(!old_pass || !new_pass || !con_pass){
      return res.status(401).json({ error: 'All password fields are required!' });
    }
    const restaurant = await Restaurant.findOne({_id:id });
    console.log(restaurant)
    if (!restaurant || !(await bcrypt.compare(old_pass, restaurant.password))) {
      return res.status(401).json({ error: 'Incoreect password entered!' });
    }
    const hashed = await bcrypt.hash(new_pass, 10);
    restaurant.password=hashed
    await restaurant.save()
    const token = await jwt.sign({ userId: restaurant._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, restaurant, message:"Password successfully changed!" });
    
  } catch (error) {
    console.log(error)
    
  }
}
// search restaurant controller
exports.searchRestaurants = async (req, res) => {
    try{
      console.log(req.query)
      function capitalizeFirstLetter(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
        const { name, category, minPrice, maxPrice } = req.query;
    
        const query = {category:capitalizeFirstLetter(req.query.q.trim())};
    
        if (name) {
        query.name = { $regex: name, $options: 'i' };
        }
    
        if (category) {
        query.category = category;
        }
    
        if (minPrice || maxPrice) {
        query['menu.price'] = {};
        if (minPrice) query['menu.price'].$gte = Number(minPrice);
        if (maxPrice) query['menu.price'].$lte = Number(maxPrice);
        }
    
        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    }catch(error){
        console.log(error)
    }
};

//fetch restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      console.log(restaurants)
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
};

//get restaurant by id
exports.getRestaurantById = async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) return res.status(404).json({ message: 'Not found' });
      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
};


//filter by category
exports.getRestaurantsByCategory = async (req, res) => {
    try {
      const { category } = req.query;
      const query = category ? { category } : {};
      const restaurants = await Restaurant.find(query);
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
};

//Pagination Support
exports.getPaginatedRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find().skip(skip).limit(limit);
    const total = await Restaurant.countDocuments();

    res.json({ total, page, limit, data: restaurants });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
  
  
  