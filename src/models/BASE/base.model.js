const DBconnection = require('../../config/db.config.js');

// SELECT genérico
const m_base_SELECT = (tabla, columnas = '*', filtros = {}, orden = '', limite = '') => {
  return new Promise((resolve, reject) => {
    let consulta_SQL = `SELECT ${columnas} FROM ${tabla}`;
    let filtroStr = [];
    let valores = [];

    if (filtros && Object.keys(filtros).length > 0) {
      for (let campo in filtros) {
        if (Array.isArray(filtros[campo])) {
          filtroStr.push(`${campo} IN (?)`);
          valores.push(filtros[campo]);
        } else if (typeof filtros[campo] === 'string' && filtros[campo].includes('%')) {
          filtroStr.push(`${campo} LIKE ?`);
          valores.push(filtros[campo]);
        } else {
          filtroStr.push(`${campo} = ?`);
          valores.push(filtros[campo]);
        }
      }
      consulta_SQL += ` WHERE ${filtroStr.join(' AND ')}`;
    }

    if (orden) {
      consulta_SQL += ` ORDER BY ${orden}`;
    }

    if (limite) {
      consulta_SQL += ` LIMIT ${limite}`;
    }


    console.log(`La consulta SQL = ${consulta_SQL}`)
    DBconnection.query(consulta_SQL, valores, (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};
// Fin SELECT genérico



// INSERT genérico
const m_base_INSERT = (tabla, datos) => {
  return new Promise((resolver, rechazar) => {
    // Validamos que se haya recibido un nombre de tabla y que "datos" sea un objeto válido
    if (!tabla || typeof datos !== 'object' || Array.isArray(datos)) {
      return rechazar(new Error('Parámetros inválidos para m_INSERT'));
    }

    const columnas = Object.keys(datos);
    const valores = Object.values(datos);
    const placeholders = columnas.map(() => '?').join(', '); // → "?, ?, ?"

    const consulta_SQL = `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${placeholders})`;

    console.log(`La consulta SQL = ${consulta_SQL}`)
    DBconnection.query(consulta_SQL, valores, (error, resultado) => {
      if (error) {
        console.error('Error en m_INSERT:', error);
        rechazar(error);
      } else {
        resolver(resultado);
      }
    });
  });
};
// Fin INSERT genérico

// DELETE genérico
const m_base_DELETE = (tabla, filtros = {}) => {
  return new Promise((resolve, reject) => {

    let consulta_SQL = `DELETE FROM ${tabla}`;
    let filtroStr = [];
    let valores = [];

    if (filtros && Object.keys(filtros).length > 0) {
      for (let campo in filtros) {
        if (Array.isArray(filtros[campo])) {
          filtroStr.push(`${campo} IN (?)`);
          valores.push(filtros[campo]);
        } else if (typeof filtros[campo] === 'string' && filtros[campo].includes('%')) {
          filtroStr.push(`${campo} LIKE ?`);
          valores.push(filtros[campo]);
        } else {
          filtroStr.push(`${campo} = ?`);
          valores.push(filtros[campo]);
        }
      }
      consulta_SQL += ` WHERE ${filtroStr.join(' AND ')}`;
    }

    console.log(`La consulta SQL = ${consulta_SQL}`)
    DBconnection.query(consulta_SQL, valores, (err, results) => {
      if (err) {
        console.error('Error en la consulta DELETE:', err);
        return reject(err);
      }
      if (results.affectedRows === 0) {
        resolve(null);
      } else {
        resolve(results);
      }
    });
  });
};
// Fin DELETE genérico


// UPDATE genérico
const m_base_UPDATE = (tabla, datos, filtros = {}) => {
  return new Promise((resolve, reject) => {

    if (typeof datos !== 'object' || Array.isArray(datos) || Object.keys(datos).length === 0) {
      return reject(new Error('Se deben proporcionar datos válidos para actualizar'));
    }

    const setStr = [];
    const valores = Object.values(datos);

    for (let campo in datos) {
      setStr.push(`${campo} = ?`);
    }

    let consulta_SQL = `UPDATE ${tabla} SET ${setStr.join(', ')}`;
    let filtroStr = [];

    if (filtros && Object.keys(filtros).length > 0) {
      for (let campo in filtros) {
        if (Array.isArray(filtros[campo])) {
          filtroStr.push(`${campo} IN (?)`);
          valores.push(filtros[campo]);
        } else if (typeof filtros[campo] === 'string' && filtros[campo].includes('%')) {
          filtroStr.push(`${campo} LIKE ?`);
          valores.push(filtros[campo]);
        } else {
          filtroStr.push(`${campo} = ?`);
          valores.push(filtros[campo]);
        }
      }
      consulta_SQL += ` WHERE ${filtroStr.join(' AND ')}`;
    }

    console.log(`La consulta SQL = ${consulta_SQL}`);

    DBconnection.query(consulta_SQL, valores, (err, results) => {
      if (err) {
        console.error('Error en la consulta UPDATE:', err);
        return reject(err);
      }
      if (results.affectedRows === 0) {
        resolve(null);
      } else {
        resolve(results);
      }
    });
  });
};
// Fin UPDATE genérico


// SELECT con relaciones a otras tablas (genérico)
const m_base_SELECT_JOIN = (tabla, columnas = '*', joins = [], filtros = {}, orden = '', limite = '') => {
  return new Promise((resolve, reject) => {
    let consulta_SQL = `SELECT ${columnas} FROM ${tabla}`;
    let valores = [];
    let filtroStr = [];

    if (Array.isArray(joins) && joins.length > 0) {
      joins.forEach(join => {
        if (join.tipo && join.tabla && join.on) {
          consulta_SQL += ` ${join.tipo.toUpperCase()} JOIN ${join.tabla} ON ${join.on}`;
        }
      });
    }

    if (filtros && Object.keys(filtros).length > 0) {
      for (let campo in filtros) {
        if (Array.isArray(filtros[campo])) {
          filtroStr.push(`${campo} IN (?)`);
          valores.push(filtros[campo]);
        } else if (typeof filtros[campo] === 'string' && filtros[campo].includes('%')) {
          filtroStr.push(`${campo} LIKE ?`);
          valores.push(filtros[campo]);
        } else {
          filtroStr.push(`${campo} = ?`);
          valores.push(filtros[campo]);
        }
      }
      consulta_SQL += ` WHERE ${filtroStr.join(' AND ')}`;
    }

    if (orden) {
      consulta_SQL += ` ORDER BY ${orden}`;
    }

    if (limite) {
      consulta_SQL += ` LIMIT ${limite}`;
    }

    console.log(`La consulta SQL JOIN = ${consulta_SQL}`);

    DBconnection.query(consulta_SQL, valores, (err, results) => {
      if (err) {
        console.error('Error en m_SELECT_JOIN:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};
// Fin SELECT con relaciones



module.exports = { m_base_SELECT, m_base_INSERT, m_base_DELETE, m_base_UPDATE, m_base_SELECT_JOIN };