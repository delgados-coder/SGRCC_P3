const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const salonesController = require('../controllers/salones.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
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