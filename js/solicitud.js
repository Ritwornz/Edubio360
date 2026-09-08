const formSolicitud = document.getElementById("formSolicitud");
const selectOferta = document.getElementById("oferta");
const mensajeSolicitud = document.getElementById("mensajeSolicitud");
const sesionSolicitud = obtenerSesion();
const parametrosSolicitud = new URLSearchParams(window.location.search);
const idsComparacion = String(parametrosSolicitud.get("comparacion") || "").split(",").map(Number).filter(function (id) {
    return Number.isInteger(id) && ofertas.some(function (oferta) { return oferta.id === id; });
});
const ofertasComparadas = idsComparacion.map(function (id) {
    return ofertas.find(function (oferta) { return oferta.id === id; });
}).filter(Boolean);

ofertas.forEach(function (oferta) {
    const opcion = document.createElement("option");
    opcion.value = oferta.id;
    opcion.textContent = `${oferta.grupoComparacion} · ${oferta.institucion} · ${oferta.sede}`;
    selectOferta.appendChild(opcion);
});

const ofertaInicial = parametrosSolicitud.get("oferta");
if (ofertasComparadas.length) selectOferta.value = String(ofertasComparadas[0].id);
else if (ofertaInicial && ofertas.some(function (oferta) { return oferta.id === Number(ofertaInicial); })) selectOferta.value = ofertaInicial;

if (sesionSolicitud) {
    document.getElementById("correoSolicitud").value = sesionSolicitud.correo;
    document.getElementById("correoSolicitud").readOnly = true;
    document.getElementById("nombreSolicitud").value = sesionSolicitud.nombre;
}

if (ofertasComparadas.length >= 2) {
    const resumen = document.createElement("div");
    resumen.className = "tarjeta resumen-solicitud-comparada";
    resumen.innerHTML = `<strong>Comparación seleccionada</strong><ul>${ofertasComparadas.map(function (oferta) { return `<li>${oferta.carrera} · ${oferta.institucion}</li>`; }).join("")}</ul>`;
    formSolicitud.insertBefore(resumen, formSolicitud.firstElementChild);
}

function limpiarValidacion(campo) {
    const error = document.getElementById(campo.dataset.error);
    error.textContent = "";
    campo.removeAttribute("aria-invalid");
}

function marcarError(campo, mensaje) {
    const error = document.getElementById(campo.dataset.error);
    error.textContent = mensaje;
    campo.setAttribute("aria-invalid", "true");
}

formSolicitud.querySelectorAll("[data-error]").forEach(function (campo) {
    campo.addEventListener(campo.tagName === "SELECT" ? "change" : "input", function () {
        limpiarValidacion(campo);
        mensajeSolicitud.classList.add("oculto");
    });
});

formSolicitud.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const campos = [...formSolicitud.querySelectorAll("[data-error]")];
    let valido = true;

    campos.forEach(function (campo) {
        limpiarValidacion(campo);
        if (!campo.value.trim()) {
            marcarError(campo, "Este campo es obligatorio.");
            valido = false;
        }
    });

    const correo = document.getElementById("correoSolicitud");
    if (correo.value && !/^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|duocuc\.cl|gmail\.com)$/i.test(correo.value.trim())) {
        marcarError(correo, "Ingrese un correo permitido.");
        valido = false;
    }

    const fecha = document.getElementById("fechaPreferida");
    const hoy = new Date().toISOString().slice(0, 10);
    if (fecha.value && fecha.value < hoy) {
        marcarError(fecha, "Seleccione una fecha desde hoy en adelante.");
        valido = false;
    }

    if (!valido) {
        formSolicitud.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    const oferta = ofertas.find(function (item) { return item.id === Number(selectOferta.value); });
    const comparadas = ofertasComparadas.length >= 2 ? ofertasComparadas : [oferta];
    const solicitudes = obtenerSolicitudes();
    solicitudes.push({
        id: Date.now(),
        estudiante: document.getElementById("nombreSolicitud").value.trim(),
        correo: correo.value.trim().toLowerCase(),
        oferta: oferta.grupoComparacion,
        ofertaId: oferta.id,
        ofertasComparadas: comparadas.map(function (item) { return { id: item.id, carrera: item.carrera, institucion: item.institucion, sede: item.sede }; }),
        motivo: document.getElementById("motivo").value.trim(),
        fecha: fecha.value,
        estado: "PENDIENTE",
        observacion: "",
        resultado: "",
        orientador: "",
        historial: [{ estado: "PENDIENTE", fecha: new Date().toISOString() }]
    });
    guardarSolicitudes(solicitudes);
    mensajeSolicitud.classList.remove("oculto");
    setTimeout(function () { window.location.href = "estudiante/solicitudes.html"; }, 650);
});
