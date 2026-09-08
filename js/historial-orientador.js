const sesionHistorialOrientador = obtenerSesion();
const contenedorHistorialOrientador = document.getElementById("listaHistorial");
function renderizarHistorial() {
    const atendidas = obtenerSolicitudes().filter(function (solicitud) {
        return solicitud.orientador === sesionHistorialOrientador?.correo && solicitud.estado === "ATENDIDA";
    });
    function seguro(valor) {
        const elemento = document.createElement("span");
        elemento.textContent = String(valor ?? "");
        return elemento.innerHTML;
    }
    contenedorHistorialOrientador.innerHTML = atendidas.length ? atendidas.map(function (solicitud) {
        return `<article class="tarjeta"><span class="badge">ATENDIDA</span><h2>${seguro(solicitud.oferta)}</h2><p><strong>Estudiante:</strong> ${seguro(solicitud.estudiante)}</p><p><strong>Fecha:</strong> ${seguro(solicitud.fecha)}</p><p><strong>Resultado:</strong> ${seguro(solicitud.resultado || "Sin resultado")}</p><p><strong>Observaciones:</strong> ${seguro(solicitud.observacion || "Sin observaciones")}</p></article>`;
    }).join("") : '<div class="estado-vacio"><h2>Sin historial</h2><p>Aún no tienes orientaciones atendidas.</p></div>';
}
renderizarHistorial();
observarOrientaciones(renderizarHistorial);
