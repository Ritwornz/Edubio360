const usuariosPanel = obtenerUsuarios();
const solicitudesPanel = obtenerSolicitudes();
const valoresPanel = {
    totalUsuarios: usuariosPanel.length,
    totalEstudiantes: usuariosPanel.filter(function (usuario) { return usuario.rol === "ESTUDIANTE"; }).length,
    totalOrientadores: usuariosPanel.filter(function (usuario) { return usuario.rol === "ORIENTADOR"; }).length,
    totalOfertas: ofertas.length,
    solicitudesPendientes: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "PENDIENTE"; }).length,
    solicitudesAceptadas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "ACEPTADA"; }).length,
    solicitudesAtendidas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "ATENDIDA"; }).length,
    solicitudesCanceladas: solicitudesPanel.filter(function (solicitud) { return solicitud.estado === "CANCELADA"; }).length
};
Object.entries(valoresPanel).forEach(function ([id, valor]) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor;
});
