const CLAVE_SOLICITUDES = "solicitudesOrientacion";
const CLAVE_NOTIFICACIONES = "notificacionesEduBio";

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
    return obtenerSolicitudes().find(function (solicitud) { return solicitud.id === Number(id); });
}

function actualizarSolicitud(id, cambios) {
    const solicitudes = obtenerSolicitudes().map(function (solicitud) {
        if (solicitud.id !== Number(id)) return solicitud;
        const historial = Array.isArray(solicitud.historial) ? solicitud.historial : [];
        const cambioEstado = cambios.estado && cambios.estado !== solicitud.estado;
        return { ...solicitud, ...cambios, historial: cambioEstado ? [...historial, { estado: cambios.estado, fecha: new Date().toISOString() }] : historial };
    });
    guardarSolicitudes(solicitudes);
    return solicitudes.find(function (solicitud) { return solicitud.id === Number(id); });
}

function obtenerTodasNotificaciones() {
    try {
        const todas = JSON.parse(localStorage.getItem(CLAVE_NOTIFICACIONES));
        return Array.isArray(todas) ? todas : [];
    } catch {
        return [];
    }
}

function guardarNotificaciones(notificaciones) {
    localStorage.setItem(CLAVE_NOTIFICACIONES, JSON.stringify(notificaciones));
}

function obtenerNotificaciones(correo) {
    return obtenerTodasNotificaciones().filter(function (notificacion) { return notificacion.correo === correo; });
}

function crearNotificacion(correo, texto) {
    const todas = obtenerTodasNotificaciones();
    todas.unshift({ id: Date.now() + Math.floor(Math.random() * 1000), correo, texto, fecha: new Date().toISOString(), leida: false });
    guardarNotificaciones(todas);
}

function marcarNotificacionesLeidas(correo) {
    guardarNotificaciones(obtenerTodasNotificaciones().map(function (notificacion) {
        return notificacion.correo === correo ? { ...notificacion, leida: true } : notificacion;
    }));
}
