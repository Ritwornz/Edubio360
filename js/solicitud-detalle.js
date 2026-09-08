const idSolicitud = Number(new URLSearchParams(window.location.search).get("id"));
const solicitud = buscarSolicitud(idSolicitud);
const detalleSolicitud = document.getElementById("detalleSolicitud");
const sesionDetalle = obtenerSesion();

function escaparHtml(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

if (!solicitud || solicitud.orientador !== sesionDetalle?.correo) {
    detalleSolicitud.innerHTML = '<div class="estado-vacio"><h2>Solicitud no disponible</h2><a class="boton boton-primario" href="solicitudes.html">Volver</a></div>';
} else {
    detalleSolicitud.innerHTML = `<div class="tarjeta formulario-tarjeta"><span class="badge">${escaparHtml(solicitud.estado)}</span><h1>${escaparHtml(solicitud.oferta)}</h1><p><strong>Estudiante:</strong> ${escaparHtml(solicitud.estudiante)}</p><p><strong>Correo:</strong> ${escaparHtml(solicitud.correo)}</p><p><strong>Motivo:</strong> ${escaparHtml(solicitud.motivo)}</p><form id="formGestion"><div class="grupo-formulario"><label class="etiqueta" for="estado">Estado</label><select class="campo" id="estado"><option>PENDIENTE</option><option>ACEPTADA</option><option>REPROGRAMADA</option><option>CANCELADA</option><option>ATENDIDA</option></select></div><div class="grupo-formulario"><label class="etiqueta" for="fecha">Fecha</label><input class="campo" id="fecha" type="date"></div><div class="grupo-formulario"><label class="etiqueta" for="resultado">Resultado</label><textarea class="campo" id="resultado" maxlength="500"></textarea></div><div class="grupo-formulario"><label class="etiqueta" for="observacion">Observaciones</label><textarea class="campo" id="observacion" maxlength="500"></textarea></div><button class="boton boton-primario" type="submit">Guardar cambios</button><p id="mensajeGestion" class="mensaje-exito oculto" role="status">Cambios guardados.</p></form></div>`;
    document.getElementById("estado").value = solicitud.estado;
    document.getElementById("fecha").value = solicitud.fecha;
    document.getElementById("resultado").value = solicitud.resultado || "";
    document.getElementById("observacion").value = solicitud.observacion || "";
    document.getElementById("formGestion").addEventListener("submit", function (evento) {
        evento.preventDefault();
        const estado = document.getElementById("estado").value;
        const resultado = document.getElementById("resultado").value.trim();
        if (estado === "ATENDIDA" && !resultado) {
            document.getElementById("resultado").setAttribute("aria-invalid", "true");
            return;
        }
        actualizarSolicitud(idSolicitud, {
            estado,
            fecha: document.getElementById("fecha").value,
            resultado,
            observacion: document.getElementById("observacion").value.trim()
        });
        crearNotificacion(solicitud.correo, `Tu solicitud fue ${estado.toLowerCase()}.`);
        document.getElementById("mensajeGestion").classList.remove("oculto");
    });
}
