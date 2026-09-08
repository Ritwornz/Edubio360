const sesionNotificaciones = obtenerSesion();
const contenedorNotificaciones = document.getElementById("listaNotificaciones");


function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function renderizarNotificaciones() {
    const notificaciones = obtenerNotificaciones(sesionNotificaciones?.correo);
    const sinLeer = new URLSearchParams(window.location.search).get("vista") === "pendientes";
    const visibles = sinLeer ? notificaciones.filter(function (aviso) { return !aviso.leida; }) : notificaciones;
    contenedorNotificaciones.innerHTML = '<div class="panel-acciones"><a class="boton boton-claro" href="notificaciones.html">Todos los avisos</a><a class="boton boton-claro" href="notificaciones.html?vista=pendientes">Sin leer</a><button class="boton boton-secundario" id="marcarLeidas" type="button">Marcar como leídas</button></div>' +
        (visibles.length ? visibles.map(function (aviso) {
            return `<article class="tarjeta"><span class="badge">${aviso.leida ? "Leída" : "Nueva"}</span><p>${textoSeguro(aviso.texto)}</p><small>${new Date(aviso.fecha).toLocaleString("es-CL")}</small><p><a class="boton boton-claro" href="solicitudes.html${aviso.solicitudId ? "?id=" + Number(aviso.solicitudId) : ""}">Ver solicitud y estado</a></p></article>`;
        }).join("") : '<div class="estado-vacio"><h2>Sin notificaciones en esta vista</h2><p>Los avisos leídos siguen disponibles en Todos los avisos.</p></div>');
    document.getElementById("marcarLeidas").addEventListener("click", function () {
        marcarNotificacionesLeidas(sesionNotificaciones?.correo);
        mostrarConfirmacion("Notificaciones marcadas como leídas. Puedes volver a consultarlas en Todos los avisos.");
    });
}
renderizarNotificaciones();
observarOrientaciones(renderizarNotificaciones);
