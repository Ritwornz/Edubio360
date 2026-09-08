function actualizarPanelAdmin() {
    const usuariosPanel = obtenerUsuarios();
    const solicitudesPanel = obtenerSolicitudes();
    const valoresPanel = {
        totalUsuarios: usuariosPanel.length,
        totalEstudiantes: usuariosPanel.filter(function (usuario) { return usuario.rol === "ESTUDIANTE"; }).length,
        totalOrientadores: usuariosPanel.filter(function (usuario) { return usuario.rol === "ORIENTADOR"; }).length,
        totalOfertas: obtenerOfertas().length,
        solicitudesPendientes: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "PENDIENTE"; }).length,
        solicitudesAceptadas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "ACEPTADA"; }).length,
        solicitudesAtendidas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "ATENDIDA"; }).length,
        solicitudesReprogramadas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "REPROGRAMADA"; }).length,
        solicitudesCanceladas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "CANCELADA"; }).length
    };
    Object.entries(valoresPanel).forEach(function ([id, valor]) {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
}
actualizarPanelAdmin();
observarOrientaciones(actualizarPanelAdmin);
Object.entries({
    totalUsuarios: "usuarios.html", totalEstudiantes: "usuarios.html?rol=ESTUDIANTE", totalOrientadores: "usuarios.html?rol=ORIENTADOR", totalOfertas: "ofertas.html",
    solicitudesPendientes: "solicitudes.html?estado=PENDIENTE", solicitudesAceptadas: "solicitudes.html?estado=ACEPTADA", solicitudesAtendidas: "solicitudes.html?estado=ATENDIDA", solicitudesCanceladas: "solicitudes.html?estado=CANCELADA",
    solicitudesReprogramadas: "solicitudes.html?estado=REPROGRAMADA"
}).forEach(function ([id, destino]) { enlazarEstadistica(id, destino); });
