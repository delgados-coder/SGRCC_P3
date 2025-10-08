const salonesModel = require('../models/salones.model.js');
 
const c_Browse = (req, res) => {
  console.log('Ejecutando método: readAll');
  res.send('Obteniendo todos los registros de salones');
};

const c_Read = (req, res) => {
  console.log('Ejecutando método: readOne');
  const { id_salon } = req.params;
  res.send(`Obteniendo el salón con ID: ${id_salon}`);
};

const c_Add = (req, res) => {
  console.log('Ejecutando método: add');
  res.send('Creando un nuevo salón');
};

const c_Edit = (req, res) => {
  console.log('Ejecutando método: edit');
  const { id_salon } = req.params;
  res.send(`Actualizando el salón con ID: ${id_salon}`);
};

const c_Delete = (req, res) => {
  console.log('Ejecutando método: delete');
  const { id_salon } = req.params;
  res.send(`Eliminando el salón con ID: ${id_salon}`);
};

module.exports = { c_Browse, c_Read, c_Add, c_Edit, c_Delete };