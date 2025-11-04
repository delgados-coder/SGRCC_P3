// Módulo de rutas de usuarios

const express = require('express');
const { check, param } = require('express-validator');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');
const validation = require('../middlewares/validation.middleware.js');


//-----------Rutas BREAD ----------- //
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['empleado', 'administrador']), usuariosController.c_Browse);
router.get('/:id_usuario',
    authRoleMiddleware(['empleado', 'administrador']),
    [param('id_usuario').isInt({ min: 1 }).withMessage('id_usuario inválido')],
    validation,
    usuariosController.c_Read
);

router.post('/',
    authRoleMiddleware(['administrador']),
    [
        check('nombre').trim().notEmpty().withMessage('nombre requerido'),
        check('apellido').trim().notEmpty().withMessage('apellido requerido'),
        check('nombre_usuario').isEmail().withMessage('email inválido'),
        check('contrasenia').isLength({ min: 6 }).withMessage('contraseña mínimo 6 caracteres'),
        check('tipo_usuario').isIn(['cliente', 'empleado', 'administrador']).withMessage('tipo de usuario inválido'),
        check('celular').optional({ nullable: true, checkFalsy: true }).isString(),
        check('foto').optional({ nullable: true, checkFalsy: true }).isString(),
    ],
    validation,
    usuariosController.c_Add
);

router.put('/:id_usuario',
    authRoleMiddleware(['administrador']),
    [
        param('id_usuario').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
        check('nombre').optional().trim().isLength({ min: 2, max: 50 }),
        check('apellido').optional().trim().isLength({ min: 2, max: 50 }),
        check('nombre_usuario').optional().isEmail(),
        check('contrasenia').optional().isLength({ min: 6 }),
        check('tipo_usuario').optional().isIn(['cliente', 'empleado', 'administrador']),
        check('celular').optional().isString(),
        check('foto').optional().isString(),
    ],
    validation,
    usuariosController.c_Edit
);

router.delete('/:id_usuario',
    authRoleMiddleware(['administrador']),
    [param('id_usuario').isInt({ min: 1 }).withMessage('ID deusuario inválido')],
    validation,
    usuariosController.c_Delete
);

router.patch('/softdelete/:id_usuario/:activo',
    authRoleMiddleware(['administrador']),
    [
        param('id_usuario').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
        param('activo').isIn(['activado', 'desactivado']).withMessage('Activo debe ser "activado" o "desactivado"'),
    ],
    validation,
    usuariosController.c_SoftDelete
);

module.exports = router;