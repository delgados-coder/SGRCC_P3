/**
 * Modelo de estadísticas: invoca stored procedures y retorna sus resultados.
 */

const DBconnection = require('../config/db.config.js');

// Media del importe total
const obtenerMediaImporteTotal = () => {
  return new Promise((resolve, reject) => {
    DBconnection.query('CALL sp_media_importe_total()', (err, results) => {
      if (err) {
        console.error('Error al ejecutar sp_media_importe_total:', err);
        return reject(err);
      }
      const fila = results[0][0];
      resolve(fila);
    });
  });
};

// Mediana del importe total
const obtenerMedianaImporteTotal = () => {
  return new Promise((resolve, reject) => {
    DBconnection.query('CALL sp_mediana_importe_total()', (err, results) => {
      if (err) {
        console.error('Error al ejecutar sp_mediana_importe_total:', err);
        return reject(err);
      }
      const fila = results[0][0];
      resolve(fila);
    });
  });
};

// Moda del importe total
const obtenerModaImporteTotal = () => {
  return new Promise((resolve, reject) => {
    DBconnection.query('CALL sp_moda_importe_total()', (err, results) => {
      if (err) {
        console.error('Error al ejecutar sp_moda_importe_total:', err);
        return reject(err);
      }
      const fila = results[0][0];
      resolve(fila);
    });
  });
};

// Estadísticas por salón (media, mediana, moda y salón destacado)
const obtenerEstadisticasReservasSalon = () => {
  return new Promise((resolve, reject) => {
    DBconnection.query('CALL sp_estadisticas_reservas_salon()', (err, results) => {
      if (err) {
        console.error('Error al ejecutar sp_estadisticas_reservas_salon:', err);
        return reject(err);
      }
      const fila = results[0][0];
      resolve(fila);
    });
  });
};

module.exports = {
  obtenerMediaImporteTotal,
  obtenerMedianaImporteTotal,
  obtenerModaImporteTotal,
  obtenerEstadisticasReservasSalon
};