const PDFDocument = require('pdfkit');
const usuariosModel = require('../models/usuarios.model.js');
const turnosModel = require('../models/turnos.model.js');
const salonesModel = require('../models/salones.model.js');
const serviciosModel = require('../models/servicios.model.js');
const reservasModel = require('../models/reservas.model.js');

//--------------------------------------------------------------------------------------------------------------------------------------//
const c_Browse = async (req, res) => {
  try {
    console.log('c_Browse: obteniendo todas las reservas');

    const reservas = await reservasModel.m_SELECT('*');

    if (reservas.length > 0) {
      res.status(200).json(reservas);
    } else {
      res.status(404).json({ message: 'No se encontraron reservas.' });
    }
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ message: 'Hubo un error al obtener las reservas.' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------------------------------------------//
const c_BrowseJoin = async (req, res) => {
  try {
    console.log('c_BrowseJoin: obteniendo todas las reservas');

    const reservas = await reservasModel.m_SELECT('*');

    if (reservas.length > 0) {
      res.status(200).json(reservas);
    } else {
      res.status(404).json({ message: 'No se encontraron reservas.' });
    }
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ message: 'Hubo un error al obtener las reservas.' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_Read = (req, res) => {
  console.log('Ejecutando método: readOne');
  const { id_reserva } = req.params;
  res.send(`Obteniendo la reserva con ID: ${id_reserva}`);
};

const c_Add = (req, res) => {
  console.log('Ejecutando método: add');
  res.send('Creando una nueva reserva');
};

const c_Edit = (req, res) => {
  console.log('Ejecutando método: edit');
  const { id_reserva } = req.params;
  res.send(`Actualizando la reserva con ID: ${id_reserva}`);
};

const c_Delete = (req, res) => {
  console.log('Ejecutando método: delete');
  const { id_reserva } = req.params;
  res.send(`Eliminando la reserva con ID: ${id_reserva}`);
};

// Genera un reporte en PDF con los datos de una reserva determinada.
const c_GeneratePDF = async (req, res) => {
  console.log('Ejecutando método: c_GeneratePDF');

  const { id_reserva } = req.params;

  try {
    const columnas = `
  reserva_id, fecha_reserva,
  sal.titulo AS salon_nombre,
  t.hora_desde, t.hora_hasta,
  u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
`;

    const joins = [
      { tipo: 'INNER', tabla: 'salones sal', on: 'reservas.salon_id = sal.salon_id' },
      { tipo: 'INNER', tabla: 'turnos t', on: 'reservas.turno_id = t.turno_id' },
      { tipo: 'INNER', tabla: 'usuarios u', on: 'reservas.usuario_id = u.usuario_id' }
    ];

    const filtros = { 'reserva_id': id_reserva };

    const datos = await reservasModel.m_SELECT_JOIN(columnas, joins, filtros);

    if (!datos || datos.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const reserva = datos[0];

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Reserva_${id_reserva}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text(`📋 Reporte de Reserva`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`🆔 ID de Reserva: ${reserva.reserva_id}`);
    doc.text(`📅 Fecha de Reserva: ${reserva.fecha_reserva}`);
    doc.text(`🏢 Salón: ${reserva.salon_nombre}`);
    doc.text(`🕒 Turno: ${reserva.hora_desde} - ${reserva.hora_hasta}`);
    doc.text(`👤 Cliente: ${reserva.cliente_nombre} ${reserva.cliente_apellido}`);

    doc.end();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: 'Hubo un error al generar el PDF' });
  }
};


module.exports = { c_Browse, c_BrowseJoin, c_Read, c_Add, c_Edit, c_Delete, c_GeneratePDF };