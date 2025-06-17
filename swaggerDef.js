// swaggerDef.js
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Ziman API',
      version: '1.0.0',
      description: 'API documentation for the ziman backend app',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
  
  module.exports = {
    swaggerDefinition,        // ✅ correct key name
    apis: ['./routes/*.js'],  // ✅ where to look for Swagger comments
  };
  