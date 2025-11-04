const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

const hora = (campo) => check(campo).matches(/^\d{2}:\d{2}:\d{2}$/).withMessage(`${campo} debe ser HH:MM:SS`);

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
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