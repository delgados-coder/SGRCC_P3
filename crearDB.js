const mysql = require('mysql2');

const DB_connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  multipleStatements: false
});

const DB_NAME = 'sgrcc_db';
const crearDB = `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;`;

const usarDB = `USE \`${DB_NAME}\`;`;

const crearTablas = [
  `CREATE TABLE \`reservas\` (
  \`reserva_id\` int(11) NOT NULL,
  \`fecha_reserva\` date NOT NULL,
  \`salon_id\` int(11) NOT NULL,
  \`usuario_id\` int(11) NOT NULL,
  \`turno_id\` int(11) NOT NULL,
  \`foto_cumpleaniero\` varchar(255) DEFAULT NULL,
  \`tematica\` varchar(255) DEFAULT NULL,
  \`importe_salon\` decimal(10,2) DEFAULT NULL,
  \`importe_total\` decimal(10,2) DEFAULT NULL,
  \`activo\` tinyint(1) NOT NULL DEFAULT 1,
  \`creado\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`modificado\` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE \`reservas_servicios\` (
  \`reserva_servicio_id\` int(11) NOT NULL,
  \`reserva_id\` int(11) NOT NULL,
  \`servicio_id\` int(11) NOT NULL,
  \`importe\` decimal(10,2) NOT NULL,
  \`creado\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`modificado\` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE \`salones\` (
  \`salon_id\` int(11) NOT NULL,
  \`titulo\` varchar(255) NOT NULL,
  \`direccion\` varchar(255) NOT NULL,
  \`latitud\` decimal(10,8) DEFAULT NULL,
  \`longitud\` decimal(11,8) DEFAULT NULL,
  \`capacidad\` int(11) DEFAULT NULL,
  \`importe\` decimal(10,2) NOT NULL,
  \`activo\` tinyint(1) DEFAULT 1,
  \`creado\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`modificado\` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE \`servicios\` (
  \`servicio_id\` int(11) NOT NULL,
  \`descripcion\` varchar(255) NOT NULL,
  \`importe\` decimal(10,2) NOT NULL,
  \`activo\` tinyint(1) NOT NULL DEFAULT 1,
  \`creado\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`modificado\` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE \`turnos\` (
  \`turno_id\` int(11) NOT NULL,
  \`orden\` int(11) NOT NULL,
  \`hora_desde\` time NOT NULL,
  \`hora_hasta\` time NOT NULL,
  \`activo\` tinyint(1) NOT NULL DEFAULT 1,
  \`creado\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`modificado\` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE \`usuarios\` (
  \`usuario_id\` int(11) NOT NULL,
  \`nombre\` varchar(50) NOT NULL,
  \`apellido\` varchar(50) NOT NULL,
  \`nombre_usuario\` varchar(50) NOT NULL,
  \`contrasenia\` varchar(255) NOT NULL,
  \`tipo_usuario\` enum('cliente', 'empleado', 'administrador') NOT NULL,
  \`celular\` varchar(20) DEFAULT NULL,
  \`foto\` varchar(255) DEFAULT NULL,
  \`activo\` tinyint(1) NOT NULL DEFAULT 1,
  \`creado\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`modificado\` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

]

const insertarDatos = [
`INSERT INTO \`reservas\` (\`reserva_id\`, \`fecha_reserva\`, \`salon_id\`, \`usuario_id\`, \`turno_id\`, \`foto_cumpleaniero\`, \`tematica\`, \`importe_salon\`, \`importe_total\`, \`activo\`, \`creado\`, \`modificado\`) VALUES
(1, '2025-10-08', 1, 1, 1, NULL, 'Plim plim', NULL, 200000.00, 1, '2025-08-19 22:02:33', '2025-08-19 22:02:33'),
(2, '2025-10-08', 2, 1, 1, NULL, 'Messi', NULL, 100000.00, 1, '2025-08-19 22:03:45', '2025-08-19 22:03:45'),
(3, '2025-10-08', 2, 2, 1, NULL, 'Palermo', NULL, 500000.00, 1, '2025-08-19 22:03:45', '2025-08-19 22:03:45');`,

`INSERT INTO \`reservas_servicios\` (\`reserva_servicio_id\`, \`reserva_id\`, \`servicio_id\`, \`importe\`, \`creado\`, \`modificado\`) VALUES
(1, 1, 1, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(2, 1, 2, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(3, 1, 3, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(4, 1, 4, 50000.00, '2025-08-19 22:07:31', '2025-08-19 22:07:31'),
(5, 2, 1, 50000.00, '2025-08-19 22:08:08', '2025-08-19 22:08:08'),
(6, 2, 2, 50000.00, '2025-08-19 22:08:08', '2025-08-19 22:08:08'),
(7, 3, 1, 100000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(8, 3, 2, 100000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(9, 3, 3, 100000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17'),
(10, 3, 4, 200000.00, '2025-08-19 22:09:17', '2025-08-19 22:09:17');`,

  `INSERT INTO \`salones\` (\`salon_id\`, \`titulo\`, \`direccion\`, \`latitud\`, \`longitud\`, \`capacidad\`, \`importe\`, \`activo\`, \`creado\`, \`modificado\`) VALUES
(1, 'Principal', 'San Lorenzo 1000', NULL, NULL, 200, 95000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(2, 'Secundario', 'San Lorenzo 1000', NULL, NULL, 70, 7000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(3, 'Cancha Fútbol 5', 'Alberdi 300', NULL, NULL, 50, 150000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(4, 'Maquina de Jugar', 'Peru 50', NULL, NULL, 100, 95000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22'),
(5, 'Trampolín Play', 'Belgrano 100', NULL, NULL, 70, 200000.00, 1, '2025-08-19 21:51:22', '2025-08-19 21:51:22');`,

  `INSERT INTO \`servicios\` (\`servicio_id\`, \`descripcion\`, \`importe\`, \`activo\`, \`creado\`, \`modificado\`) VALUES
(1, 'Sonido', 15000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(2, 'Mesa dulce', 25000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(3, 'Tarjetas de invitación', 5000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(4, 'Mozos', 15000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(5, 'Sala de video juegos', 15000.00, 1, '2025-08-19 21:47:55', '2025-08-19 21:47:55'),
(6, 'Mago', 25000.00, 1, '2025-08-20 21:31:00', '2025-08-20 21:31:00'),
(7, 'Cabezones', 80000.00, 1, '2025-08-20 21:31:00', '2025-08-20 21:31:00'),
(8, 'Maquillaje infantil', 1000.00, 1, '2025-08-20 21:31:00', '2025-08-20 21:31:00');`,

  `INSERT INTO \`turnos\` (\`turno_id\`, \`orden\`, \`hora_desde\`, \`hora_hasta\`, \`activo\`, \`creado\`, \`modificado\`) VALUES
(1, 1, '12:00:00', '14:00:00', 1, '2025-08-19 21:44:19', '2025-08-19 21:44:19'),
(2, 2, '15:00:00', '17:00:00', 1, '2025-08-19 21:46:08', '2025-08-19 21:46:08'),
(3, 3, '18:00:00', '20:00:00', 1, '2025-08-19 21:46:08', '2025-08-19 21:46:08');`,

  `INSERT INTO \`usuarios\` (\`usuario_id\`, \`nombre\`, \`apellido\`, \`nombre_usuario\`, \`contrasenia\`, \`tipo_usuario\`, \`celular\`, \`foto\`, \`activo\`, \`creado\`, \`modificado\`) VALUES
(1, 'Alberto', 'López', 'alblop@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'administrador', NULL, NULL, 1, '2025-08-19 21:37:51', '2025-08-19 21:37:51'),
(2, 'Pamela', 'Gómez', 'pamgom@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'administrador', NULL, NULL, 1, '2025-08-19 21:39:45', '2025-08-19 21:39:45'),
(3, 'Esteban', 'Ciro', 'estcir@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'administrador', NULL, NULL, 0, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(4, 'Oscar', 'Ramirez', 'oscram@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'empleado', NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(5, 'Claudia', 'Juárez', 'clajua@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'empleado', NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(6, 'William', 'Corbalán', 'wilcor@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'cliente', NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(8, 'Anahí', 'Flores', 'anaflo@correo.com', '$2a$10$lN/EXu5eeLjhLq2ze/9b7uq/QTO5PM5lWF7fGaPKGM2cBzxMIqpom', 'cliente', NULL, NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(9, 'Juan', 'Diaz', 'JD@correo.com', '$2a$10$ar6LA6KGHp0Ic2FouDgFd.v30jeht5BKlnfbf5tCzcRSMvRKSqI6S', 'administrador', '3813664521', NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(10, 'Marcos', 'Spiridonoff', 'MS@correo.com', '$2a$10$NuTyZd9iKGUrwTzL0XAMNOrGOlf7CB/R0JhfmYgSgYELrgC774f2S', 'empleado', '3454541412', NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50'),
(11, 'Santiago', 'Pikachu', 'SP@correo.com', '$2a$10$2gvKJbG27RkNnEY5iX/v9usrhG1Tw5eKwLrLr0QS.hA0XwKqxt47a', 'cliente', '3735445011', NULL, 1, '2025-08-19 21:41:50', '2025-08-19 21:41:50');`
];

