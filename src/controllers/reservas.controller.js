/**
* Controlador de reservas
*
* Éste módulo gestiona todas las operaciones relacionadas con las reservas, incluyendo la obtención 
* de datos (simples y con joins), creación, edición, eliminación y generación de reportes PDF detallados
* de una reserva específica.
*/

const PDFDocument = require('pdfkit');
const usuariosModel = require('../models/usuarios.model.js');
const turnosModel = require('../models/turnos.model.js');
const salonesModel = require('../models/salones.model.js');
const serviciosModel = require('../models/servicios.model.js');
const reservasModel = require('../models/reservas.model.js');
const { haySolapeTurnos } = require('../utils/overlapEngine.js');

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

// Detalle combinado por ID (JOIN a salones, turnos y usuarios) para auditoría del corrector.
const c_BrowseJoin = async (req, res) => {
  try {
    console.log('c_BrowseJoin: obteniendo reserva con JOIN por ID');

    const { id_reserva } = req.params;

    const columnas = `
      reservas.reserva_id, reservas.fecha_reserva, reservas.tematica,
      reservas.importe_salon, reservas.importe_total, reservas.salon_id, reservas.turno_id, reservas.usuario_id,
      sal.titulo AS salon_nombre, sal.capacidad, sal.direccion,
      t.hora_desde, t.hora_hasta, t.orden,
      u.nombre AS cliente_nombre, u.apellido AS cliente_apellido, u.nombre_usuario
    `;
    const joins = [
      { tipo: 'INNER', tabla: 'salones sal', on: 'reservas.salon_id = sal.salon_id' },
      { tipo: 'INNER', tabla: 'turnos t', on: 'reservas.turno_id = t.turno_id' },
      { tipo: 'INNER', tabla: 'usuarios u', on: 'reservas.usuario_id = u.usuario_id' }
    ];

    const filtros = { 'reservas.reserva_id': id_reserva };
    const datos = await reservasModel.m_SELECT_JOIN(columnas, joins, filtros, '', '1');

    if (!datos || datos.length === 0) {
      return res.status(404).json({ message: 'No se encontró la reserva solicitada.' });
    }

    res.status(200).json(datos[0]);
  } catch (error) {
    console.error('Error al obtener reserva (JOIN):', error);
    res.status(500).json({ message: 'Hubo un error al obtener la reserva.' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_Read = async (req, res) => {
  console.log('Ejecutando método: readOne');
  const { id_reserva } = req.params;

  try {
    const reserva = await reservasModel.m_SELECT('*', { 'reserva_id': id_reserva });
    if (reserva && reserva.length > 0) {
      res.status(200).json(reserva[0]);
    } else {
      res.status(404).json({ message: 'Reserva no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ message: 'Hubo un error al obtener la reserva' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------//
// Alta con validación de solapamientos por salón + fecha + (hora_desde/hora_hasta del turno)
const c_Add = async (req, res) => {
  console.log('Ejecutando método: add');

  try {
    const {
      usuario_id,
      salon_id,
      turno_id,
      fecha_reserva,
      tematica = null,
      foto_cumpleaniero = null,
      importe_salon = null,
      importe_total = null
    } = req.body;

    // Validación mínima de integridad (el detalle fino se documenta en las rutas con express-validator)
    if (!usuario_id || !salon_id || !turno_id || !fecha_reserva) {
      return res.status(400).json({ message: 'Faltan datos obligatorios (usuario_id, salon_id, turno_id, fecha_reserva).' });
    }

    // Turno elegido
    const turnoSel = await turnosModel.m_SELECT('*', { 'turno_id': turno_id });
    if (!turnoSel || turnoSel.length === 0) {
      return res.status(400).json({ message: 'Turno inexistente.' });
    }
    const turnoNuevo = {
      hora_desde: turnoSel[0].hora_desde,
      hora_hasta: turnoSel[0].hora_hasta
    };

    // Turnos ya reservados ese día en ese salón (JOIN para obtener horas)
    const columnasSolape = `
      reservas.reserva_id,
      t.hora_desde,
      t.hora_hasta
    `;
    const joinsSolape = [
      { tipo: 'INNER', tabla: 'turnos t', on: 'reservas.turno_id = t.turno_id' }
    ];
    const filtrosSolape = {
      'reservas.salon_id': salon_id,
      'reservas.fecha_reserva': fecha_reserva,
      'reservas.activo': 1
    };
    const existentes = await reservasModel.m_SELECT_JOIN(columnasSolape, joinsSolape, filtrosSolape, '', '');

    const turnosExistentes = (existentes || []).map(r => ({
      hora_desde: r.hora_desde,
      hora_hasta: r.hora_hasta,
      reserva_id: r.reserva_id
    }));

    if (haySolapeTurnos(turnosExistentes, turnoNuevo)) {
      return res.status(400).json({
        message: 'Conflicto de horario: el turno seleccionado se solapa con otra reserva existente en el mismo salón y fecha.'
      });
    }

    // Inserción
    const nueva = {
      usuario_id,
      salon_id,
      turno_id,
      fecha_reserva,
      tematica,
      foto_cumpleaniero,
      importe_salon,
      importe_total,
      activo: 1
    };

    const result = await reservasModel.m_INSERT(nueva);
    res.status(201).json({ message: 'Reserva creada con éxito', reservaId: result.insertId });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Hubo un error al crear la reserva' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------//
// Edición con revalidación de solapamientos si cambian salón, fecha o turno
const c_Edit = async (req, res) => {
  console.log('Ejecutando método: edit');

  const { id_reserva } = req.params;
  const cambios = req.body;

  try {
    const actual = await reservasModel.m_SELECT('*', { 'reserva_id': id_reserva });
    if (!actual || actual.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const baseReserva = actual[0];

    const salon_id = cambios.salon_id ?? baseReserva.salon_id;
    const fecha_reserva = cambios.fecha_reserva ?? baseReserva.fecha_reserva;
    const turno_id = cambios.turno_id ?? baseReserva.turno_id;

    // Si alguno de los tres pivotes cambia (o aunque no cambie), revalidar solape.
    const turnoSel = await turnosModel.m_SELECT('*', { 'turno_id': turno_id });
    if (!turnoSel || turnoSel.length === 0) {
      return res.status(400).json({ message: 'Turno inexistente.' });
    }
    const turnoNuevo = {
      hora_desde: turnoSel[0].hora_desde,
      hora_hasta: turnoSel[0].hora_hasta
    };

    const columnasSolape = `
      reservas.reserva_id,
      t.hora_desde,
      t.hora_hasta
    `;
    const joinsSolape = [
      { tipo: 'INNER', tabla: 'turnos t', on: 'reservas.turno_id = t.turno_id' }
    ];
    const filtrosSolape = {
      'reservas.salon_id': salon_id,
      'reservas.fecha_reserva': fecha_reserva,
      'reservas.activo': 1
    };
    const existentes = await reservasModel.m_SELECT_JOIN(columnasSolape, joinsSolape, filtrosSolape, '', '');

    const turnosExistentes = (existentes || [])
      .filter(r => r.reserva_id !== Number(id_reserva)) // excluir la misma reserva
      .map(r => ({
        hora_desde: r.hora_desde,
        hora_hasta: r.hora_hasta,
        reserva_id: r.reserva_id
      }));

    if (haySolapeTurnos(turnosExistentes, turnoNuevo)) {
      return res.status(400).json({
        message: 'Conflicto de horario: el turno seleccionado se solapa con otra reserva existente en el mismo salón y fecha.'
      });
    }

    const resultado = await reservasModel.m_UPDATE(cambios, { 'reserva_id': id_reserva });

    if (resultado && resultado.affectedRows > 0) {
      res.status(200).json({ message: `Reserva con ID ${id_reserva} actualizada con éxito` });
    } else {
      res.status(404).json({ message: `Reserva con ID ${id_reserva} no encontrada o sin cambios` });
    }
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar la reserva' });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------//
const c_Delete = async (req, res) => {
  console.log('Ejecutando método: delete');
  const { id_reserva } = req.params;

  try {
    const result = await reservasModel.m_DELETE({ 'reserva_id': id_reserva });

    if (result && result.affectedRows > 0) {
      res.status(200).json({ message: `Reserva con ID ${id_reserva} eliminada con éxito` });
    } else {
      res.status(404).json({ message: `Reserva con ID ${id_reserva} no encontrada` });
    }
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar la reserva' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_GeneratePDF = async (req, res) => {
  console.log('Ejecutando método: c_GeneratePDF');
  const { id_reserva } = req.params;

  try {
    const columnas = `
      reservas.reserva_id, reservas.fecha_reserva, reservas.tematica,
      reservas.importe_salon, reservas.importe_total,
      sal.titulo AS salon_nombre, sal.capacidad,
      t.hora_desde, t.hora_hasta,
      u.nombre AS cliente_nombre, u.apellido AS cliente_apellido
    `;

    const joins = [
      { tipo: 'INNER', tabla: 'salones sal', on: 'reservas.salon_id = sal.salon_id' },
      { tipo: 'INNER', tabla: 'turnos t', on: 'reservas.turno_id = t.turno_id' },
      { tipo: 'INNER', tabla: 'usuarios u', on: 'reservas.usuario_id = u.usuario_id' }
    ];

    const filtros = { 'reservas.reserva_id': id_reserva };
    const datos = await reservasModel.m_SELECT_JOIN(columnas, joins, filtros, '', '1');

    if (!datos || datos.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const reserva = datos[0];

    const safe = (v, texto = 'No especificado') => (v === null || v === undefined || v === '') ? texto : v;

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Reserva_${id_reserva}.pdf`);
    doc.pipe(res);

    // === encabezado ===
    doc.fontSize(18).fillColor('#2C3E50')
      .text('Sistema de Gestión de Reservas', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('gray')
      .text(`Reporte generado el ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1);
    doc.strokeColor('#2C3E50').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // === Tiutulo ===
    doc.fontSize(16).fillColor('#000')
      .text('Reporte de Reserva', { align: 'center' });
    doc.moveDown(1.5);

    // === Seccion: datos de la reserva ===
    doc.fontSize(14).fillColor('#2C3E50').text('Datos de la Reserva', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000');
    doc.text(`ID de Reserva: ${safe(reserva.reserva_id)}`);
    doc.text(`Fecha: ${safe(new Date(reserva.fecha_reserva).toLocaleDateString('es-AR'))}`);
    doc.text(`Temática: ${safe(reserva.tematica)}`);
    doc.text(`Importe Salón: ${safe(reserva.importe_salon, 'No registrado')}`);
    doc.text(`Importe Total: $${safe(reserva.importe_total, 'No registrado')}`);
    doc.text(`Turno: ${safe(reserva.hora_desde)} - ${safe(reserva.hora_hasta)}`);
    doc.moveDown(1);

    // === seccionn:cliente ===
    doc.fontSize(14).fillColor('#2C3E50').text('Datos del Cliente', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000');
    doc.text(`Nombre: ${safe(reserva.cliente_nombre)} ${safe(reserva.cliente_apellido)}`);
    doc.moveDown(1);

    // == Seccion: salon ===
    doc.fontSize(14).fillColor('#2C3E50').text('Datos del Salón', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000');
    doc.text(`Nombre: ${safe(reserva.salon_nombre)}`);
    doc.text(`Capacidad: ${safe(reserva.capacidad, 'No registrada')}`);
    doc.moveDown(2);

    // == Pie de pagina ===
    const footerText = 'Documento generado automáticamente por el Sistema de Gestión de Reservas.';
    const pageHeight = doc.page.height;
    doc.fontSize(9).fillColor('gray').text(footerText, 0, pageHeight - 70, {
      align: 'center'
    });

    doc.end();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: 'Hubo un error al generar el PDF' });
  }
};

module.exports = { c_Browse, c_BrowseJoin, c_Read, c_Add, c_Edit, c_Delete, c_GeneratePDF };