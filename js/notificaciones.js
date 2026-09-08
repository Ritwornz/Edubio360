const sesionNotificaciones = obtenerSesion();
const contenedorNotificaciones = document.getElementById("listaNotificaciones");
const notificaciones = obtenerNotificaciones(sesionNotificaciones?.correo);

function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

contenedorNotificaciones.innerHTML = notificaciones.length
    ? notificaciones.map(function (notificacion) {
        return `<article class="tarjeta"><p>${textoSeguro(notificacion.texto)}</p><small>${new Date(notificacion.fecha).toLocaleString("es-CL")}</small></article>`;
    }).join("")
    : '<div class="estado-vacio"><h2>Sin notificaciones</h2></div>';
