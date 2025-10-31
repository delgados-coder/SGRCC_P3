-- Procedimientos para métricas de reservas activas.
-- Ejecutar luego de crear la base: mysql -u <user> -p sgrcc_db < sql/stored_procedures.sql

-- Promedio del importe total de reservas activas.
DROP PROCEDURE IF EXISTS sp_media_importe_total;
DELIMITER $$
CREATE PROCEDURE sp_media_importe_total()
BEGIN
    SELECT AVG(IFNULL(importe_total, 0)) AS media
    FROM reservas
    WHERE activo = 1;
END$$
DELIMITER ;

-- Mediana del importe total en reservas activas.
DROP PROCEDURE IF EXISTS sp_mediana_importe_total;
DELIMITER $$
CREATE PROCEDURE sp_mediana_importe_total()
BEGIN
    DECLARE row_count INT;
    DECLARE median_val DECIMAL(10,2);

    SELECT COUNT(*) INTO row_count
    FROM reservas
    WHERE activo = 1;

    IF row_count = 0 THEN
        SET median_val = NULL;
    ELSEIF MOD(row_count, 2) = 1 THEN
        -- Número impar: se toma el valor central
        SELECT importe_total INTO median_val
        FROM reservas
        WHERE activo = 1
        ORDER BY importe_total
        LIMIT FLOOR(row_count / 2), 1;
    ELSE
        -- Número par: promedio entre los dos valores centrales
        SELECT AVG(sub.import_val) INTO median_val
        FROM (
            SELECT importe_total AS import_val
            FROM reservas
            WHERE activo = 1
            ORDER BY importe_total
            LIMIT row_count / 2 - 1, 2
        ) AS sub;
    END IF;

    SELECT median_val AS mediana;
END$$
DELIMITER ;

-- Moda del importe total en reservas activas (valor y frecuencia).
DROP PROCEDURE IF EXISTS sp_moda_importe_total;
DELIMITER $$
CREATE PROCEDURE sp_moda_importe_total()
BEGIN
    DECLARE mode_val DECIMAL(10,2);
    DECLARE freq INT;

    SELECT importe_total, COUNT(*)
    INTO mode_val, freq
    FROM reservas
    WHERE activo = 1
    GROUP BY importe_total
    ORDER BY COUNT(*) DESC, importe_total
    LIMIT 1;

    SELECT mode_val AS moda, freq AS frecuencia;
END$$
DELIMITER ;

-- Estadísticas de reservas por salón: media, mediana, moda y salón con mayor demanda.
DROP PROCEDURE IF EXISTS sp_estadisticas_reservas_salon;
DELIMITER $$
CREATE PROCEDURE sp_estadisticas_reservas_salon()
BEGIN
    -- Tabla temporal con total de reservas por salón
    DROP TEMPORARY TABLE IF EXISTS tmp_counts;
    CREATE TEMPORARY TABLE tmp_counts AS
        SELECT salon_id, COUNT(*) AS total_reservas
        FROM reservas
        WHERE activo = 1
        GROUP BY salon_id;

    DECLARE n INT;
    DECLARE media_val DECIMAL(10,2);
    DECLARE mediana_val DECIMAL(10,2);
    DECLARE moda_val INT;
    DECLARE salon_moda INT;

    SELECT AVG(total_reservas) INTO media_val
    FROM tmp_counts;

    SELECT COUNT(*) INTO n
    FROM tmp_counts;

    IF n = 0 THEN
        SET mediana_val = NULL;
    ELSEIF MOD(n, 2) = 1 THEN
        SELECT total_reservas INTO mediana_val
        FROM tmp_counts
        ORDER BY total_reservas
        LIMIT FLOOR(n / 2), 1;
    ELSE
        SELECT AVG(val) INTO mediana_val
        FROM (
            SELECT total_reservas AS val
            FROM tmp_counts
            ORDER BY total_reservas
            LIMIT n / 2 - 1, 2
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
END$$
DELIMITER ;