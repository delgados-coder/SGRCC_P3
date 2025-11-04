/**
* Controlador de resevas
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