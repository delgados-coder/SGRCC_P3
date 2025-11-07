const turnosModel = require('../models/turnos.model.js');

//--------------------------------------------------------------------------------------------------------------------------------------//
const c_Browse = async (req, res) => {
  try {
    console.log('Ejecutando método: c_BROWSE (todos los registros de turnos)');

    const filtros = {};
    if (req.query.activo !== undefined) {
      filtros.activo = req.query.activo == '1' ? 1 : 0;
    }

    const turnos = await turnosModel.m_SELECT('*', filtros, 'orden ASC');

    if (turnos.length > 0) {
      res.status(200).json(turnos);
    } else {
      res.status(404).json({ message: 'No se encontraron turnos.' });
    }
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ message: 'Hubo un error al obtener los turnos.' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//

const c_Read = async (req, res) => {
  console.log('Ejecutando método: c_READ (Un turno por ID)');
  const { turno_id } = req.params;

  try {
    const turno = await turnosModel.m_SELECT('*', { turno_id });

    if (turno && turno.length > 0) {
      res.status(200).json(turno[0]);
    } else {
      res.status(404).json({ message: 'Turno no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener turno:', error);
    res.status(500).json({ message: 'Hubo un error al obtener el turno' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//

const c_Add = async (req, res) => {
  console.log('Ejecutando método: ADD (AÑADIR UN NUEVO TURNO)');
  const { orden, hora_desde, hora_hasta, activo } = req.body;

  if (orden === undefined || !hora_desde || !hora_hasta) {
    return res.status(400).json({
      message: 'Faltan datos obligatorios (orden, hora_desde, hora_hasta)',
    });
  }

  const nuevoTurno = {
    orden,
    hora_desde,
    hora_hasta,
    activo: activo == 0 ? 0 : 1, 
  };

  try {
    const result = await turnosModel.m_INSERT(nuevoTurno);
    res.status(201).json({
      message: 'Turno creado con éxito',
      turnoId: result.insertId,
    });
  } catch (error) {
    console.error('Error al insertar turno:', error);
    res.status(500).json({ message: 'Hubo un error al crear el turno' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//

const c_Edit = async (req, res) => {
  console.log('Ejecutando método: c_EDIT (Actualizar turno)');
  const { turno_id } = req.params;
  const turnoData = req.body;

  if (turnoData.orden === undefined || !turnoData.hora_desde || !turnoData.hora_hasta) {
    return res.status(400).json({
      message: 'Faltan datos obligatorios (orden, hora_desde, hora_hasta)',
    });
  }

  if (turnoData.activo !== undefined) {
    turnoData.activo = turnoData.activo == 1 ? 1 : 0;
  }

  try {
    const resultado = await turnosModel.m_UPDATE(turnoData, { turno_id });

    if (resultado && resultado.affectedRows > 0) {
      res.status(200).json({ message: `Turno con ID ${turno_id} actualizado con éxito` });
    } else {
      res.status(404).json({ message: `Turno con ID ${turno_id} no encontrado o sin cambios` });
    }
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar el turno' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//

const c_Delete = async (req, res) => {
  console.log('Ejecutando método: c_DELETE (Eliminar turno)');
  const { turno_id } = req.params;

  try {
    const result = await turnosModel.m_DELETE({ turno_id });

    if (result && result.affectedRows > 0) {
      res.status(200).json({ message: `Turno con ID ${turno_id} eliminado con éxito` });
    } else {
      res.status(404).json({ message: `Turno con ID ${turno_id} no encontrado` });
    }
  } catch (error) {
    console.error('Error al eliminar turno:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar el turno' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//

const c_SoftDelete = async (req, res) => {
  console.log('Ejecutando método: SOFTDELETE (Activar/Desactivar turno)');
  const { turno_id, activo } = req.params;

  if (activo !== '1' && activo !== '0') {
    return res.status(400).json({ message: 'El valor de "activo" debe ser 1 o 0.' });
  }

  const nuevoEstado = parseInt(activo, 10);

  try {
    const turno = await turnosModel.m_SELECT('*', { turno_id });

    if (!turno || turno.length === 0) {
      return res.status(404).json({ message: `Turno con ID ${turno_id} no encontrado` });
    }

    const resultado = await turnosModel.m_UPDATE({ activo: nuevoEstado }, { turno_id });

    if (resultado && resultado.affectedRows > 0) {
      res.status(200).json({
        message: `Turno con ID ${turno_id} ${nuevoEstado === 0 ? 'desactivado' : 'activado'} correctamente`,
        turno: { ...turno[0], activo: nuevoEstado },
      });
    } else {
      res.status(500).json({ message: 'Hubo un error al intentar cambiar el estado del turno' });
    }
  } catch (error) {
    console.error('Error al ejecutar soft delete de turno:', error);
    res.status(500).json({ message: 'Hubo un error al intentar ejecutar el soft delete del turno' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//

module.exports = { c_Browse, c_Read, c_Add, c_Edit, c_Delete, c_SoftDelete };


