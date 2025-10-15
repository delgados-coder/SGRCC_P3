const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

process.loadEnvFile();

const PORT = process.env.PORT || 3000;

const app = express();
// Habilita CORS para todas las rutas
app.use(cors());
// Permite procesar cuerpos JSON y cabeceras en las peticiones
app.use(express.json());
// Muestra un log conciso de las peticiones entrantes en consola durante el desarrollo
app.use(morgan('dev'));

// Middlewares globales

const errorMiddleware = require('./middlewares/error.middleware.js');
const notFoundMiddleware = require('./middlewares/notFound.middleware.js');

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// --------------------------
//  Rutas de la aplicación
// --------------------------

// Autenticación y registro
app.use('/auth', require('./routes/auth.routes.js'));

// Rutas de negocio
app.use('/api/usuarios', require('./routes/usuarios.routes.js'));
app.use('/api/salones', require('./routes/salones.routes.js'));
app.use('/api/servicios', require('./routes/servicios.routes.js'));
app.use('/api/turnos', require('./routes/turnos.routes.js'));
app.use('/api/reservas', require('./routes/reservas.routes.js'));

// Ruta no encontrada (404)
app.use(notFoundMiddleware.error_notFound);

// Manejo global de errores
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
