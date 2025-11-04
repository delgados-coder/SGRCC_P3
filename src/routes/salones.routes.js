const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const salonesController = require('../controllers/salones.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete

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
 *     responses:
 *       200:
 *         description: Lista de salones obtenida correctamente
 *       404:
 *         description: No se encontraron salones
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), salonesController.c_Browse); 

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
 *         description: Salón encontrado
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id_salon', authRoleMiddleware(['cliente','empleado','administrador']), salonesController.c_Read); 

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
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Nombre del salón
 *               capacidad:
 *                 type: integer
 *                 description: Capacidad máxima de personas
 *               ubicacion:
 *                 type: string
 *                 description: Dirección o ubicación del salón
 *               descripcion:
 *                 type: string
 *                 description: Descripción del salón
 *               precio_base:
 *                 type: number
 *                 format: float
 *                 description: Precio base de reserva
 *             example:
 *               titulo: "Salón Arcoiris"
 *               capacidad: 50
 *               ubicacion: "Av. Siempre Viva 123"
 *               descripcion: "Salón ideal para cumpleaños infantiles"
 *               precio_base: 15000
 *     responses:
 *       201:
 *         description: Salón creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authRoleMiddleware(['empleado','administrador']), salonesController.c_Add); 

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
 *               capacidad:
 *                 type: integer
 *               ubicacion:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio_base:
 *                 type: number
 *                 format: float
 *             example:
 *               titulo: "Trampolín Play"
 *               capacidad: 70
 *               ubicacion: "Belgrano 100"
 *               descripcion: "Salón remodelado con mejor iluminación"
 *               precio_base: 200000
 *     responses:
 *       200:
 *         description: Salón actualizado correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id_salon', authRoleMiddleware(['empleado','administrador']), salonesController.c_Edit); 

/**
 * @swagger
 * /api/salones/{id_salon}:
 *   delete:
 *     summary: Elimina un salón del sistema
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
router.delete('/:id_salon', authRoleMiddleware(['empleado','administrador']), salonesController.c_Delete); 
router.get('/', authRoleMiddleware(['cliente', 'empleado', 'administrador']), salonesController.c_Browse);

router.get('/:id_salon',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_salon').isInt({ min: 1 }).withMessage('ID de salon inválido')],
    validation,
    salonesController.c_Read
);

router.post('/',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        check('titulo').trim().notEmpty().withMessage('El título es obligatorio'),
        check('direccion').trim().notEmpty().withMessage('La dirección es obligatoria'),
        check('capacidad').isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero positivo'),
        check('importe').isFloat({ gt: 0 }).withMessage('El importe debe ser un número válido mayor a 0'),
        check('latitud').optional({ nullable: true, checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
        check('longitud').optional({ nullable: true, checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
    ],
    validation,
    salonesController.c_Add
);

router.put('/:id_salon',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        param('id_salon').isInt({ min: 1 }).withMessage('ID desalon inválido'),
        check('titulo').optional().trim().notEmpty(),
        check('direccion').optional().trim().notEmpty(),
        check('capacidad').optional().isInt({ min: 1 }),
        check('importe').optional().isFloat({ min: 0 }),
        check('latitud').optional({ nullable: true, checkFalsy: true }).isFloat({ min: -90, max: 90 }),
        check('longitud').optional({ nullable: true, checkFalsy: true }).isFloat({ min: -180, max: 180 }),
    ],
    validation,
    salonesController.c_Edit
);

router.delete('/:id_salon',
    authRoleMiddleware(['empleado', 'administrador']),
    [param('id_salon').isInt({ min: 1 }).withMessage('ID de salon inválido')],
    validation,
    salonesController.c_Delete
);

module.exports = router;