const alterTables = [
  `  ALTER TABLE \`reservas\`
  ADD PRIMARY KEY (\`reserva_id\`),
  ADD KEY \`reservas_fk2\` (\`salon_id\`),
  ADD KEY \`reservas_fk3\` (\`usuario_id\`),
  ADD KEY \`reservas_fk4\` (\`turno_id\`);`,

  `ALTER TABLE \`reservas_servicios\`
  ADD PRIMARY KEY (\`reserva_servicio_id\`),
  ADD KEY \`reservas_servicios_fk1\` (\`reserva_id\`),
  ADD KEY \`reservas_servicios_fk2\` (\`servicio_id\`);`,

  `ALTER TABLE \`salones\`
  ADD PRIMARY KEY (\`salon_id\`);`,

  `ALTER TABLE \`servicios\`
  ADD PRIMARY KEY (\`servicio_id\`);`,

  `ALTER TABLE \`turnos\`
  ADD PRIMARY KEY (\`turno_id\`);`,

  `ALTER TABLE \`usuarios\`
  ADD PRIMARY KEY (\`usuario_id\`),
  ADD UNIQUE KEY \`nombre_usuario\` (\`nombre_usuario\`);`,


  `ALTER TABLE \`reservas\`
  MODIFY \`reserva_id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;`,

  `ALTER TABLE \`reservas_servicios\`
  MODIFY \`reserva_servicio_id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;`,

  `ALTER TABLE \`salones\`
  MODIFY \`salon_id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;`,

  `ALTER TABLE \`servicios\`
  MODIFY \`servicio_id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;`,

  `ALTER TABLE \`turnos\`
  MODIFY \`turno_id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;`,

  `ALTER TABLE \`usuarios\`
  MODIFY \`usuario_id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;`,


  `ALTER TABLE \`reservas\`
  ADD CONSTRAINT \`reservas_fk2\` FOREIGN KEY (\`salon_id\`) REFERENCES \`salones\` (\`salon_id\`),
  ADD CONSTRAINT \`reservas_fk3\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\` (\`usuario_id\`),
  ADD CONSTRAINT \`reservas_fk4\` FOREIGN KEY (\`turno_id\`) REFERENCES \`turnos\` (\`turno_id\`);`,

  `ALTER TABLE \`reservas_servicios\`
  ADD CONSTRAINT \`reservas_servicios_fk1\` FOREIGN KEY (\`reserva_id\`) REFERENCES \`reservas\` (\`reserva_id\`),
  ADD CONSTRAINT \`reservas_servicios_fk2\` FOREIGN KEY (\`servicio_id\`) REFERENCES \`servicios\` (\`servicio_id\`);`,

  `COMMIT;`
];

