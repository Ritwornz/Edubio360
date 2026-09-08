const idSolicitud = Number(new URLSearchParams(window.location.search).get("id"));
const solicitud = buscarSolicitud(idSolicitud);
const detalleSolicitud = document.getElementById("detalleSolicitud");
const sesionDetalle = obtenerSesion();

function escaparHtml(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function ofertasComparadasHtml() {
    if (!Array.isArray(solicitud.ofertasComparadas) || solicitud.ofertasComparadas.length < 2) return "";
    return `<div class="grupo-formulario"><h2>Alternativas comparadas por el estudiante</h2><ul>${solicitud.ofertasComparadas.map(function (item) { return `<li><strong>${escaparHtml(item.carrera)}</strong> · ${escaparHtml(item.institucion)} · ${escaparHtml(item.sede)}</li>`; }).join("")}</ul></div>`;
}

if (!solicitud || solicitud.orientador !== sesionDetalle?.correo) {
    detalleSolicitud.innerHTML = '<div class="estado-vacio"><h2>Solicitud no disponible</h2><a class="boton boton-primario" href="solicitudes.html">Volver</a></div>';
} else {
    detalleSolicitud.innerHTML = `<div class="tarjeta formulario-tarjeta"><span class="badge">${escaparHtml(solicitud.estado)}</span><h1>${escaparHtml(solicitud.oferta)}</h1><p><strong>Estudiante:</strong> ${escaparHtml(solicitud.estudiante)}</p><p><strong>Correo:</strong> ${escaparHtml(solicitud.correo)}</p><p><strong>Motivo:</strong> ${escaparHtml(solicitud.motivo)}</p>${ofertasComparadasHtml()}<form id="formGestion"><div class="grupo-formulario"><label class="etiqueta" for="estado">Estado</label><select class="campo" id="estado"><option>PENDIENTE</option><option>ACEPTADA</option><option>REPROGRAMADA</option><option>CANCELADA</option><option>ATENDIDA</option></select></div><div class="grupo-formulario"><label class="etiqueta" for="fecha">Fecha</label><input class="campo" id="fecha" type="date"><small class="mensaje-error" id="errorFechaGestion"></small></div><div class="grupo-formulario"><label class="etiqueta" for="resultado">Resultado</label><textarea class="campo" id="resultado" maxlength="500"></textarea><small class="mensaje-error" id="errorResultado"></small></div><div class="grupo-formulario"><label class="etiqueta" for="observacion">Observaciones</label><textarea class="campo" id="observacion" maxlength="500"></textarea></div><button class="boton boton-primario" type="submit">Guardar cambios</button><p id="mensajeGestion" class="mensaje-exito oculto" role="status">Cambios guardados.</p></form></div>`;
    document.getElementById("estado").value = solicitud.estado;
    document.getElementById("fecha").value = solicitud.fecha;
    document.getElementById("resultado").value = solicitud.resultado || "";
    document.getElementById("observacion").value = solicitud.observacion || "";

    document.getElementById("formGestion").addEventListener("submit", function (evento) {
        evento.preventDefault();
        const estado = document.getElementById("estado").value;
        const fecha = document.getElementById("fecha").value;
        const resultado = document.getElementById("resultado").value.trim();
        const errorFecha = document.getElementById("errorFechaGestion");
        const errorResultado = document.getElementById("errorResultado");
        errorFecha.textContent = "";
        errorResultado.textContent = "";
        document.getElementById("fecha").removeAttribute("aria-invalid");
        document.getElementById("resultado").removeAttribute("aria-invalid");

        const hoy = new Date().toISOString().slice(0, 10);
        if (["ACEPTADA", "REPROGRAMADA"].includes(estado) && (!fecha || fecha < hoy)) {
            errorFecha.textContent = "Seleccione una fecha desde hoy en adelante.";
            document.getElementById("fecha").setAttribute("aria-invalid", "true");
            return;
        }
        if (estado === "ATENDIDA" && !resultado) {
            errorResultado.textContent = "Registre el resultado antes de marcar la solicitud como atendida.";
            document.getElementById("resultado").setAttribute("aria-invalid", "true");
            return;
        }

        actualizarSolicitud(idSolicitud, { estado, fecha, resultado, observacion: document.getElementById("observacion").value.trim() });
        crearNotificacion(solicitud.correo, `Tu solicitud fue ${estado.toLowerCase()}.`);
        document.getElementById("mensajeGestion").classList.remove("oculto");
    });
}
