const db = require('../../config/db.config.js');

// Función genérica SELECT
const m_base_SELECT = (tabla, columnas = '*', filtros = {}, orden = '', limite = '') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT ${columnas} FROM ${tabla}`;
    const values = [];
    
    // Agregar filtros WHERE
    if (Object.keys(filtros).length > 0) {
      const condiciones = Object.keys(filtros).map(key => {
        values.push(filtros[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${condiciones.join(' AND ')}`;
    }
    
    // Agregar ORDER BY
    if (orden) {
      query += ` ORDER BY ${orden}`;
    }
    
    // Agregar LIMIT
    if (limite) {
      query += ` LIMIT ${limite}`;
    }
    
    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Función genérica INSERT
const m_base_INSERT = (tabla, datos) => {
  return new Promise((resolve, reject) => {
    const columnas = Object.keys(datos).join(', ');
    const placeholders = Object.keys(datos).map(() => '?').join(', ');
    const values = Object.values(datos);
    
    const query = `INSERT INTO ${tabla} (${columnas}) VALUES (${placeholders})`;
    
    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Función genérica UPDATE
const m_base_UPDATE = (tabla, datos, filtros = {}) => {
  return new Promise((resolve, reject) => {
    const sets = Object.keys(datos).map(key => `${key} = ?`).join(', ');
    const values = Object.values(datos);
    
    let query = `UPDATE ${tabla} SET ${sets}`;
    
    // Agregar filtros WHERE
    if (Object.keys(filtros).length > 0) {
      const condiciones = Object.keys(filtros).map(key => {
        values.push(filtros[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${condiciones.join(' AND ')}`;
    }
    
    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Función genérica DELETE (soft delete)
const m_base_DELETE = (tabla, filtros = {}) => {
  return new Promise((resolve, reject) => {
    const values = [];
    let query = `UPDATE ${tabla} SET activo = 0`;
    
    // Agregar filtros WHERE
    if (Object.keys(filtros).length > 0) {
      const condiciones = Object.keys(filtros).map(key => {
        values.push(filtros[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${condiciones.join(' AND ')}`;
    }
    
    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Función genérica SELECT con JOIN
const m_base_SELECT_JOIN = (tabla, columnas = '*', joins = [], filtros = {}, orden = '', limite = '') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT ${columnas} FROM ${tabla}`;
    const values = [];
    
    // Agregar JOINs
    joins.forEach(join => {
      query += ` ${join.tipo || 'INNER'} JOIN ${join.tabla} ON ${join.condicion}`;
    });
    
    // Agregar filtros WHERE
    if (Object.keys(filtros).length > 0) {
      const condiciones = Object.keys(filtros).map(key => {
        values.push(filtros[key]);
        return `${key} = ?`;
      });
      query += ` WHERE ${condiciones.join(' AND ')}`;
    }
    
    // Agregar ORDER BY
    if (orden) {
      query += ` ORDER BY ${orden}`;
    }
    
    // Agregar LIMIT
    if (limite) {
      query += ` LIMIT ${limite}`;
    }
    
    db.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  m_base_SELECT,
  m_base_INSERT,
  m_base_UPDATE,
  m_base_DELETE,
  m_base_SELECT_JOIN
};
