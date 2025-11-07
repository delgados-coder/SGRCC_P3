const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const salonesController = require('../controllers/salones.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

//----------- Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete, Soft Delete

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Operaciones de gestión de salones
 */

/**
 * @swagger
 * /api/salones:
 *   get:
 *     summary: Lista todos los salones disponibles
 *     tags: [Salones]
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: string
 *           enum: [0, 1]
 *         description: Filtra salones activos (1) o inactivos (0)
 *     responses:
 *       200:
 *         description: Lista de salones obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               - salon_id: 1
 *                 titulo: "Salón Arcoiris"
 *                 direccion: "Av. Siempre Viva 123"
 *                 capacidad: 50
 *                 importe: 150000
 *                 latitud: -31.4167
 *                 longitud: -64.1833
 *                 activo: 1
 *       404:
 *         description: No se encontraron salones
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/',
  authRoleMiddleware(['cliente', 'empleado', 'administrador']),
  salonesController.c_Browse
);

/**
 * @swagger
 * /api/salones/{id_salon}:
 *   get:
 *     summary: Obtiene un salón por su ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id_salon
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a consultar
 *     responses:
 *       200:
 *         description: Salón encontrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               salon_id: 2
 *               titulo: "Trampolín Play"
 *               direccion: "Belgrano 100"
 *               capacidad: 70
 *               importe: 200000
 *               latitud: -31.42
 *               longitud: -64.18
 *               activo: 1
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/:id_salon',
  authRoleMiddleware(['cliente', 'empleado', 'administrador']),
  [param('id_salon').isInt({ min: 1 }).withMessage('ID de salón inválido')],
  validation,
  salonesController.c_Read
);

/**
 * @swagger
 * /api/salones:
 *   post:
 *     summary: Crea un nuevo salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, direccion, capacidad, importe]
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Nombre del salón
 *               direccion:
 *                 type: string
 *                 description: Dirección del salón
 *               capacidad:
 *                 type: integer
 *                 description: Capacidad máxima de personas
 *               importe:
 *                 type: number
 *                 format: float
 *                 description: Importe base del salón
 *               latitud:
 *                 type: number
 *                 format: float
 *                 description: Latitud (opcional)
 *               longitud:
 *                 type: number
 *                 format: float
 *                 description: Longitud (opcional)
 *             example:
 *               titulo: "Salón Arcoiris"
 *               direccion: "Av. Siempre Viva 123"
 *               capacidad: 50
 *               importe: 150000
 *               latitud: -31.4167
 *               longitud: -64.1833
 *     responses:
 *       201:
 *         description: Salón creado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Salón creado correctamente"
 *               salon_id: 10
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  authRoleMiddleware(['empleado', 'administrador']),
  [
    check('titulo').trim().notEmpty().withMessage('El título es obligatorio'),
    check('direccion').trim().notEmpty().withMessage('La dirección es obligatoria'),
    check('capacidad').isInt({ min: 1 }).withMessage('La capacidad debe ser un entero >= 1'),
    check('importe').isFloat({ gt: 0 }).withMessage('El importe debe ser > 0'),
    check('latitud')
      .optional({ nullable: true, checkFalsy: true })
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitud inválida'),
    check('longitud')
      .optional({ nullable: true, checkFalsy: true })
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitud inválida'),
  ],
  validation,
  salonesController.c_Add
);

/**
 * @swagger
 * /api/salones/{id_salon}:
 *   put:
 *     summary: Actualiza la información de un salón existente
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id_salon
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               importe:
 *                 type: number
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *             example:
 *               titulo: "Trampolín Play"
 *               direccion: "Belgrano 100"
 *               capacidad: 70
 *               importe: 200000
 *               latitud: -31.42
 *               longitud: -64.18
 *     responses:
 *       200:
 *         description: Salón actualizado correctamente
 *       404:
 *         description: Salón no encontrado
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  '/:id_salon',
  authRoleMiddleware(['empleado', 'administrador']),
  [
    param('id_salon').isInt({ min: 1 }).withMessage('ID de salón inválido'),
    check('titulo').optional().trim().notEmpty(),
    check('direccion').optional().trim().notEmpty(),
    check('capacidad').optional().isInt({ min: 1 }),
    check('importe').optional().isFloat({ min: 0 }),
    check('latitud')
      .optional({ nullable: true, checkFalsy: true })
      .isFloat({ min: -90, max: 90 }),
    check('longitud')
      .optional({ nullable: true, checkFalsy: true })
      .isFloat({ min: -180, max: 180 }),
  ],
  validation,
  salonesController.c_Edit
);

/**
 * @swagger
 * /api/salones/{id_salon}:
 *   delete:
 *     summary: Elimina un salón del sistema (eliminación definitiva)
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id_salon
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a eliminar
 *     responses:
 *       200:
 *         description: Salón eliminado correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  '/:id_salon',
  authRoleMiddleware(['empleado', 'administrador']),
  [param('id_salon').isInt({ min: 1 }).withMessage('ID de salón inválido')],
  validation,
  salonesController.c_Delete
);

/**
 * @swagger
 * /api/salones/{id_salon}/{activo}:
 *   patch:
 *     summary: Activa o desactiva un salón (soft delete)
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id_salon
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a actualizar
 *       - in: path
 *         name: activo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [0, 1]
 *         description: 1 para activar, 0 para desactivar
 *     responses:
 *       200:
 *         description: Estado del salón actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Salón desactivado correctamente"
 *               salon:
 *                 salon_id: 5
 *                 titulo: "Trampolín Play"
 *                 activo: 0
 *       400:
 *         description: Valor de 'activo' inválido
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/:id_salon/:activo',
  authRoleMiddleware(['empleado', 'administrador']),
  [
    param('id_salon').isInt({ min: 1 }).withMessage('ID de salón inválido'),
    param('activo').isIn(['0', '1']).withMessage('El valor de "activo" debe ser 0 o 1'),
  ],
  validation,
  salonesController.c_SoftDelete
);

module.exports = router;
