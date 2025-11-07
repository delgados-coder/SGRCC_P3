const usuariosModel = require('../models/BASE/base.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env.config.js');

let refreshTokens = []; /*esto para el refresh, funcion plus*/


const login = async (req, res) => {
  console.log('Ejecutando método: login');

  const { nombre_usuario, contrasenia } = req.body;

  try {
    if (!nombre_usuario || !contrasenia) {
      return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });
    }

    const registrosUsuarios = await usuariosModel.m_base_SELECT(
      'usuarios',
      '*',
      { nombre_usuario }
    );
    const usuario = registrosUsuarios[0];

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const payload = {
      id: usuario.usuario_id,
      nombre_usuario: usuario.nombre_usuario,
      tipo_usuario: usuario.tipo_usuario,
      activo: usuario.activo
    };

    const accessToken = jwt.sign(payload, env.SECRET_KEY, {
      expiresIn: env.JWT_EXPIRES_IN || '1h'
    });
    const refreshToken = jwt.sign(payload, env.SECRET_KEY, { expiresIn: '1d' });

    refreshTokens.push(refreshToken);

    res.status(200).json({
      message: 'Autenticación exitosa',
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Hubo un error en el servidor' });
  }
};


const register = async (req, res) => {
  console.log('Ejecutando método: register');

  const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = req.body;

  try {
    if (!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario) {
      return res.status(400).json({
        message:
          'Faltan datos obligatorios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario)'
      });
    }

    const registrosUsuarios = await usuariosModel.m_base_SELECT('usuarios', '*', {
      nombre_usuario
    });
    const existingUser = registrosUsuarios[0];

    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const newUser = {
      nombre,
      apellido,
      nombre_usuario,
      contrasenia: hashedPassword,
      tipo_usuario,
      celular: celular || null,
      foto: foto || null
    };

    const result = await usuariosModel.m_base_INSERT('usuarios', newUser);

    res.status(201).json({ message: 'Usuario creado con éxito', usuarioId: result.insertId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Hubo un error al crear el usuario' });
  }
};


const logout = (req, res) => {
  console.log('Ejecutando método: logout');
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'No se proporcionó refresh token' });
  }

  refreshTokens = refreshTokens.filter(t => t !== refreshToken);

  res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

const refresh = (req, res) => {
  console.log('Ejecutando método: refresh');

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Token de actualización no proporcionado' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token inválido o no reconocido' });
  }

  jwt.verify(refreshToken, env.SECRET_KEY, (err, user) => {
    if (err) {
      refreshTokens = refreshTokens.filter(t => t !== refreshToken);
      return res.status(403).json({ message: 'Refresh token inválido o expirado' });
    }

    const payload = {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      tipo_usuario: user.tipo_usuario,
      activo: user.activo
    };

    const newAccessToken = jwt.sign(payload, env.SECRET_KEY, {
      expiresIn: env.JWT_EXPIRES_IN || '1h'
    });

    res.status(200).json({
      message: 'Nuevo token generado correctamente',
      accessToken: newAccessToken
    });
  });
};

//------------------------------------------------------------------------------------------------------/
module.exports = { login, register, logout, refresh, refreshTokens};