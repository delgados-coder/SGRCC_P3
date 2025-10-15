// Controlador de usuarios: gestiona altas, bajas, modificaciones y consultas

const usuariosModel = require('../models/usuarios.model.js');

//--------------------------------------------------------------------------------------------------------------------------------------//
const c_Browse = async (req, res) => {
  try {
    console.log('Ejecutando método: c_BROWSE (todos los registros)');

    const usuarios = await usuariosModel.m_SELECT('*');

    if (usuarios.length > 0) {
      res.status(200).json(usuarios);
    } else {
      res.status(404).json({ message: 'No se encontraron usuarios.' });
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Hubo un error al obtener los usuarios.' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_Read = async (req, res) => {
  console.log('Ejecutando método: c_READ (Un registro por ID)');

  const { id_usuario } = req.params;

  try {
    const usuario = await usuariosModel.m_SELECT('*', { 'usuario_id': id_usuario });

    if (usuario && usuario.length > 0) {
      res.status(200).json(usuario[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Hubo un error al obtener el usuario' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_Add = (req, res) => {
  console.log('Ejecutando método: ADD (AÑADIR UN NUEVO REGISTRO)');

  const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = req.body;

  if (!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario) {
    return res.status(400).json({ message: 'Faltan datos obligatorios (nombre, apellido, nombre_usuario, contraseña, tipo_usuario)' });
  }

  const nuevoUsuario = { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto };

  usuariosModel.m_INSERT(nuevoUsuario)
    .then((result) => {
      res.status(201).json({ message: 'Usuario creado con éxito', usuarioId: result.insertId });
    })
    .catch((error) => {
      console.error('Error al insertar usuario:', error);
      res.status(500).json({ message: 'Hubo un error al crear el usuario' });
    });
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_Edit = async (req, res) => {
  console.log('Ejecutando método: c_EDIT (Actualizar usuario)');

  const { id_usuario } = req.params;
  const usuarioData = req.body;

  if (!usuarioData.nombre || !usuarioData.apellido || !usuarioData.nombre_usuario || !usuarioData.contrasenia || !usuarioData.tipo_usuario) {
    return res.status(400).json({ message: 'Faltan datos obligatorios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario)' });
  }

  try {
    const resultado = await usuariosModel.m_UPDATE(usuarioData, { 'usuario_id': id_usuario });

    if (resultado && resultado.affectedRows > 0) {
      res.status(200).json({ message: `Usuario con ID ${id_usuario} actualizado con éxito` });
    } else {
      res.status(404).json({ message: `Usuario con ID ${id_usuario} no encontrado o no se realizaron cambios` });
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar el usuario' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_Delete = async (req, res) => {
  console.log('Ejecutando método: delete');

  const { id_usuario } = req.params;

  try {
    const result = await usuariosModel.m_DELETE({ 'usuario_id': id_usuario });

    if (result && result.affectedRows > 0) {
      res.status(200).json({ message: `Usuario con ID ${id_usuario} eliminado con éxito` });
    } else {
      res.status(404).json({ message: `Usuario con ID ${id_usuario} no encontrado` });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Hubo un error al eliminar el usuario' });
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------//


const c_SoftDelete = async (req, res) => {
  console.log('Ejecutando método: Softdelete (DESACTIVAR A UN USUARIO)');

  const { id_usuario, activo } = req.params;

  if (activo !== "activado" && activo !== "desactivado") {
    return res.status(400).json({ message: 'Estado no válido. Debe ser "activado" o "desactivado".' });
  }

  const nuevoEstado = (activo === "activado") ? 1 : 0;

  try {
    const usuario = await usuariosModel.m_SELECT('*', { 'usuario_id': id_usuario });

    if (!usuario || usuario.length === 0) {
      return res.status(404).json({ message: `Usuario con ID ${id_usuario} no encontrado` });
    }

    const resultado = await usuariosModel.m_UPDATE({ activo: nuevoEstado }, { 'usuario_id': id_usuario });

    if (resultado && resultado.affectedRows > 0) {
      res.status(200).json({
        message: `Usuario con ID ${id_usuario} ${nuevoEstado === 0 ? 'inactivado' : 'activado'} correctamente`,
        usuario: { ...usuario[0], activo: nuevoEstado },
      });
    } else {
      res.status(500).json({ message: 'Hubo un error al intentar cambiar el estado del usuario' });
    }
  } catch (error) {
    console.error('Error al ejecutar soft delete:', error);
    res.status(500).json({ message: 'Hubo un error al intentar ejecutar el soft delete' });
  }
};




module.exports = { c_Browse, c_Read, c_Add, c_Edit, c_Delete, c_SoftDelete };
