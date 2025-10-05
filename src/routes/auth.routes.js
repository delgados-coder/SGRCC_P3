const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

router.post('/login', authController.login);           // Iniciar sesion
router.post('/register', authController.register);     // Registrar nuevo usuario
router.post('/logout', authController.logout);         // Cerrar sesión
router.get('/refresh', authController.refresh);        // Obtener un nuevo token con el refresh token 

module.exports = router;
