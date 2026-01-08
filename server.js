require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('./config/db');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'Ziman API', version: '1.0.0' },
      servers: [{ url: 'http://localhost:5000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js']
};
  

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const app = express();




const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Track connected agents
const agents = {};

// Track connected customers (for order status updates)
const onlineUsers = {};


const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes=require('./routes/menuRoutes');
const restaurantRoutes=require('./routes/restaurantRoutes');
const adminRoutes= require('./routes/adminRoutes');
const notificationRoutes=require('./routes/notificationRoutes')
const riderRoutes=require("./routes/riderRoutes")


// app.use(cors());
app.use(cors({
  origin: ['*','http://127.0.0.1:5500','http://localhost:62087', 'http://localhost:57025', 'https://ziman.com.ng', 'http://localhost:55128', 'http://localhost:64823', 'http://localhost:51294', 'http://localhost:52212', 'https://ziman.com.ng', 'https://www.ziman.com.ng'], // Allow this origin
   methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  // credentials: true,
}));
app.use(express.json());
// app.use(bodyParser.json());
// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes)
app.use('/api/notifications', notificationRoutes)
app.use("/api/riders", riderRoutes);


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register-agent', (agentId) => {
    agents[agentId] = socket.id;
  });

  socket.on('register-customer', (customerId) => {
    onlineUsers[customerId] = socket.id;
  });

  socket.on('location-update', ({ agentId, coords }) => {
    socket.broadcast.emit('agent-location', { agentId, coords });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    Object.keys(agents).forEach(id => {
      if (agents[id] === socket.id) delete agents[id];
    });
    Object.keys(onlineUsers).forEach(id => {
      if (onlineUsers[id] === socket.id) delete onlineUsers[id];
    });
  });
});



//set port and start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { io, onlineUsers };

