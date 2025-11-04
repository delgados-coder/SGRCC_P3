// Cliente de consola para probar rápidamente la API (login + endpoints básicos)
// Ejecutar con: `npm run client`

const axios = require('axios');

const BASE_URL = process.env.CLIENT_BASE_URL || 'http://localhost:3003';

const logTitle = (title) => {
    console.log('\n' + '='.repeat(80));
    console.log(title);
    console.log('='.repeat(80));
};

const pretty = (obj) => JSON.stringify(obj, null, 2);

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
        const token = res.data.token;
        const auth = { headers: { Authorization: `Bearer ${token}` } };

        // Llamados protegidos que un "cliente" puede hacer
        logTitle('3) GET /api/salones (cliente puede listar)');
        res = await axios.get(`${BASE_URL}/api/salones`, auth);
        console.log(`Status: ${res.status}`, pretty(res.data));

        logTitle('4) GET /api/servicios (cliente puede listar)');
        res = await axios.get(`${BASE_URL}/api/servicios`, auth);
        console.log(`Status: ${res.status}`, pretty(res.data));

        logTitle('5) GET /api/turnos (cliente puede listar)');
        res = await axios.get(`${BASE_URL}/api/turnos`, auth);
        console.log(`Status: ${res.status}`, pretty(res.data));

        // Dependiendo de sus permisos / datos sembrados, el cliente puede listar reservas
        logTitle('6) GET /api/reservas (cliente puede listar)');
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

        // Ejemplo de intento de acción no permitida (debería dar 403 por rol)
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
