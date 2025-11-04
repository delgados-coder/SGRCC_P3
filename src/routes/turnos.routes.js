const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

const hora = (campo) => check(campo).matches(/^\d{2}:\d{2}:\d{2}$/).withMessage(`${campo} debe ser HH:MM:SS`);

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete


/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Operaciones de gestión de turnos para reservas
 */

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
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), turnosController.c_Browse); 


/**
 * @swagger
 * /api/turnos/{id_turno}:
 *   get:
 *     summary: Obtiene un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_turno
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
router.get('/:id_turno', authRoleMiddleware(['cliente','empleado','administrador']), turnosController.c_Read); 


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
 *             properties:
 *               hora_desde:
 *                 type: string
 *                 example: "10:00"
 *               hora_hasta:
 *                 type: string
 *                 example: "14:00"
 *               descripcion:
 *                 type: string
 *                 example: "Turno matutino para eventos infantiles"
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authRoleMiddleware(['empleado','administrador']), turnosController.c_Add); 

/**
 * @swagger
 * /api/turnos/{id_turno}:
 *   put:
 *     summary: Actualiza un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora_desde:
 *                 type: string
 *                 example: "15:00"
 *               hora_hasta:
 *                 type: string
 *                 example: "19:00"
 *               descripcion:
 *                 type: string
 *                 example: "Turno vespertino actualizado"
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id_turno', authRoleMiddleware(['empleado','administrador']), turnosController.c_Edit); 

/**
 * @swagger
 * /api/turnos/{id_turno}:
 *   delete:
 *     summary: Elimina un turno del sistema
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id_turno
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a eliminar
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id_turno', authRoleMiddleware(['empleado','administrador']), turnosController.c_Delete); 
router.get('/', authRoleMiddleware(['cliente', 'empleado', 'administrador']), turnosController.c_Browse);

router.get('/:id_turno',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_turno').isInt({ min: 1 }).withMessage('ID de turno inválido')],
    validation,
    turnosController.c_Read
);

router.post('/',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        check('orden').isInt({ min: 1 }).withMessage('El orden debe ser un entero >= 1'),
        hora('hora_desde'),
        hora('hora_hasta'),
        check('hora_hasta').custom((hasta, { req }) => {
            if (!req.body.hora_desde) return true;
            return hasta > req.body.hora_desde || 'La hora de finalización debe ser mayor que la hora de inicio';
        }),
    ],
    validation,
    turnosController.c_Add
);

router.put('/:id_turno',
    authRoleMiddleware(['empleado', 'administrador']),
    [
        param('id_turno').isInt({ min: 1 }).withMessage('ID de turno inválido'),
        check('orden').optional().isInt({ min: 1 }),
        hora('hora_desde').optional(),
        hora('hora_hasta').optional(),
        check('hora_hasta').optional().custom((hasta, { req }) => {
            if (!req.body.hora_desde) return true;
            return hasta > req.body.hora_desde || 'La hora de finalización debe ser mayor que la hora de inicio';
        }),
    ],
    validation,
    turnosController.c_Edit
);

router.delete('/:id_turno',
    authRoleMiddleware(['empleado', 'administrador']),
    [param('id_turno').isInt({ min: 1 }).withMessage('ID de turno inválido')],
    validation,
    turnosController.c_Delete
);

module.exports = router;