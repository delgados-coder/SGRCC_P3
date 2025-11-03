const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para registro, inicio de sesión y manejo de tokens
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
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
 *                 example: juan123
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Devuelve un token JWT.
 *       400:
 *         description: Faltan datos obligatorios.
 *       401:
 *         description: Contraseña incorrecta.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/login', authController.login);           // Iniciar sesion

/**
 * @swagger
 * /api/auth/register:
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
 *                 example: juan123
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *               tipo_usuario:
 *                 type: string
 *                 enum: [cliente, empleado, administrador]
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
router.post('/register', authController.register);     // Registrar nuevo usuario

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra la sesión actual del usuario
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 */
router.post('/logout', authController.logout);         // Cerrar sesión

/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     summary: Obtiene un nuevo token JWT usando un token de refresco
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Token de acceso renovado correctamente.
 *       401:
 *         description: Token de refresco inválido o expirado.
 *       500:
 *         description: Error en el servidor.
 */
router.get('/refresh', authController.refresh);        // Obtener un nuevo token con el refresh token 

module.exports = router;
