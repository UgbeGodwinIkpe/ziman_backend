const express = require("express");
const multer = require("multer");
const Rider = require("../models/rider");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
