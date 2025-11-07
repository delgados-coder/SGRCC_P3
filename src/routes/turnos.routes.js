// Módulo de rutas de turnos

const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

// Valida hora en formato HH:MM:SS
const hora = (campo) =>
  check(campo).matches(/^\d{2}:\d{2}:\d{2}$/).withMessage(`${campo} debe ser HH:MM:SS`);

//----------- Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Operaciones de gestión de turnos
 */

// --------------------- Listar todos los TURNOS ---------------------
/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Lista todos los turnos disponibles
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente
 *       404:
 *         description: No se encontraron turnos
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/',
  authRoleMiddleware(['cliente', 'empleado', 'administrador']),
  turnosController.c_Browse
);

// --------------------- Obtener un turno por ID ---------------------
/**
 * @swagger
 * /api/turnos/{turno_id}:
 *   get:
 *     summary: Obtiene un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a consultar
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/:turno_id',
  authRoleMiddleware(['cliente', 'empleado', 'administrador']),
  [param('turno_id').isInt({ min: 1 }).withMessage('ID de turno inválido')],
  validation,
  turnosController.c_Read
);

// --------------------- CREAR TURNO ---------------------
/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orden
 *               - hora_desde
 *               - hora_hasta
 *             properties:
 *               orden:
 *                 type: integer
 *               hora_desde:
 *                 type: string
 *               hora_hasta:
 *                 type: string
 *               activo:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  authRoleMiddleware(['empleado', 'administrador']),
  [
    check('orden').isInt({ min: 1 }).withMessage('orden debe ser un entero >= 1'),
    hora('hora_desde'),
    hora('hora_hasta'),
    check('hora_hasta').custom((hasta, { req }) => {
      return hasta > req.body.hora_desde || 'La hora de finalización debe ser mayor que la hora de inicio';
    }),
    check('activo').optional().isInt({ min: 0, max: 1 }).withMessage('activo debe ser 0 o 1'),
  ],
  validation,
  turnosController.c_Add
);

// --------------------- Actualizar el TURNO ---------------------
/**
 * @swagger
 * /api/turnos/{turno_id}:
 *   put:
 *     summary: Actualiza un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden:
 *                 type: integer
 *               hora_desde:
 *                 type: string
 *               hora_hasta:
 *                 type: string
 *               activo:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  '/:turno_id',
  authRoleMiddleware(['empleado', 'administrador']),
  [
    param('turno_id').isInt({ min: 1 }).withMessage('ID de turno inválido'),
    check('orden').optional().isInt({ min: 1 }),
    hora('hora_desde').optional(),
    hora('hora_hasta').optional(),
    check('hora_hasta')
      .optional()
      .custom((hasta, { req }) => {
        if (!req.body.hora_desde) return true;
        return hasta > req.body.hora_desde || 'La hora de finalización debe ser mayor que la hora de inicio';
      }),
    check('activo').optional().isInt({ min: 0, max: 1 }).withMessage('activo debe ser 0 o 1'),
  ],
  validation,
  turnosController.c_Edit
);

// --------------------- Eliminar Turno --------------------
/**
 * @swagger
 * /api/turnos/{turno_id}:
 *   delete:
 *     summary: Elimina un turno del sistema de forma permanente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  '/:turno_id',
  authRoleMiddleware(['empleado', 'administrador']),
  [param('turno_id').isInt({ min: 1 }).withMessage('ID de turno inválido')],
  validation,
  turnosController.c_Delete
);

// --------------------- Activar o Desactivar Turno (SOFT DELETE) ---------------------
/**
 * @swagger
 * /api/turnos/{turno_id}/{activo}:
 *   patch:
 *     summary: Activa o desactiva un turno
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: activo
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *     responses:
 *       200:
 *         description: Estado del turno actualizado correctamente
 *       400:
 *         description: Valor de activo inválido
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/:turno_id/:activo',
  authRoleMiddleware(['empleado', 'administrador']),
  [
    param('turno_id').isInt({ min: 1 }).withMessage('ID de turno inválido'),
    param('activo').isIn(['0', '1']).withMessage('El valor de "activo" debe ser 0 o 1'),
  ],
  validation,
  turnosController.c_SoftDelete
);

module.exports = router;
