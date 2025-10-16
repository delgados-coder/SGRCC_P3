const express = require('express');
const router = express.Router();
const salonesController = require('../controllers/salones.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), salonesController.c_Browse); 
router.get('/:id_salon', authRoleMiddleware(['cliente','empleado','administrador']), salonesController.c_Read); 
router.post('/', authRoleMiddleware(['empleado','administrador']), salonesController.c_Add); 
router.put('/:id_salon', authRoleMiddleware(['empleado','administrador']), salonesController.c_Edit); 
router.delete('/:id_salon', authRoleMiddleware(['empleado','administrador']), salonesController.c_Delete); 

module.exports = router;
