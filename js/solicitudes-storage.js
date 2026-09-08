const CLAVE_SOLICITUDES = "solicitudesOrientacion";

function obtenerSolicitudes() {
    try {
        const solicitudes = JSON.parse(localStorage.getItem(CLAVE_SOLICITUDES));
        return Array.isArray(solicitudes) ? solicitudes : [];
    } catch {
        return [];
    }
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes));
}

function buscarSolicitud(id) {
    return obtenerSolicitudes().find(function (solicitud) {
        return solicitud.id === id;
    });
}

function actualizarSolicitud(id, cambios) {
    const solicitudes = obtenerSolicitudes().map(function (solicitud) {
        if (solicitud.id !== id) return solicitud;
        const historial = Array.isArray(solicitud.historial) ? solicitud.historial : [];
        const cambioEstado = cambios.estado && cambios.estado !== solicitud.estado;
        return {
            ...solicitud,
            ...cambios,
            historial: cambioEstado ? [...historial, { estado: cambios.estado, fecha: new Date().toISOString() }] : historial
        };
    });
    guardarSolicitudes(solicitudes);
    return solicitudes.find(function (solicitud) { return solicitud.id === id; });
}

function obtenerNotificaciones(correo) {
    try {
        const todas = JSON.parse(localStorage.getItem("notificacionesEduBio")) || [];
        return todas.filter(function (notificacion) { return notificacion.correo === correo; });
    } catch {
        return [];
    }
}

function crearNotificacion(correo, texto) {
    let todas = [];
    try { todas = JSON.parse(localStorage.getItem("notificacionesEduBio")) || []; } catch {}
    todas.unshift({ id: Date.now(), correo, texto, fecha: new Date().toISOString(), leida: false });
    localStorage.setItem("notificacionesEduBio", JSON.stringify(todas));
}
