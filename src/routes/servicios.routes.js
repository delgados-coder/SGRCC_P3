const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/servicios.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), serviciosController.c_Browse); 
router.get('/:id_servicio', authRoleMiddleware(['cliente','empleado','administrador']), serviciosController.c_Read); 
router.post('/', authRoleMiddleware(['empleado','administrador']), serviciosController.c_Add); 
router.put('/:id_servicio', authRoleMiddleware(['empleado','administrador']), serviciosController.c_Edit); 
router.delete('/:id_servicio', authRoleMiddleware(['empleado','administrador']), serviciosController.c_Delete); 

module.exports = router;
