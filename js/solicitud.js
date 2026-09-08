const formSolicitud = document.getElementById("formSolicitud");
const selectOferta = document.getElementById("oferta");
const mensajeSolicitud = document.getElementById("mensajeSolicitud");
const sesionSolicitud = obtenerSesion();

ofertas.forEach(function (oferta) {
    const opcion = document.createElement("option");
    opcion.value = oferta.id;
    opcion.textContent = `${oferta.carrera} — ${oferta.sede}`;
    selectOferta.appendChild(opcion);
});

const ofertaInicial = new URLSearchParams(window.location.search).get("oferta");
if (ofertaInicial && ofertas.some(function (oferta) { return oferta.id === Number(ofertaInicial); })) {
    selectOferta.value = ofertaInicial;
}

if (sesionSolicitud) {
    document.getElementById("correoSolicitud").value = sesionSolicitud.correo;
    document.getElementById("correoSolicitud").readOnly = true;
    document.getElementById("nombreSolicitud").value = sesionSolicitud.nombre;
}

formSolicitud.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const campos = [...formSolicitud.querySelectorAll("[data-error]")];
    let valido = true;

    campos.forEach(function (campo) {
        const error = document.getElementById(campo.dataset.error);
        error.textContent = "";
        campo.removeAttribute("aria-invalid");
        if (!campo.value.trim()) {
            error.textContent = "Este campo es obligatorio.";
            campo.setAttribute("aria-invalid", "true");
            valido = false;
        }
    });

    const correo = document.getElementById("correoSolicitud");
    const errorCorreo = document.getElementById("errorCorreoSolicitud");
    const expresionCorreo = /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|duocuc\.cl|gmail\.com)$/i;
    if (correo.value && !expresionCorreo.test(correo.value.trim())) {
        errorCorreo.textContent = "Ingrese un correo permitido.";
        correo.setAttribute("aria-invalid", "true");
        valido = false;
    }

    const fecha = document.getElementById("fechaPreferida");
    const hoy = new Date().toISOString().slice(0, 10);
    if (fecha.value && fecha.value < hoy) {
        document.getElementById("errorFechaPreferida").textContent = "Seleccione una fecha desde hoy en adelante.";
        fecha.setAttribute("aria-invalid", "true");
        valido = false;
    }

    if (!valido) {
        formSolicitud.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    const oferta = ofertas.find(function (item) { return item.id === Number(selectOferta.value); });
    const solicitudes = obtenerSolicitudes();
    solicitudes.push({
        id: Date.now(),
        estudiante: document.getElementById("nombreSolicitud").value.trim(),
        correo: correo.value.trim(),
        oferta: oferta.carrera,
        ofertaId: oferta.id,
        motivo: document.getElementById("motivo").value.trim(),
        fecha: fecha.value,
        estado: "PENDIENTE",
        observacion: "",
        resultado: "",
        orientador: "",
        historial: [{ estado: "PENDIENTE", fecha: new Date().toISOString() }]
    });
    guardarSolicitudes(solicitudes);
    formSolicitud.reset();
    mensajeSolicitud.classList.remove("oculto");
});