const crearProcedimientos = [
  `DROP PROCEDURE IF EXISTS sp_media_importe_total`,
  `CREATE PROCEDURE sp_media_importe_total()
BEGIN
    SELECT AVG(importe_total) AS media
    FROM reservas
    WHERE activo = 1
      AND importe_total IS NOT NULL;
END`,

  `DROP PROCEDURE IF EXISTS sp_mediana_importe_total`,
  `CREATE PROCEDURE sp_mediana_importe_total()
BEGIN
    DECLARE row_count INT;
    DECLARE median_val DECIMAL(10,2);
    DECLARE offset_idx INT;

    SELECT COUNT(*) INTO row_count
    FROM reservas
    WHERE activo = 1
      AND importe_total IS NOT NULL;

    IF row_count = 0 THEN
        SET median_val = NULL;
    ELSEIF MOD(row_count, 2) = 1 THEN
        SET offset_idx = FLOOR(row_count / 2);
        SELECT importe_total INTO median_val
        FROM reservas
        WHERE activo = 1
          AND importe_total IS NOT NULL
        ORDER BY importe_total
        LIMIT offset_idx, 1;
    ELSE
        SET offset_idx = row_count / 2 - 1;
        SELECT AVG(sub.import_val) INTO median_val
        FROM (
            SELECT importe_total AS import_val
            FROM reservas
            WHERE activo = 1
              AND importe_total IS NOT NULL
            ORDER BY importe_total
            LIMIT offset_idx, 2
        ) AS sub;
    END IF;

    SELECT median_val AS mediana;
END`,

  `DROP PROCEDURE IF EXISTS sp_moda_importe_total`,
  `CREATE PROCEDURE sp_moda_importe_total()
BEGIN
    DECLARE mode_val DECIMAL(10,2);
    DECLARE freq INT;

    SELECT importe_total, COUNT(*)
    INTO mode_val, freq
    FROM reservas
    WHERE activo = 1
      AND importe_total IS NOT NULL
    GROUP BY importe_total
    ORDER BY COUNT(*) DESC, importe_total
    LIMIT 1;

    SELECT mode_val AS moda, freq AS frecuencia;
END`,

  `DROP PROCEDURE IF EXISTS sp_estadisticas_reservas_salon`,
  `CREATE PROCEDURE sp_estadisticas_reservas_salon()
BEGIN
    DECLARE n INT;
    DECLARE media_val DECIMAL(10,2);
    DECLARE mediana_val DECIMAL(10,2);
    DECLARE moda_val INT;
    DECLARE salon_moda INT;
  DECLARE offset_idx INT;

  DROP TEMPORARY TABLE IF EXISTS tmp_counts;
  CREATE TEMPORARY TABLE tmp_counts AS
    SELECT salon_id, COUNT(*) AS total_reservas
    FROM reservas
    WHERE activo = 1
    GROUP BY salon_id;

    SELECT AVG(total_reservas) INTO media_val
    FROM tmp_counts;

    SELECT COUNT(*) INTO n
    FROM tmp_counts;

    IF n = 0 THEN
        SET mediana_val = NULL;
  ELSEIF MOD(n, 2) = 1 THEN
    SET offset_idx = FLOOR(n / 2);
    SELECT total_reservas INTO mediana_val
        FROM tmp_counts
        ORDER BY total_reservas
    LIMIT offset_idx, 1;
    ELSE
    SET offset_idx = n / 2 - 1;
    SELECT AVG(val) INTO mediana_val
        FROM (
            SELECT total_reservas AS val
            FROM tmp_counts
            ORDER BY total_reservas
      LIMIT offset_idx, 2
        ) AS tmp;
    END IF;

    SELECT total_reservas, salon_id
    INTO moda_val, salon_moda
    FROM tmp_counts
    ORDER BY total_reservas DESC, salon_id
    LIMIT 1;

    DROP TEMPORARY TABLE IF EXISTS tmp_counts;

    SELECT media_val AS media,
           mediana_val AS mediana,
           moda_val AS moda,
           salon_moda AS salon_id;
END`
];

