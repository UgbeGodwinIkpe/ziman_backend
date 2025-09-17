const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// Generate a 6-digit code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationEmail = async (userEmail, username) => {
  const verificationCode = generateVerificationCode();

  // Setup transporter (using Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ugbegodwin7963@gmail.com",        // your Gmail
      pass: process.env.GOOGLE_AUTH,          // use App Password, not your real password
    },
  });

  const mailOptions = {
    from: "Ziman App ugbegodwin7963@gmail.com",
    to: userEmail,
    subject: "Your Verification Code",
    html: `
      <h2>Email Verification</h2>
      <h4>Hi ${username}, welcome to ziman app.</h4>
      <p>Your verification code is:</p>
      <h1 style="color: blue;">${verificationCode}</h1>
      <p>This code expires in 10 minutes.</p><br>
      <hr>
      <h5>Regards!<br>Godwin Ikpe Ugbe<br>Software Engineer</h5>
      


    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", userEmail);
    return verificationCode;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};
// send frgtten passwrd ink
const sendForgottenPasswordEmail = async (userEmail, userId) => {
  const verificationCode = generateVerificationCode();

  // Setup transporter (using Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ugbegodwin7963@gmail.com",        // your Gmail
      pass: process.env.GOOGLE_AUTH,          // use App Password, not your real password
    },
  });

  const mailOptions = {
    from: "Ziman App",
    to: userEmail,
    subject: "Reset Passwrd",
    html: `
      <h2>Email Verification</h2>
      <h4>Hi there, </h4>
      <h5>You just requested for a password reset. Ignore if it was not you.</h5>
      <p>Kindy click the link below to reset your password</p>
      <a style="text-decoration:none; background:blue; padding:5px; color:white;" href="https://ziman.com.ng/resetpass.html?u=${userId}?c=${verificationCode}">Reset Password</a>
      <hr>
      <b>Or</b> copy the link and paste on your browser:
      <p>https://ziman.com.ng/resetpass.html?u=${userId}?c=${verificationCode}</p><br>
      <hr>
      <h5>Regards!<br>Godwin Ikpe Ugbe<br><i>For Ziman Developers Team</i></h5>
      


    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", userEmail);
    return verificationCode;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

exports.register = async (req, res) => {
   try {
    console.log(req.body)
    const { username, email, password, fullName, role } = req.body;
    // let emailAdd=email.toLowerCase()
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const vcode= await sendVerificationEmail(email, username)
    if(vcode){
      const user = new User({ username, fullName, email, password: hashed, role, verificatin_code:vcode, refid: crypto.randomUUID() });
      await user.save();
      console.log(user)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({user:user,token:token, message: 'User registered' });

    }else{
      return res.status(501).json({message: 'Something went wrong. Try again later!' });
    }
    
   } catch (error) {
    console.log(error)
    
   }
};

// forgotten pasword
exports.forgottenPassword = async (req, res) => {
   try {
     const email = req.body.email.toLowerCase();
     const existing = await User.findOne({ email });
     console.log({existing})

    if (existing){
      // const hashed = await bcrypt.hash(password, 10);
      const vcode= await sendForgottenPasswordEmail(email, existing._id)
      if(vcode){
        return res.status(201).json({message: 'Check your email address for further instructions.' });
      }else{
        return res.status(501).json({message: 'Something went wrong. Try again later!' });
      }
    }else{
      return res.status(404).send('Email does not exist');
    }
    
   } catch (error) {
    console.log(error)
    
   }
};

exports.verifyEmail=async(req, res)=>{
  try {
    const vcode=req.body.verificationCode
    const verified = await User.findOne({verificatin_code: vcode });
    if (verified) return res.status(200).json({ message: 'Email verification successfulled.' });
    return res.status(400).json({message:"Bad request."})
    
  } catch (error) {
    console.log(error)
    
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // let emailAdd=email.toLowerCase()
  const user = await User.findOne({ email });
  // console.log(password)
  // let isMatch=await bcrypt.compare(password, user.password)
  console.log(user)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' });
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

// reset password controller
exports.resetPassword=async (req, res) => {
  try {
    // const userId = req.params;
    const {password, confirmPassword, userId}=req.body
    // console.log("ID",userId)
    if(password.length<6){
      return res.status(409).json({statusCde:409, message: 'Password must be at least 6 chars long!' });
    }else if(password != confirmPassword){
      return res.status(409).json({statusCde:409,  message: 'Passwords don\'t match!' });
    }else{
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({statusCde:404,  message: 'Something went wrong' });
      }
        user.password = hashed;
        let user_email=user.email
        await user.save();

        console.log(user)
        // Setup transporter (using Gmail)
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ugbegodwin7963@gmail.com",        // your Gmail
            pass: process.env.GOOGLE_AUTH,          // use App Password, not your real password
          },
        });
        const mailOptions = {
          from: "Ziman App",
          to: user_email,
          subject: "Ziman App User Password Changed",
          html: `
            <h2>Password Changed</h2>
            <h4>Your new password is: ${password}</h4>
           
            <hr>
            <h5>Regards,<br>Godwin Ikpe Ugbe<br>Software Engineer<br><u>For Ziman Team</u></h5>
            


          `,
        };
        await transporter.sendMail(mailOptions);

        res.status(203).json({statusCde:203, message:"Password reset successfulled. You can now return back to the mobile app and login."});
      }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({statusCde:500, message: 'Internal Server Error' });
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

