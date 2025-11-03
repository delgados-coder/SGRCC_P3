// Módulo de rutas de reservas

const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservas.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete


/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Operaciones de gestión de reservas
 */

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Lista todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida correctamente
 *       404:
 *         description: No se encontraron reservas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_Browse);   

/**
 * @swagger
 * /api/reservas/join:
 *   get:
 *     summary: Lista todas las reservas con datos combinados (JOIN)
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas combinadas obtenida correctamente
 *       404:
 *         description: No se encontraron reservas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/join/:id_reserva', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_BrowseJoin);           

/**
 * @swagger
 * /api/reservas/{id_reserva}:
 *   get:
 *     summary: Obtiene una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id_reserva
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id_reserva', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_Read);  

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario que realiza la reserva
 *               salon_id:
 *                 type: integer
 *                 description: ID del salón reservado
 *               turno_id:
 *                 type: integer
 *                 description: ID del turno reservado
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la reserva
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authRoleMiddleware(['cliente','administrador']), reservasController.c_Add);    

/**
 * @swagger
 * /api/reservas/{id_reserva}:
 *   put:
 *     summary: Actualiza una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id_reserva
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salon_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id_reserva', authRoleMiddleware(['administrador']), reservasController.c_Edit);  

/**
 * @swagger
 * /api/reservas/{id_reserva}:
 *   delete:
 *     summary: Elimina una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id_reserva
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a eliminar
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id_reserva', authRoleMiddleware(['administrador']), reservasController.c_Delete); 

/**
 * @swagger
 * /api/reservas/pdf/{id_reserva}:
 *   get:
 *     summary: Genera un reporte PDF para una reserva específica
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id_reserva
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva para generar el PDF
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno al generar el PDF
 */
router.get('/pdf/:id_reserva', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_GeneratePDF);


module.exports = router;
