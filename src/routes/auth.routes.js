const express = require('express');
const { check } = require('express-validator');
const validation = require('../middlewares/validation.middleware.js');
const authController = require('../controllers/auth.controller.js');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para registro, inicio de sesión y manejo de tokens
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene tokens JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: testing@gmail.com
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Devuelve tokens JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Faltan datos obligatorios.
 *       401:
 *         description: Contraseña incorrecta.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - contrasenia
 *               - tipo_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               nombre_usuario:
 *                 type: string
 *                 example: testing@gmail.com
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *               tipo_usuario:
 *                 type: string
 *                 enum: [administrador, empleado, cliente ]
 *               celular:
 *                 type: string
 *                 example: "1123456789"
 *               foto:
 *                 type: string
 *                 example: "https://miapp.com/uploads/foto.jpg"
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito.
 *       400:
 *         description: Faltan datos obligatorios.
 *       409:
 *         description: El nombre de usuario ya está registrado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra la sesión actual del usuario invalidando el token de refresco
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: Escribe aqui tu REFRESH TOKEN
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *       400:
 *         description: No se proporcionó el token de refresco.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Obtiene un nuevo token JWT usando un token de refresco
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco JWT válido
 *                 example: Escribe aqui tu REFRESH TOKEN
 *     responses:
 *       200:
 *         description: Token de acceso renovado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                   description: Nuevo token de acceso JWT
 *       401:
 *         description: Token de refresco no proporcionado.
 *       403:
 *         description: Refresh token inválido o expirado.
 *       500:
 *         description: Error en el servidor.
 */

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

router.post(
  '/logout',
  [check('refreshToken').notEmpty().withMessage('refreshToken es requerido')],
  validation,
  authController.logout
);

router.post(
  '/refresh',
  [check('refreshToken').notEmpty().withMessage('refreshToken es requerido')],
  validation,
  authController.refresh
);

module.exports = router;