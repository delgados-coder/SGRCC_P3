const serviciosModel = require('../models/servicios.model.js');

const c_Browse = (req, res) => {
  console.log('Ejecutando método: readAll');
  res.send('Obteniendo todos los registros de servicios');
};

const c_Read = (req, res) => {
  console.log('Ejecutando método: readOne');
  const { id_servicio } = req.params;
  res.send(`Obteniendo el servicio con ID: ${id_servicio}`);
};

const c_Add = (req, res) => {
  console.log('Ejecutando método: add');
  res.send('Creando un nuevo servicio');
};

const c_Edit = (req, res) => {
  console.log('Ejecutando método: edit');
  const { id_servicio } = req.params;
  res.send(`Actualizando el servicio con ID: ${id_servicio}`);
};

const c_Delete = (req, res) => {
  console.log('Ejecutando método: delete');
  const { id_servicio } = req.params;
  res.send(`Eliminando el servicio con ID: ${id_servicio}`);
};

module.exports = { c_Browse, c_Read, c_Add, c_Edit, c_Delete };