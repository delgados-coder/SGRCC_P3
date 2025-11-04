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
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), serviciosController.c_Browse); 


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
router.get('/:id_servicio', authRoleMiddleware(['cliente','empleado','administrador']), serviciosController.c_Read); 

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
 *               nombre:
 *                 type: string
 *                 description: Nombre del servicio
 *               descripcion:
 *                 type: string
 *                 description: Descripción del servicio
 *               precio:
 *                 type: number
 *                 format: float
 *                 description: Precio del servicio
 *               tipo_servicio:
 *                 type: string
 *                 description: Categoría o tipo del servicio (ejemplo: catering, animación, decoración)
 *             example:
 *               nombre: "Catering infantil"
 *               descripcion: "Servicio de comida para niños y adultos"
 *               precio: 25000
 *               tipo_servicio: "Catering"
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authRoleMiddleware(['empleado','administrador']), serviciosController.c_Add); 

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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 format: float
 *               tipo_servicio:
 *                 type: string
 *             example:
 *               nombre: "Animación con juegos nuevos"
 *               descripcion: "Animadores y juegos interactivos"
 *               precio: 28000
 *               tipo_servicio: "Animación"
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id_servicio', authRoleMiddleware(['empleado','administrador']), serviciosController.c_Edit); 


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
router.delete('/:id_servicio', authRoleMiddleware(['empleado','administrador']), serviciosController.c_Delete); 
router.get('/', authRoleMiddleware(['cliente', 'empleado', 'administrador']), serviciosController.c_Browse);

router.get('/:id_servicio',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_servicio').isInt({ min: 1 }).withMessage('ID de servicio inválido')],
    validation,
    serviciosController.c_Read
);

router.post('/',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        check('descripcion').trim().notEmpty().withMessage('Descripcion requerida'),
        check('importe').isFloat({ min: 0 }).withMessage('El importe debe ser numérico >= 0'),
    ],
    validation,
    serviciosController.c_Add
);

router.put('/:id_servicio',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        param('id_servicio').isInt({ min: 1 }).withMessage('ID de servicio inválido'),
        check('descripcion').optional().trim().notEmpty(),
        check('importe').optional().isFloat({ min: 0 }),
    ],
    validation,
    serviciosController.c_Edit
);

router.delete('/:id_servicio',
    authRoleMiddleware(['empleado', 'administrador']),
    [param('id_servicio').isInt({ min: 1 }).withMessage('ID de servicio inválido')],
    validation,
    serviciosController.c_Delete
);

module.exports = router;