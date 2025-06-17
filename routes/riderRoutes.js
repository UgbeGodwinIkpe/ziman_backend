const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const riderAuth = require("../middleware/riderAuth");
const Rider = require("../models/rider");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/register", upload.single("profileImage"), async (req, res) => {
  const { name, email, phone, password, vehicle } = req.body;

  const rider = new Rider({
    name,
    email,
    phone,
    password,
    vehicle,
    profileImage: req.file ? `/uploads/${req.file.filename}` : null,
  });

  await rider.save();
  res.status(201).json({ message: "Registered", rider });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const rider = await Rider.findOne({ email, password });
    if (!rider) return res.status(401).json({ message: "Invalid credentials" });
  
    const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, rider });
});


router.post("/accept/:id", riderAuth, async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      rider: req.user.id,
      status: "picked",
    }, { new: true });
    res.json(order);
});
// router.get('/:id/status', auth, getOrder);
router.post("/:id/status", riderAuth, async (req, res) => {
    const orderStatus=req.body.status;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: orderStatus,
    }, { new: true });
    console.log(order)
    res.json(order);
});
module.exports = router;
