const sesionPanelEstudiante = obtenerSesion();
const solicitudesEstudiante = obtenerSolicitudes().filter(function (solicitud) { return solicitud.correo === sesionPanelEstudiante?.correo; });
document.getElementById("solicitudesActivas").textContent = solicitudesEstudiante.filter(function (solicitud) { return !["CANCELADA", "ATENDIDA"].includes(solicitud.estado); }).length;
document.getElementById("orientacionesTerminadas").textContent = solicitudesEstudiante.filter(function (solicitud) { return solicitud.estado === "ATENDIDA"; }).length;
document.getElementById("notificacionesPendientes").textContent = obtenerNotificaciones(sesionPanelEstudiante?.correo).filter(function (notificacion) { return !notificacion.leida; }).length;
