const contenedorSolicitudes = document.getElementById("listaSolicitudes");
const modoOrientador = document.body.classList.contains("orientador-body");
const sesionSolicitudes = obtenerSesion();

function escaparHtml(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function solicitudDisponible(solicitud) {
    return !solicitud.orientador && ["PENDIENTE", "REPROGRAMADA"].includes(solicitud.estado);
}

function solicitudesVisibles() {
    return obtenerSolicitudes().filter(function (solicitud) {
        if (modoOrientador) return solicitud.orientador === sesionSolicitudes?.correo || solicitudDisponible(solicitud);
        return solicitud.correo === sesionSolicitudes?.correo;
    });
}

function comparacionHtml(solicitud) {
    if (!Array.isArray(solicitud.ofertasComparadas) || solicitud.ofertasComparadas.length < 2) return "";
    return `<details><summary>Ofertas comparadas</summary><ul>${solicitud.ofertasComparadas.map(function (item) { return `<li>${escaparHtml(item.carrera)} · ${escaparHtml(item.institucion)}</li>`; }).join("")}</ul></details>`;
}

function renderizarSolicitudes() {
    const solicitudes = solicitudesVisibles();
    if (!solicitudes.length) {
        contenedorSolicitudes.innerHTML = '<div class="estado-vacio"><h2>Sin solicitudes</h2><p>No hay solicitudes disponibles.</p></div>';
        return;
    }

    contenedorSolicitudes.innerHTML = solicitudes.map(function (solicitud) {
        const estado = escaparHtml(solicitud.estado);
        let acciones = "";
        if (modoOrientador) {
            acciones = solicitud.orientador
                ? `<a class="boton boton-primario" href="solicitud-detalle.html?id=${solicitud.id}">Gestionar</a>`
                : `<button class="boton boton-primario tomar-solicitud" data-id="${solicitud.id}">Tomar solicitud</button>`;
        } else if (!["CANCELADA", "ATENDIDA"].includes(solicitud.estado)) {
            acciones = `<div class="acciones-solicitud"><input class="campo fecha-reprogramacion" type="date" aria-label="Nueva fecha"><small class="mensaje-error error-reprogramacion"></small><button class="boton boton-secundario reprogramar-solicitud" data-id="${solicitud.id}">Solicitar reprogramación</button><button class="boton boton-peligro cancelar-solicitud" data-id="${solicitud.id}">Cancelar</button></div>`;
        }
        const resultado = solicitud.resultado ? `<p><strong>Resultado:</strong> ${escaparHtml(solicitud.resultado)}</p>` : "";
        const observacion = solicitud.observacion ? `<p><strong>Observaciones:</strong> ${escaparHtml(solicitud.observacion)}</p>` : "";
        const asignacion = solicitud.orientador ? `<p><strong>Orientador:</strong> ${escaparHtml(solicitud.orientador)}</p>` : "";
        const historial = Array.isArray(solicitud.historial) && solicitud.historial.length
            ? `<details><summary>Historial de cambios</summary><ul>${solicitud.historial.map(function (cambio) { return `<li>${escaparHtml(cambio.estado)} · ${new Date(cambio.fecha).toLocaleString("es-CL")}</li>`; }).join("")}</ul></details>`
            : "";
        return `<article class="tarjeta solicitud-card"><div><span class="badge estado-${estado.toLowerCase()}">${estado}</span><h2>${escaparHtml(solicitud.oferta)}</h2><p><strong>Fecha:</strong> ${escaparHtml(solicitud.fecha)}</p><p><strong>Motivo:</strong> ${escaparHtml(solicitud.motivo)}</p>${asignacion}${resultado}${observacion}${comparacionHtml(solicitud)}${historial}</div>${acciones}</article>`;
    }).join("");

    document.querySelectorAll(".tomar-solicitud").forEach(function (boton) {
        boton.addEventListener("click", function () {
            actualizarSolicitud(Number(boton.dataset.id), { orientador: sesionSolicitudes.correo });
            renderizarSolicitudes();
        });
    });

    document.querySelectorAll(".cancelar-solicitud").forEach(function (boton) {
        boton.addEventListener("click", function () {
            actualizarSolicitud(Number(boton.dataset.id), { estado: "CANCELADA" });
            crearNotificacion(sesionSolicitudes.correo, "Tu solicitud fue cancelada.");
            renderizarSolicitudes();
        });
    });

    document.querySelectorAll(".reprogramar-solicitud").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const contenedor = boton.parentElement;
            const campo = contenedor.querySelector("input");
            const error = contenedor.querySelector(".error-reprogramacion");
            const hoy = new Date().toISOString().slice(0, 10);
            error.textContent = "";
            if (!campo.value || campo.value < hoy) {
                error.textContent = "Selecciona una fecha desde hoy en adelante.";
                return;
            }
            actualizarSolicitud(Number(boton.dataset.id), { estado: "REPROGRAMADA", fecha: campo.value });
            crearNotificacion(sesionSolicitudes.correo, `Reprogramación solicitada para ${campo.value}.`);
            renderizarSolicitudes();
        });
    });
}

renderizarSolicitudes();
