const CLAVE_SOLICITUDES = "solicitudesOrientacion";
const CLAVE_NOTIFICACIONES = "notificacionesEduBio";
const ESTADOS_SOLICITUD = ["PENDIENTE", "ACEPTADA", "REPROGRAMADA", "CANCELADA", "ATENDIDA"];

function fechaLocalHoy() {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
}

function obtenerSolicitudes() {
    try {
        const solicitudes = JSON.parse(localStorage.getItem(CLAVE_SOLICITUDES));
        if (!Array.isArray(solicitudes)) return [];
        return solicitudes.map(function (solicitud) {
            return { ...solicitud, id: Number(solicitud.id), correo: normalizarCorreoUsuario(solicitud.correo), orientador: normalizarCorreoUsuario(solicitud.orientador), estado: String(solicitud.estado || "PENDIENTE").toUpperCase() };
        });
    } catch {
        return [];
    }
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes));
    window.dispatchEvent(new Event("orientaciones-actualizadas"));
}

function buscarSolicitud(id) {
    return obtenerSolicitudes().find(function (solicitud) { return solicitud.id === Number(id); });
}

function actualizarSolicitud(id, cambios) {
    const solicitudes = obtenerSolicitudes();
    const indice = solicitudes.findIndex(function (solicitud) { return solicitud.id === Number(id); });
    const actual = solicitudes[indice];
    const sesion = obtenerSesion();
    if (!actual || !sesion) return null;
    const tomar = sesion.rol === "ORIENTADOR" && !actual.orientador && ["PENDIENTE", "REPROGRAMADA"].includes(actual.estado) && cambios.orientador === sesion.correo && Object.keys(cambios).length === 1;
    const propia = sesion.rol === "ORIENTADOR" && actual.orientador === sesion.correo;
    const estudiante = sesion.rol === "ESTUDIANTE" && actual.correo === sesion.correo && ["CANCELADA", "REPROGRAMADA"].includes(cambios.estado) && Object.keys(cambios).every(function (clave) { return ["estado", "fecha"].includes(clave); });
    if (!tomar && !propia && !estudiante) return null;
    if (["CANCELADA", "ATENDIDA"].includes(actual.estado)) return null;
    const siguiente = { ...actual, ...cambios };
    if (!ESTADOS_SOLICITUD.includes(siguiente.estado)) return null;
    if (!tomar && ["ACEPTADA", "REPROGRAMADA"].includes(siguiente.estado) && (!/^\d{4}-\d{2}-\d{2}$/.test(siguiente.fecha) || siguiente.fecha < fechaLocalHoy())) return null;
    if (siguiente.estado === "ATENDIDA" && !String(siguiente.resultado || "").trim()) return null;
    const cambiado = ["estado", "fecha", "orientador", "resultado", "observacion"].some(function (campo) { return actual[campo] !== siguiente[campo]; });
    if (!cambiado) return actual;
    const fecha = new Date().toISOString();
    siguiente.historial = [...(Array.isArray(actual.historial) ? actual.historial : []), { estado: siguiente.estado, fecha, fechaOrientacion: siguiente.fecha, actor: sesion.correo, detalle: tomar ? "Orientador asignado" : "Solicitud actualizada" }];
    solicitudes[indice] = siguiente;
    guardarSolicitudes(solicitudes);
    const texto = tomar ? `Un orientador tomó tu solicitud de ${siguiente.oferta}.` : `Tu solicitud de ${siguiente.oferta} está ${siguiente.estado.toLowerCase()}. Fecha: ${siguiente.fecha || "por confirmar"}.`;
    crearNotificacion(siguiente.correo, texto, siguiente.id);
    return siguiente;
}

function obtenerTodasNotificaciones() {
    try {
        const todas = JSON.parse(localStorage.getItem(CLAVE_NOTIFICACIONES));
        return Array.isArray(todas) ? todas.map(function (notificacion) { return { ...notificacion, correo: normalizarCorreoUsuario(notificacion.correo) }; }) : [];
    } catch {
        return [];
    }
}

function guardarNotificaciones(notificaciones) {
    localStorage.setItem(CLAVE_NOTIFICACIONES, JSON.stringify(notificaciones));
    window.dispatchEvent(new Event("orientaciones-actualizadas"));
}

function obtenerNotificaciones(correo) {
    const normalizado = normalizarCorreoUsuario(correo);
    return normalizado ? obtenerTodasNotificaciones().filter(function (notificacion) { return notificacion.correo === normalizado; }) : [];
}

function crearNotificacion(correo, texto, solicitudId) {
    const todas = obtenerTodasNotificaciones();
    todas.unshift({ id: Date.now() + Math.random(), correo: normalizarCorreoUsuario(correo), texto, solicitudId, fecha: new Date().toISOString(), leida: false });
    guardarNotificaciones(todas);
}

function marcarNotificacionesLeidas(correo) {
    guardarNotificaciones(obtenerTodasNotificaciones().map(function (notificacion) {
        return notificacion.correo === normalizarCorreoUsuario(correo) ? { ...notificacion, leida: true } : notificacion;
    }));
}

function observarOrientaciones(actualizar) {
    window.addEventListener("orientaciones-actualizadas", actualizar);
    window.addEventListener("storage", function (evento) {
        if ([CLAVE_SOLICITUDES, CLAVE_NOTIFICACIONES, "usuariosEduBio", "ofertasEduBio", null].includes(evento.key)) actualizar();
    });
    window.addEventListener("focus", actualizar);
}

function actualizarAvisosEstudiante() {
    const sesion = obtenerSesion();
    if (sesion?.rol !== "ESTUDIANTE") return;
    const cantidad = obtenerNotificaciones(sesion.correo).filter(function (aviso) { return !aviso.leida; }).length;
    const lista = document.querySelector(".nav-links");
    if (!lista) return;
    let enlace = lista.querySelector('a[href$="notificaciones.html"]');
    if (!enlace) {
        const item = document.createElement("li");
        enlace = document.createElement("a");
        enlace.href = `${prefijoRaiz()}estudiante/notificaciones.html`;
        item.appendChild(enlace);
        lista.appendChild(item);
    }
    enlace.textContent = `Notificaciones (${cantidad})`;
    enlace.setAttribute("aria-live", "polite");
}

actualizarAvisosEstudiante();
observarOrientaciones(actualizarAvisosEstudiante);
