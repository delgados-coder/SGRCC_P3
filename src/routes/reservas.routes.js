// Módulo de rutas de reservas

const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservas.controller.js');
const authRoleMiddleware = require('../middlewares/authRole.middleware.js');

//-----------Rutas BREAD -----------
// Browse, Read, Edit, Add, Delete
router.get('/', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_Browse);           
router.get('/join/:id_reserva', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_BrowseJoin);           
router.get('/:id_reserva', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_Read);  
router.post('/', authRoleMiddleware(['cliente','administrador']), reservasController.c_Add);             
router.put('/:id_reserva', authRoleMiddleware(['administrador']), reservasController.c_Edit);  
router.delete('/:id_reserva', authRoleMiddleware(['administrador']), reservasController.c_Delete); 

router.get('/pdf/:id_reserva', authRoleMiddleware(['cliente','empleado','administrador']), reservasController.c_GeneratePDF);


module.exports = router;
