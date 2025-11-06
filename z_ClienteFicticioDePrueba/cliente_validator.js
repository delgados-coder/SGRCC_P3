// Cliente de consola para probar JWT, roles y express-validator en /api/salones
// Ejecutar con: `npm run client:validator`

const axios = require('axios');
const { CLIENT_BASE_URL } = require('../src/config/env.config.js');

const BASE_URL = CLIENT_BASE_URL;

const title = (t) => {
  console.log('\n' + '='.repeat(86));
  console.log(t);
  console.log('='.repeat(86));
};

const show = (label, obj) => {
  console.log(label, JSON.stringify(obj, null, 2));
};

async function register(body) {
  try {
    const { data, status } = await axios.post(`${BASE_URL}/auth/register`, body);
    show(`✅ /auth/register (${status})`, data);
    return true;
  } catch (err) {
    if (err.response) show(`❌ /auth/register (${err.response.status})`, err.response.data);
    else console.error(err.message);
    return false;
  }
}

async function login(body) {
  try {
    const { data, status } = await axios.post(`${BASE_URL}/auth/login`, body);
    show(`✅ /auth/login (${status})`, data);
    return data.token;
  } catch (err) {
    if (err.response) show(`❌ /auth/login (${err.response.status})`, err.response.data);
    else console.error(err.message);
    return null;
  }
}

async function get(path, headers, label) {
  try {
    const { data, status } = await axios.get(`${BASE_URL}${path}`, { headers });
    show(`✅ GET ${path} (${status})`, data);
  } catch (err) {
    if (err.response) show(`❌ GET ${path} (${err.response.status})`, err.response.data);
    else console.error(err.message);
  }
}

async function post(path, payload, headers, label) {
  try {
    const { data, status } = await axios.post(`${BASE_URL}${path}`, payload, { headers });
    show(`✅ POST ${path} (${status})`, data);
  } catch (err) {
    if (err.response) show(`❌ POST ${path} (${err.response.status})`, err.response.data);
    else console.error(err.message);
  }
}

async function main() {
  title('1) Semilla: crear dos usuarios (cliente y empleado)');
  const stamp = Date.now();
  const clienteUser = {
    nombre: 'Tester',
    apellido: 'Cliente',
    nombre_usuario: `cliente_${stamp}@correo.com`,
    contrasenia: 'Test1234!',
    tipo_usuario: 'cliente',
  };
  const empleadoUser = {
    nombre: 'Tester',
    apellido: 'Empleado',
    nombre_usuario: `empleado_${stamp}@correo.com`,
    contrasenia: 'Test1234!',
    tipo_usuario: 'empleado', // <- este rol está habilitado para POST /api/salones
  };

  await register(clienteUser);
  await register(empleadoUser);

  title('2) Login de ambos');
  const tokenCliente = await login({ nombre_usuario: clienteUser.nombre_usuario, contrasenia: clienteUser.contrasenia });
  const tokenEmpleado = await login({ nombre_usuario: empleadoUser.nombre_usuario, contrasenia: empleadoUser.contrasenia });

  const authCliente = tokenCliente ? { Authorization: `Bearer ${tokenCliente}` } : {};
  const authEmpleado = tokenEmpleado ? { Authorization: `Bearer ${tokenEmpleado}` } : {};

  title('3) Listados permitidos para "cliente"');
  if (tokenCliente) {
    await get('/api/salones', authCliente);
    await get('/api/servicios', authCliente);
    await get('/api/turnos', authCliente);
  }

  title('4) Intento de crear salón con rol "cliente" (DEBE dar 403)');
  if (tokenCliente) {
    await post('/api/salones', {
      titulo: 'No debería poder',
      direccion: 'Calle Falsa 123',
      capacidad: 10,
      importe: 1000,
    }, authCliente);
  }

  title('5) Intento de crear salón con rol "empleado" pero con DATOS INVALIDOS (DEBE dar 400 con errores de express-validator)');
  if (tokenEmpleado) {
    await post('/api/salones', {
      titulo: '',                   // vacío -> notEmpty
      direccion: '   ',             // solo espacios -> notEmpty + trim
      capacidad: -5,                // inválido -> min:1
      importe: -10,                 // inválido -> min:0
      latitud: 'ochenta',           // inválido -> float
      longitud: 'ciento veinte',    // inválido -> float
    }, authEmpleado);
  }

  title('6) Intento de crear salón con rol "empleado" y DATOS VALIDOS (DEBE dar 201/200)');
  if (tokenEmpleado) {
    await post('/api/salones', {
      titulo: 'Salon de Prueba ' + stamp,
      direccion: 'Av. Siempreviva 742',
      capacidad: 120,
      importe: 250000,
      latitud: -31.4167,    // opcional
      longitud: -64.1833,   // opcional
    }, authEmpleado);
  }

  console.log('\n✅ Fin de pruebas de roles y validaciones.\n');
}

main();
