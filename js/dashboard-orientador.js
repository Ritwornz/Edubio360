const sesionPanelOrientador = obtenerSesion();
const solicitudesOrientador = obtenerSolicitudes().filter(function (solicitud) { return solicitud.orientador === sesionPanelOrientador?.correo; });
const contarEstado = function (estado) { return solicitudesOrientador.filter(function (solicitud) { return solicitud.estado === estado; }).length; };
document.getElementById("pendientes").textContent = contarEstado("PENDIENTE");
document.getElementById("aceptadas").textContent = contarEstado("ACEPTADA");
document.getElementById("proximas").textContent = solicitudesOrientador.filter(function (solicitud) { return ["ACEPTADA", "REPROGRAMADA"].includes(solicitud.estado); }).length;
document.getElementById("atendidas").textContent = contarEstado("ATENDIDA");
