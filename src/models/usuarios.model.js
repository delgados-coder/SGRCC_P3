const base = require('./BASE/base.model.js');

// Este modelo define las operaciones CRUD específicas para la tabla 'usuarios' usando los métodos genéricos de base.model.js

const TABLA = 'usuarios';

const m_SELECT = (columnas = '*', filtros = {}, orden = '', limite = '') => {
  return base.m_base_SELECT(TABLA, columnas, filtros, orden, limite);
};

const m_INSERT = (datos) => {
  return base.m_base_INSERT(TABLA, datos);
};

const m_UPDATE = (datos, filtros = {}) => {
  return base.m_base_UPDATE(TABLA, datos, filtros);
};

const m_DELETE = (filtros = {}) => {
  return base.m_base_DELETE(TABLA, filtros);
};

const m_SELECT_JOIN = (columnas = '*', joins = [], filtros = {}, orden = '', limite = '') => {
  return base.m_base_SELECT_JOIN(TABLA, columnas, joins, filtros, orden, limite);
};

module.exports = { m_SELECT, m_INSERT, m_UPDATE, m_DELETE, m_SELECT_JOIN };
