const jwt = require('jsonwebtoken');
const env = require('../config/env.config.js');

const SECRET_KEY = env.SECRET_KEY;

const authRoleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token no proporcionado.' });
    }

    jwt.verify(token, SECRET_KEY, (error, token_decoded) => {
      
      if (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
      }

      req.usuario = token_decoded;

      // Verificar si el usuario está activo
      if (!req.usuario.activo) {
        console.log('Acceso denegado (usuario inactivo)');
        return res.status(403).json({
          message: 'Acceso denegado: el usuario está inhabilitado.'
        });
      }

      if (!allowedRoles.includes(req.usuario.tipo_usuario)) {
        console.log(`Acceso denegado para el rol: ${req.usuario.tipo_usuario}`);
        return res.status(403).json({
          message: 'Acceso denegado: no tienes permiso para acceder a esta ruta.',
          tipo_usuario_requerido: allowedRoles
        });
      }


      next();
    });
  };
};

module.exports = authRoleMiddleware;
