const express = require('express');
const { check } = require('express-validator');
const validation = require('../middlewares/validation.middleware.js');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

router.post(
    '/login',
    [
        check('nombre_usuario').isEmail().withMessage('Debe ser un email válido'),
        check('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
    ],
    validation,
    authController.login
);

router.post(
    '/register',
    [
        check('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
        check('apellido').trim().notEmpty().withMessage('El apellido es requerido'),
        check('nombre_usuario').isEmail().withMessage('Debe ser un email válido'),
        check('contrasenia').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        check('tipo_usuario').isIn(['cliente', 'empleado', 'administrador']).withMessage('Tipo de usuario inválido'),
        check('celular').optional({ nullable: true, checkFalsy: true }).isString(),
        check('foto').optional({ nullable: true, checkFalsy: true }).isString(),
    ],
    validation,
    authController.register
);

router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

module.exports = router;
