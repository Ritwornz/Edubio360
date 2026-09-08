const contenedorSolicitudes = document.getElementById("listaSolicitudes");
const modoOrientador = document.body.classList.contains("orientador-body");
const modoAdmin = document.body.dataset.rol === "ADMINISTRADOR";
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
    const parametros = new URLSearchParams(window.location.search);
    const filtro = parametros.get("estado");
    const vista = parametros.get("vista");
    const id = parametros.get("id");
    return obtenerSolicitudes().filter(function (solicitud) {
        const propia = modoAdmin || (modoOrientador ? solicitud.orientador === sesionSolicitudes?.correo : solicitud.correo === sesionSolicitudes?.correo);
        if (!propia && !(modoOrientador && solicitudDisponible(solicitud))) return false;
        if (id && solicitud.id !== Number(id)) return false;
        if (filtro && (!propia || solicitud.estado !== filtro)) return false;
        if (vista === "activas" && ["CANCELADA", "ATENDIDA"].includes(solicitud.estado)) return false;
        if (vista === "disponibles" && !solicitudDisponible(solicitud)) return false;
        if (vista === "proximas" && (!propia || !["ACEPTADA", "REPROGRAMADA"].includes(solicitud.estado) || solicitud.fecha < fechaLocalHoy())) return false;
        return true;
    }).sort(function (a, b) { return b.id - a.id; });
}

function comparacionHtml(solicitud) {
    if (!Array.isArray(solicitud.ofertasComparadas) || solicitud.ofertasComparadas.length < 1) return "";
    return `<details><summary>Ofertas de la solicitud</summary><ul>${solicitud.ofertasComparadas.map(function (item) { return `<li>${escaparHtml(item.carrera)} · ${escaparHtml(item.institucion)} · ${escaparHtml(item.sede)}</li>`; }).join("")}</ul></details>`;
}

function renderizarSolicitudes() {
    const solicitudes = solicitudesVisibles();
    let filtros = document.getElementById("filtrosSolicitudes");
    if (!filtros) {
        filtros = document.createElement("div");
        filtros.id = "filtrosSolicitudes";
        filtros.className = "panel-acciones";
        filtros.innerHTML = '<a class="boton boton-claro" href="solicitudes.html">Ver todas</a>' + ESTADOS_SOLICITUD.map(function (estado) { return `<a class="boton boton-claro" href="solicitudes.html?estado=${estado}">${estado}</a>`; }).join("");
        contenedorSolicitudes.before(filtros);
    }
    if (!solicitudes.length) {
        contenedorSolicitudes.innerHTML = '<div class="estado-vacio"><h2>Sin solicitudes</h2><p>No hay solicitudes que coincidan con esta vista. Puedes consultar todos los estados.</p></div>';
        return;
    }

    contenedorSolicitudes.innerHTML = solicitudes.map(function (solicitud) {
        const estado = escaparHtml(solicitud.estado);
        let acciones = "";
        if (modoOrientador) {
            acciones = solicitud.orientador
                ? `<a class="boton boton-primario" href="solicitud-detalle.html?id=${solicitud.id}">Ver detalle</a>`
                : `<button class="boton boton-primario tomar-solicitud" data-id="${solicitud.id}">Tomar solicitud</button>`;
        } else if (!modoAdmin && !["CANCELADA", "ATENDIDA"].includes(solicitud.estado)) {
            acciones = `<div class="acciones-solicitud"><input class="campo fecha-reprogramacion" type="date" aria-label="Nueva fecha"><small class="mensaje-error error-reprogramacion"></small><button class="boton boton-secundario reprogramar-solicitud" data-id="${solicitud.id}">Solicitar reprogramación</button><button class="boton boton-peligro cancelar-solicitud" data-id="${solicitud.id}">Cancelar</button></div>`;
        }
        const resultado = solicitud.resultado ? `<p><strong>Resultado:</strong> ${escaparHtml(solicitud.resultado)}</p>` : "";
        const observacion = solicitud.observacion ? `<p><strong>Observaciones:</strong> ${escaparHtml(solicitud.observacion)}</p>` : "";
        const asignacion = solicitud.orientador ? `<p><strong>Orientador:</strong> ${escaparHtml(solicitud.orientador)}</p>` : "";
        const historial = Array.isArray(solicitud.historial) && solicitud.historial.length
            ? `<details><summary>Historial de cambios</summary><ul>${solicitud.historial.map(function (cambio) { return `<li>${escaparHtml(cambio.estado)} · ${new Date(cambio.fecha).toLocaleString("es-CL")} ${escaparHtml(cambio.detalle || "")}</li>`; }).join("")}</ul></details>`
            : "";
        return `<article class="tarjeta solicitud-card"><div><span class="badge estado-${estado.toLowerCase()}">${estado}</span><h2>${escaparHtml(solicitud.oferta)}</h2>${modoAdmin || modoOrientador ? `<p><strong>Estudiante:</strong> ${escaparHtml(solicitud.estudiante)} · ${escaparHtml(solicitud.correo)}</p>` : ""}<p><strong>Fecha:</strong> ${escaparHtml(solicitud.fecha)}</p><p><strong>Motivo:</strong> ${escaparHtml(solicitud.motivo)}</p>${asignacion}${resultado}${observacion}${comparacionHtml(solicitud)}${historial}</div>${acciones}</article>`;
    }).join("");

    document.querySelectorAll(".tomar-solicitud").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const actualizada = actualizarSolicitud(Number(boton.dataset.id), { orientador: sesionSolicitudes.correo });
            renderizarSolicitudes();
            mostrarConfirmacion(actualizada ? "Solicitud asignada a tu cuenta. El estudiante recibió una notificación." : "La solicitud ya no está disponible. Revisa el listado actualizado.");
        });
    });

    document.querySelectorAll(".cancelar-solicitud").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const actualizada = actualizarSolicitud(Number(boton.dataset.id), { estado: "CANCELADA" });
            renderizarSolicitudes();
            mostrarConfirmacion(actualizada ? "Solicitud cancelada. Puedes consultarla en CANCELADA y en tus notificaciones." : "No fue posible cancelar: revisa el estado actualizado.");
        });
    });

    document.querySelectorAll(".reprogramar-solicitud").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const contenedor = boton.parentElement;
            const campo = contenedor.querySelector("input");
            const error = contenedor.querySelector(".error-reprogramacion");
            const hoy = fechaLocalHoy();
            error.textContent = "";
            if (!campo.value || campo.value < hoy) {
                error.textContent = "Selecciona una fecha desde hoy en adelante.";
                return;
            }
            const actualizada = actualizarSolicitud(Number(boton.dataset.id), { estado: "REPROGRAMADA", fecha: campo.value });
            renderizarSolicitudes();
            mostrarConfirmacion(actualizada ? "Reprogramación registrada. Consulta la nueva fecha en REPROGRAMADA." : "No fue posible reprogramar: revisa el estado actualizado.");
        });
    });
}

renderizarSolicitudes();
observarOrientaciones(renderizarSolicitudes);
