require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email: 'admin@ziman.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('AdminPass123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@ziman.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created ✅');
    } else {
      console.log('Admin already exists ⚠️');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
