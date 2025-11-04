/**
 * Controlador de estadísticas de reservas.
 * Usa el modelo para invocar los procedimientos SQL y responder en JSON.
 */

const estadisticasModel = require('../models/estadisticas.model.js');

// Media del importe en reservas activas
const c_obtenerMediaImporteTotal = async (req, res) => {
  try {
    const data = await estadisticasModel.obtenerMediaImporteTotal();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en c_obtenerMediaImporteTotal:', error);
    res.status(500).json({ message: 'Error al calcular la media del importe total' });
  }
};

// Mediana del importe en reservas activas
const c_obtenerMedianaImporteTotal = async (req, res) => {
  try {
    const data = await estadisticasModel.obtenerMedianaImporteTotal();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en c_obtenerMedianaImporteTotal:', error);
    res.status(500).json({ message: 'Error al calcular la mediana del importe total' });
  }
};

// Moda del importe en reservas activas
const c_obtenerModaImporteTotal = async (req, res) => {
  try {
    const data = await estadisticasModel.obtenerModaImporteTotal();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en c_obtenerModaImporteTotal:', error);
    res.status(500).json({ message: 'Error al calcular la moda del importe total' });
  }
};

// Estadísticas por salón: media, mediana, moda y salón líder
const c_obtenerEstadisticasReservasSalon = async (req, res) => {
  try {
    const data = await estadisticasModel.obtenerEstadisticasReservasSalon();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en c_obtenerEstadisticasReservasSalon:', error);
    res.status(500).json({ message: 'Error al calcular las estadísticas de reservas por salón' });
  }
};

module.exports = {
  c_obtenerMediaImporteTotal,
  c_obtenerMedianaImporteTotal,
  c_obtenerModaImporteTotal,
  c_obtenerEstadisticasReservasSalon
};