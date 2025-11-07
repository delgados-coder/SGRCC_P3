const serviciosModel = require('../models/servicios.model.js');

// ----------------- BROWSE -----------------
const c_Browse = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Browse (obtener todos los servicios)');

    const filtros = {};
    if (req.query.activo !== undefined) {
      filtros.activo = req.query.activo == '1' ? 1 : 0;
    }

    const servicios = await serviciosModel.m_SELECT('*', filtros);

    if (servicios.length > 0) {
      res.status(200).json(servicios);
    } else {
      res.status(404).json({ message: 'No se encontraron servicios.' });
    }
  } catch (error) {
    console.error('Error en c_Browse:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- READ -----------------
const c_Read = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Read (obtener servicio por ID)');
    const { servicio_id } = req.params;
    const [servicio] = await serviciosModel.m_SELECT('*', { servicio_id });

    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json(servicio);
  } catch (error) {
    console.error('Error en c_Read:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- ADD -----------------
const c_Add = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Add (crear servicio)');
    const { descripcion, importe } = req.body;

    if (!descripcion || importe === undefined) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const resultado = await serviciosModel.m_INSERT({
      descripcion,
      importe,
      activo: 1, // por defecto activo
    });

    res.status(201).json({ message: 'Servicio creado correctamente', servicio_id: resultado.insertId });
  } catch (error) {
    console.error('Error en c_Add:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- EDIT -----------------
const c_Edit = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Edit (actualizar servicio)');
    const { servicio_id } = req.params;
    const { descripcion, importe } = req.body;

    if (!descripcion || importe === undefined) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const resultado = await serviciosModel.m_UPDATE(
      { descripcion, importe, modificado: new Date() },
      { servicio_id }
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json({ message: 'Servicio actualizado correctamente' });
  } catch (error) {
    console.error('Error en c_Edit:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- DELETE (hard delete) -----------------
const c_Delete = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Delete (eliminar servicio)');
    const { servicio_id } = req.params;

    const resultado = await serviciosModel.m_DELETE({ servicio_id });

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error en c_Delete:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- SOFT DELETE -----------------
const c_SoftDelete = async (req, res) => {
  try {
    console.log('Ejecutando método: c_SoftDelete (activar/desactivar servicio)');
    const { servicio_id, activo } = req.params;

    if (activo !== '1' && activo !== '0') {
      return res.status(400).json({ message: 'El valor de "activo" debe ser 1 o 0.' });
    }

    const [servicio] = await serviciosModel.m_SELECT('*', { servicio_id });
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    const nuevoEstado = parseInt(activo, 10);
    const resultado = await serviciosModel.m_UPDATE({ activo: nuevoEstado, modificado: new Date() }, { servicio_id });

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo cambiar el estado del servicio' });
    }

    res.status(200).json({
      message: `Servicio ${nuevoEstado === 1 ? 'activado' : 'desactivado'} correctamente`,
      servicio: { ...servicio, activo: nuevoEstado },
    });
  } catch (error) {
    console.error('Error en c_SoftDelete:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { c_Browse, c_Read, c_Add, c_Edit, c_Delete, c_SoftDelete };
