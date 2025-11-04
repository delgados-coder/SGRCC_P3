const swaggerJSDoc = require('swagger-jsdoc');  // Genera el JSON de especificaciones OpenAPI a partir del código
const swaggerUi = require('swagger-ui-express');  // Permite mostrar la interfaz visual de Swagger en el navegador

// ------ Configuración principal de Swagger ------

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Versión Open API
    info: {
      title: 'SGRCC API',
      version: '1.0.0',  // Versión de la API (actualizar si se hacen cambios grandes)
      description: 'API para Sistema de gestión de reservas de salones de cumpleaños',
    },
  },

  // Ruta relativa que le indicará a Swagger qué archivos deberá buscar y dónde
  // Cada endpoint se documenta directamente en las rutas
  apis: ['./src/routes/*.js'],  
};

// ------ Generación de la especificación (swaggerSpec) ------

// Genera la especificación OpenAPI en formato JSON 

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// ------ Función de configuración para integrar Swagger en Express ------

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log('Swagger UI disponible en http://localhost:3003/api-docs');
}

module.exports = setupSwagger;