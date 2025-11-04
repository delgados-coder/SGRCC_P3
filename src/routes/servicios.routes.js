const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const serviciosController = require('../controllers/servicios.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
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