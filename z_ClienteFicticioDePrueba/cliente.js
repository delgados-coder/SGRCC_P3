// Cliente de consola para probar rápidamente la API (login + endpoints básicos)
// Ejecutar con: `npm run client`

const axios = require('axios');
const env = require('../src/config/env.config.js');

const BASE_URL = (env && env.CLIENT_BASE_URL) || `http://localhost:${env?.PORT || 3000}`;

const logTitle = (title) => {
    console.log('\n' + '='.repeat(80));
    console.log(title);
    console.log('='.repeat(80));
};

const pretty = (obj) => JSON.stringify(obj, null, 2);

async function refreshAccessToken(refreshToken) {
    const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
    return res.data.accessToken;
}

async function logout(refreshToken) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/logout`, { refreshToken });
        console.log(`Status: ${res.status}`, pretty(res.data));
    } catch (err) {
        if (err.response) {
            console.log(`Status: ${err.response.status}`, pretty(err.response.data));
        } else {
            console.error(err.message);
        }
    }
}

async function main() {
    try {
        logTitle('1) Registro de usuario cliente (random)');
        const random = Date.now();
        const nuevoUsuario = {
            nombre: 'Test',
            apellido: 'Console',
            nombre_usuario: `test_${random}@correo.com`,
            contrasenia: 'Test1234!',
            tipo_usuario: 'cliente',
            celular: '3810000000',
            foto: null,
        };

        // Registrar
        let res = await axios.post(`${BASE_URL}/auth/register`, nuevoUsuario);
        console.log(`Status: ${res.status}`, pretty(res.data));

        // Login
        logTitle('2) Login del usuario recién creado');
        res = await axios.post(`${BASE_URL}/auth/login`, {
            nombre_usuario: nuevoUsuario.nombre_usuario,
            contrasenia: nuevoUsuario.contrasenia,
        });
        console.log(`Status: ${res.status}`, pretty(res.data));

        // El backend devuelve { accessToken, refreshToken }
        let accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        let auth = { headers: { Authorization: `Bearer ${accessToken}` } };

        // Endpoints protegidos accesibles para rol "cliente"
        logTitle('3) GET /api/salones (cliente puede listar)');
        res = await axios.get(`${BASE_URL}/api/salones`, auth);
        console.log(`Status: ${res.status}`, pretty(res.data));

        logTitle('4) GET /api/servicios (cliente puede listar)');
        res = await axios.get(`${BASE_URL}/api/servicios`, auth);
        console.log(`Status: ${res.status}`, pretty(res.data));

        logTitle('5) GET /api/turnos (cliente puede listar)');
        res = await axios.get(`${BASE_URL}/api/turnos`, auth);
        console.log(`Status: ${res.status}`, pretty(res.data));

        // Listado de reservas (según permisos/datos)
        logTitle('6) GET /api/reservas (cliente puede listar si está permitido)');
        try {
            res = await axios.get(`${BASE_URL}/api/reservas`, auth);
            console.log(`Status: ${res.status}`, pretty(res.data));
        } catch (err) {
            if (err.response) {
                console.log(`Status: ${err.response.status}`, pretty(err.response.data));
            } else {
                console.error(err.message);
            }
        }

        // Intento de acción no permitida (debería dar 403)
        logTitle('7) POST /api/salones (cliente NO debería poder crear -> 403)');
        try {
            res = await axios.post(
                `${BASE_URL}/api/salones`,
                {
                    titulo: 'Salon bloqueado',
                    direccion: 'Calle Falsa 123',
                    capacidad: 50,
                    importe: 100000,
                },
                auth
            );
            console.log(`Status: ${res.status}`, pretty(res.data));
        } catch (err) {
            if (err.response) {
                console.log(`Status: ${err.response.status}`, pretty(err.response.data));
            } else {
                console.error(err.message);
            }
        }

        // Demostración de refresh de token y reintento de endpoint protegido
        logTitle('8) /auth/refresh -> obtener nuevo accessToken y volver a consumir un endpoint protegido');
        try {
            accessToken = await refreshAccessToken(refreshToken);
            auth = { headers: { Authorization: `Bearer ${accessToken}` } };

            // Reintento de un endpoint protegido usando el nuevo accessToken
            res = await axios.get(`${BASE_URL}/api/salones`, auth);
            console.log(`Status: ${res.status}`, pretty(res.data));
        } catch (err) {
            if (err.response) {
                console.log(`Status: ${err.response.status}`, pretty(err.response.data));
            } else {
                console.error(err.message);
            }
        }

        // Cierre de sesión (invalida el refresh token en el servidor)
        logTitle('9) /auth/logout -> invalidar refreshToken');
        await logout(refreshToken);

        console.log('\nListo ✅ — El cliente de prueba terminó.\n');
    } catch (err) {
        if (err.response) {
            console.error(`Error HTTP ${err.response.status}:`, pretty(err.response.data));
        } else {
            console.error(err);
        }
        process.exit(1);
    }
}

main();