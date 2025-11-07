const salonesModel = require('../models/salones.model.js');

// ----------------- BROWSE -----------------
const c_Browse = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Browse (obtener todos los salones)');

    const filtros = {};
    if (req.query.activo !== undefined) {
      filtros.activo = req.query.activo == '1' ? 1 : 0;
    }

    const salones = await salonesModel.m_SELECT('*', filtros);

    if (salones.length > 0) {
      res.status(200).json(salones);
    } else {
      res.status(404).json({ message: 'No se encontraron salones.' });
    }
  } catch (error) {
    console.error('Error en c_Browse:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- READ -----------------
const c_Read = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Read (obtener salón por ID)');
    const { id_salon } = req.params;
    const [salon] = await salonesModel.m_SELECT('*', { salon_id: id_salon });

    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }

    res.status(200).json(salon);
  } catch (error) {
    console.error('Error en c_Read:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- ADD -----------------
const c_Add = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Add (crear salón)');
    const { titulo, direccion, capacidad, importe, latitud, longitud } = req.body;

    if (!titulo || !direccion || capacidad === undefined || importe === undefined) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const resultado = await salonesModel.m_INSERT({
      titulo,
      direccion,
      capacidad,
      importe,
      latitud: latitud || null,
      longitud: longitud || null,
      activo: 1, // por defecto activo
    });

    res.status(201).json({ message: 'Salón creado correctamente', salon_id: resultado.insertId });
  } catch (error) {
    console.error('Error en c_Add:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- EDIT -----------------
const c_Edit = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Edit (actualizar salón)');
    const { id_salon } = req.params;
    const { titulo, direccion, capacidad, importe, latitud, longitud } = req.body;

    const datosActualizar = {
      modificado: new Date(),
    };

    if (titulo !== undefined) datosActualizar.titulo = titulo;
    if (direccion !== undefined) datosActualizar.direccion = direccion;
    if (capacidad !== undefined) datosActualizar.capacidad = capacidad;
    if (importe !== undefined) datosActualizar.importe = importe;
    if (latitud !== undefined) datosActualizar.latitud = latitud;
    if (longitud !== undefined) datosActualizar.longitud = longitud;

    const resultado = await salonesModel.m_UPDATE(datosActualizar, { salon_id: id_salon });

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }

    res.status(200).json({ message: 'Salón actualizado correctamente' });
  } catch (error) {
    console.error('Error en c_Edit:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- DELETE (hard delete) -----------------
const c_Delete = async (req, res) => {
  try {
    console.log('Ejecutando método: c_Delete (eliminar salón)');
    const { id_salon } = req.params;

    const resultado = await salonesModel.m_DELETE({ salon_id: id_salon });

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }

    res.status(200).json({ message: 'Salón eliminado correctamente' });
  } catch (error) {
    console.error('Error en c_Delete:', error);

    // Manejo de error de clave foránea
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: 'No se puede eliminar el salón porque tiene reservas asociadas' });
    }

    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ----------------- SOFT DELETE -----------------
const c_SoftDelete = async (req, res) => {
  try {
    console.log('Ejecutando método: c_SoftDelete (activar/desactivar salón)');
    const { id_salon, activo } = req.params;

    if (activo !== '1' && activo !== '0') {
      return res.status(400).json({ message: 'El valor de "activo" debe ser 1 o 0.' });
    }

    const [salon] = await salonesModel.m_SELECT('*', { salon_id: id_salon });
    if (!salon) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }

    const nuevoEstado = parseInt(activo, 10);
    const resultado = await salonesModel.m_UPDATE({ activo: nuevoEstado, modificado: new Date() }, { salon_id: id_salon });

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo cambiar el estado del salón' });
    }

    res.status(200).json({
      message: `Salón ${nuevoEstado === 1 ? 'activado' : 'desactivado'} correctamente`,
      salon: { ...salon, activo: nuevoEstado },
    });
  } catch (error) {
    console.error('Error en c_SoftDelete:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { c_Browse, c_Read, c_Add, c_Edit, c_Delete, c_SoftDelete };
