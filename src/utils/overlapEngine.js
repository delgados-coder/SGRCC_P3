// src/utils/overlapEngine.js
// Reglas de solapamiento entre turnos: intersectan si NOT (fin <= desde || hasta <= inicio)

function intersecta(aDesde, aHasta, bDesde, bHasta) {
    return !(aHasta <= bDesde || bHasta <= aDesde);
}

/**
 * Valida si el nuevo turno (hora_desde/hora_hasta) solapa con alguno existente.
 * @param {Array<{hora_desde:string,hora_hasta:string,reserva_id:number}>} turnosExistentes  HH:MM:SS
 * @param {{hora_desde:string,hora_hasta:string}} turnoNuevo
 */
function haySolapeTurnos(turnosExistentes, turnoNuevo) {
    const { hora_desde: nd, hora_hasta: nh } = turnoNuevo;
    return turnosExistentes.some(t => intersecta(nd, nh, t.hora_desde, t.hora_hasta));
}

module.exports = { intersecta, haySolapeTurnos };