DB_connection.query(crearDB, (err) => {
  if (err) {
    console.error('No se puede crear la base de datos:', err);
    DB_connection.end();
    return;
  }
  console.log('Base de datos creada o ya existente.');

  DB_connection.query(usarDB, function (useErr) {
    if (useErr) {
      console.error('No se puede seleccionar la base de datos:', useErr);
      DB_connection.end();
      return;
    }
    console.log('Conectado a la base de datos.');

    crearTablas.forEach((tablaQuery) => {
      DB_connection.query(tablaQuery, (tablaErr) => {
        if (tablaErr) {
          console.error('Error creando tabla:', tablaErr.sqlMessage || tablaErr.message);
        } else {
          console.log('Tabla creada correctamente.');
        }
      });
    });

    insertarDatos.forEach((insertQuery) => {
      DB_connection.query(insertQuery, (insertErr) => {
        if (insertErr) {
          console.error('Error insertando datos:', insertErr.sqlMessage || insertErr.message);
        } else {
          console.log('Datos insertados correctamente.');
        }
      });
    });

    alterTables.forEach((alterQuery) => {
      DB_connection.query(alterQuery, (alterErr) => {
        if (alterErr) {
          console.error('Error en ALTER:', alterErr.sqlMessage || alterErr.message);
        } else {
          console.log('ALTER ejecutado correctamente.');
        }
      });
    });

    crearProcedimientos.forEach((procQuery) => {
      DB_connection.query(procQuery, (procErr) => {
        if (procErr) {
          console.error('Error creando procedimiento:', procErr.sqlMessage || procErr.message);
        } else {
          console.log('Procedimiento creado correctamente.');
        }
      });
    });

    setTimeout(() => {
      DB_connection.end((endErr) => {
        if (endErr) {
          console.error('Error al cerrar la conexión:', endErr);
        } else {
          console.log('Conexión cerrada correctamente.');
        }
      });
    }, 1500);
  });
});