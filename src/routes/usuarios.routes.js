// Módulo de rutas de usuarios

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones para gestionar los usuarios del sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - nombre_usuario
 *         - contrasenia
 *         - tipo_usuario
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: ID autogenerado del usuario
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         nombre_usuario:
 *           type: string
 *         contrasenia:
 *           type: string
 *         tipo_usuario:
 *           type: string
 *           enum: [cliente, empleado, administrador]
 *         celular:
 *           type: string
 *         foto:
 *           type: string
 *         activo:
 *           type: boolean
 *       example:
 *         usuario_id: 1
 *         nombre: Juan
 *         apellido: Pérez
 *         nombre_usuario: jperez
 *         contrasenia: 12345
 *         tipo_usuario: empleado
 *         celular: "3515555555"
 *         foto: "foto.jpg"
 *         activo: true
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: No se encontraron usuarios
 *       500:
 *         description: Error del servidor
 */
router.get('/', authRoleMiddleware(['empleado','administrador']), usuariosController.c_Browse);

/**
 * @swagger
 * /api/usuarios/{id_usuario}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a buscar
 *      responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id_usuario', authRoleMiddleware(['empleado','administrador']), usuariosController.c_Read);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       404:
 *         description: Datos faltantes o inválidos
 *       500:
 *         description: Error del servidor
 */            
router.post('/', authRoleMiddleware(['administrador']), usuariosController.c_Add);

/**
 * @swagger
 * /api/usuarios/{id_usuario}:
 *   put:
 *     summary: Actualiza los datos completos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       400:
 *         description: Faltan datos obligatorios
 *       404:
 *         description: Usuario no encontrado o no se realizaron cambios
 *       500:
 *         description: Error al actualizar usuario
 */
router.put('/:id_usuario', authRoleMiddleware(['administrador']), usuariosController.c_Edit);

/**
 * @swagger
 * /api/usuarios/{id_usuario}:
 *   delete:
 *     summary: Elimina un usuario del sistema
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar usuario
 */
router.delete('/:id_usuario', authRoleMiddleware(['administrador']), usuariosController.c_Delete);

/**
 * @swagger
 * /api/usuarios/softdelete/{id_usuario}/{activo}:
 *   patch:
 *     summary: Activa o desactiva un usuario (soft delete)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *       - in: path
 *         name: activo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [activado, desactivado]
 *         description: Estado al que se desea cambiar
 *     responses:
 *       200:
 *         description: Usuario activado/desactivado correctamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/softdelete/:id_usuario/:activo', authRoleMiddleware(['administrador']), usuariosController.c_SoftDelete);

module.exports = router;
