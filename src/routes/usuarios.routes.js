const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');


//-----------Rutas BREAD ----------- //
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['empleado','administrador']), usuariosController.c_Browse);
router.get('/:id_usuario', authRoleMiddleware(['empleado','administrador']), usuariosController.c_Read);
router.post('/', authRoleMiddleware(['administrador']), usuariosController.c_Add);
router.put('/:id_usuario', authRoleMiddleware(['administrador']), usuariosController.c_Edit);
router.delete('/:id_usuario', authRoleMiddleware(['administrador']), usuariosController.c_Delete);
router.patch('/softdelete/:id_usuario/:activo', usuariosController.c_SoftDelete);

module.exports = router;
