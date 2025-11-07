const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const serviciosController = require('../controllers/servicios.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Operaciones de gestión de servicios adicionales de los salones
 */

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     summary: Lista todos los servicios disponibles
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida correctamente
 *       404:
 *         description: No se encontraron servicios
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    serviciosController.c_Browse
);

/**
 * @swagger
 * /api/servicios/{id_servicio}:
 *   get:
 *     summary: Obtiene un servicio por su ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id_servicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a consultar
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    '/:id_servicio',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_servicio').isInt({ min: 1 }).withMessage('ID de servicio inválido')],
    validation,
    serviciosController.c_Read
);

/**
 * @swagger
 * /api/servicios:
 *   post:
 *     summary: Crea un nuevo servicio adicional
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción del servicio
 *               importe:
 *                 type: number
 *                 format: float
 *                 description: Importe del servicio
 *               activo:
 *                 type: integer
 *                 enum: [0,1]
 *                 description: Estado del servicio (opcional, por defecto 1)
 *             example:
 *               descripcion: "Catering infantil"
 *               importe: 25000
 *               activo: 1
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    '/',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        check('descripcion').trim().notEmpty().withMessage('Descripcion requerida'),
        check('importe').isFloat({ min: 0 }).withMessage('El importe debe ser numérico >= 0'),
        check('activo').optional({ nullable: true }).isInt({ min: 0, max: 1 }).withMessage('activo debe ser 0 o 1'),
    ],
    validation,
    serviciosController.c_Add
);

/**
 * @swagger
 * /api/servicios/{id_servicio}:
 *   put:
 *     summary: Actualiza un servicio existente
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id_servicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *                 format: float
 *               activo:
 *                 type: integer
 *                 enum: [0,1]
 *             example:
 *               descripcion: "Animación con juegos nuevos"
 *               importe: 28000
 *               activo: 1
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    '/:id_servicio',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        param('id_servicio').isInt({ min: 1 }).withMessage('ID de servicio inválido'),
        check('descripcion').optional().trim().notEmpty(),
        check('importe').optional().isFloat({ min: 0 }),
        check('activo').optional({ nullable: true }).isInt({ min: 0, max: 1 }).withMessage('activo debe ser 0 o 1'),
    ],
    validation,
    serviciosController.c_Edit
);

/**
 * @swagger
 * /api/servicios/{id_servicio}:
 *   delete:
 *     summary: Elimina un servicio del sistema
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id_servicio
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a eliminar
 *     responses:
 *       200:
 *         description: Servicio eliminado correctamente
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
    '/:id_servicio',
    authRoleMiddleware(['empleado', 'administrador']),
    [param('id_servicio').isInt({ min: 1 }).withMessage('ID de servicio inválido')],
    validation,
    serviciosController.c_Delete
);

module.exports = router;