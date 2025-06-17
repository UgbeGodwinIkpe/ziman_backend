const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');

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
}

const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, './routes/*.js')],
};

console.log(options);

const specs = swaggerJsdoc(options);

fs.writeFileSync('swagger.json', JSON.stringify(specs, null, 2));


// module.exports = swaggerJsdoc(options);
  
  