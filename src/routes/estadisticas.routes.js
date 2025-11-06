/**Rutas de estadísticas: expone métricas calculadas por procedimientos SQL.*/

const express = require('express');
const router = express.Router();

const estadisticasController = require('../controllers/estadisticas.controller.js');

router.get('/importe-total/media', estadisticasController.c_obtenerMediaImporteTotal);

router.get('/importe-total/mediana', estadisticasController.c_obtenerMedianaImporteTotal);

router.get('/importe-total/moda', estadisticasController.c_obtenerModaImporteTotal);

router.get('/reservas-salon', estadisticasController.c_obtenerEstadisticasReservasSalon);

module.exports = router;