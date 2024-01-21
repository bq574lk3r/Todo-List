const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'todo API',
      version: '1.0.0',
      description: 'API documenation'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization'
        }
      }
    }
  },
  apis: ['./src/routes/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;