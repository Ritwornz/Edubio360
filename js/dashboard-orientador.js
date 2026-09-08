function actualizarPanelOrientador() {
    const sesionPanelOrientador = obtenerSesion();
    const todasSolicitudes = obtenerSolicitudes();
    const solicitudesOrientador = todasSolicitudes.filter(function (solicitud) { return solicitud.orientador === sesionPanelOrientador?.correo; });
    const disponiblesOrientador = todasSolicitudes.filter(function (solicitud) { return !solicitud.orientador && ["PENDIENTE", "REPROGRAMADA"].includes(solicitud.estado); }).length;
    const contarEstado = function (estado) { return solicitudesOrientador.filter(function (solicitud) { return solicitud.estado === estado; }).length; };
    document.getElementById("disponibles").textContent = disponiblesOrientador;
    document.getElementById("pendientes").textContent = contarEstado("PENDIENTE");
    document.getElementById("aceptadas").textContent = contarEstado("ACEPTADA");
    document.getElementById("proximas").textContent = solicitudesOrientador.filter(function (solicitud) { return ["ACEPTADA", "REPROGRAMADA"].includes(solicitud.estado) && solicitud.fecha >= fechaLocalHoy(); }).length;
    document.getElementById("atendidas").textContent = contarEstado("ATENDIDA");
}
actualizarPanelOrientador();
observarOrientaciones(actualizarPanelOrientador);
Object.entries({ disponibles: "solicitudes.html?vista=disponibles", pendientes: "solicitudes.html?estado=PENDIENTE", aceptadas: "solicitudes.html?estado=ACEPTADA", proximas: "solicitudes.html?vista=proximas", atendidas: "historial.html" }).forEach(function ([id, destino]) { enlazarEstadistica(id, destino); });
