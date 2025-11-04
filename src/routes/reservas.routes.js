// Módulo de rutas de reservas

const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const reservasController = require('../controllers/reservas.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['cliente', 'empleado', 'administrador']), reservasController.c_Browse);

router.get('/join/:id_reserva',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_reserva').isInt({ min: 1 }).withMessage('id_reserva inválido')],
    validation,
    reservasController.c_BrowseJoin
);

router.get('/:id_reserva',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_reserva').isInt({ min: 1 }).withMessage('id_reserva inválido')],
    validation,
    reservasController.c_Read
);

router.post('/',
    authRoleMiddleware(['cliente', 'administrador']),
    [
        check('fecha_reserva').isISO8601().withMessage('La fecha de reserva debe ser YYYY-MM-DD'),
        check('salon_id').isInt({ min: 1 }).withMessage('ID de salon inválido'),
        check('usuario_id').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
        check('turno_id').isInt({ min: 1 }).withMessage('ID de turno inválido'),
        check('tematica').optional({ nullable: true, checkFalsy: true }).isLength({ max: 255 }),
        check('foto_cumpleaniero').optional({ nullable: true, checkFalsy: true }).isString(),
        check('importe_salon').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }),
        check('importe_total').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }),
    ],
    validation,
    reservasController.c_Add
);

router.put('/:id_reserva',
    authRoleMiddleware(['administrador']),
    [
        param('id_reserva').isInt({ min: 1 }).withMessage('ID dereserva inválido'),
        check('fecha_reserva').optional().isISO8601(),
        check('salon_id').optional().isInt({ min: 1 }),
        check('usuario_id').optional().isInt({ min: 1 }),
        check('turno_id').optional().isInt({ min: 1 }),
        check('tematica').optional().isLength({ max: 255 }),
        check('foto_cumpleaniero').optional().isString(),
        check('importe_salon').optional().isFloat({ min: 0 }),
        check('importe_total').optional().isFloat({ min: 0 }),
    ],
    validation,
    reservasController.c_Edit
);

router.delete('/:id_reserva',
    authRoleMiddleware(['administrador']),
    [param('id_reserva').isInt({ min: 1 }).withMessage('ID de reserva inválido')],
    validation,
    reservasController.c_Delete
);

router.get('/pdf/:id_reserva',
    authRoleMiddleware(['cliente', 'empleado', 'administrador']),
    [param('id_reserva').isInt({ min: 1 }).withMessage('ID de reserva inválido')],
    validation,
    reservasController.c_GeneratePDF
);

module.exports = router;