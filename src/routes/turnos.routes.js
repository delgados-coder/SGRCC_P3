const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnos.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), turnosController.c_Browse); 
router.get('/:id_turno', authRoleMiddleware(['cliente','empleado','administrador']), turnosController.c_Read); 
router.post('/', authRoleMiddleware(['empleado','administrador']), turnosController.c_Add); 
router.put('/:id_turno', authRoleMiddleware(['empleado','administrador']), turnosController.c_Edit); 
router.delete('/:id_turno', authRoleMiddleware(['empleado','administrador']), turnosController.c_Delete); 

module.exports = router;
