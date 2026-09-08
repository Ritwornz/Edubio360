const formOferta = document.getElementById("formOferta");
const codigo = document.getElementById("codigo");
const carrera = document.getElementById("carrera");
const institucion = document.getElementById("institucion");
const sede = document.getElementById("sede");
const area = document.getElementById("area");
const modalidad = document.getElementById("modalidad");
const jornada = document.getElementById("jornada");
const duracion = document.getElementById("duracion");
const matricula = document.getElementById("matricula");
const arancel = document.getElementById("arancel");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");
const mensajeOferta = document.getElementById("mensajeOferta");
const idEdicion = Number(new URLSearchParams(window.location.search).get("id"));
let ofertaEdicion = idEdicion ? buscarOferta(idEdicion) : null;

const camposOferta = [
    { campo: codigo, nombre: "El código", minimo: 3 },
    { campo: carrera, nombre: "La carrera", maximo: 100 },
    { campo: institucion, nombre: "La institución", maximo: 150 },
    { campo: sede, nombre: "La sede", maximo: 100 },
    { campo: area, nombre: "El área" },
    { campo: modalidad, nombre: "La modalidad" },
    { campo: jornada, nombre: "La jornada" },
    { campo: duracion, nombre: "La duración", maximo: 50 },
    { campo: matricula, nombre: "La matrícula", numerico: true },
    { campo: arancel, nombre: "El arancel", numerico: true },
    { campo: descripcion, nombre: "La descripción", maximo: 500, requerido: false }
];

function obtenerError(item) {
    const id = `error${item.campo.id.charAt(0).toUpperCase()}${item.campo.id.slice(1)}`;
    let error = document.getElementById(id);
    if (!error) {
        error = document.createElement("small");
        error.id = id;
        error.className = "mensaje-error";
        item.campo.insertAdjacentElement("afterend", error);
    }
    error.setAttribute("role", "alert");
    item.campo.setAttribute("aria-describedby", id);
    item.error = error;
}

camposOferta.forEach(obtenerError);

function validarCampoOferta(item) {
    const valor = item.campo.value.trim();
    item.campo.removeAttribute("aria-invalid");
    item.error.textContent = "";

    if (item.requerido !== false && !valor) item.error.textContent = `${item.nombre} es un campo obligatorio.`;
    else if (valor && item.minimo && valor.length < item.minimo) item.error.textContent = `${item.nombre} debe tener al menos ${item.minimo} caracteres.`;
    else if (valor && item.maximo && valor.length > item.maximo) item.error.textContent = `${item.nombre} no puede superar los ${item.maximo} caracteres.`;
    else if (valor && item.numerico && (!Number.isFinite(Number(valor)) || Number(valor) < 0)) item.error.textContent = `${item.nombre} debe ser un valor igual o mayor que cero.`;

    if (item.error.textContent) {
        item.campo.setAttribute("aria-invalid", "true");
        return false;
    }
    return true;
}

function validarOferta() {
    let valido = true;
    mensajeOferta.classList.add("oculto");
    camposOferta.forEach(function (item) {
        if (!validarCampoOferta(item)) valido = false;
    });
    if (!valido) formOferta.querySelector('[aria-invalid="true"]')?.focus();
    return valido;
}

function imagenPredeterminada(valorArea) {
    const clave = String(valorArea || "").toLowerCase();
    if (clave.includes("salud")) return "img/ofertas/enfermeria.jpg";
    if (clave.includes("administr")) return "img/ofertas/ingenieria-administracion.jpg";
    if (clave.includes("social")) return "img/ofertas/trabajo-social.jpg";
    return "img/ofertas/ingenieria-informatica.jpg";
}

function rutaImagenParaAdmin(ruta) {
    return ruta.startsWith("img/") ? ruta : ruta;
}

function guardarConImagen(imagenGuardada) {
    const lista = obtenerOfertas();
    const datos = {
        codigo: codigo.value.trim(),
        carrera: carrera.value.trim(),
        grupoComparacion: ofertaEdicion?.grupoComparacion || carrera.value.trim(),
        institucion: institucion.value.trim(),
        sede: sede.value.trim(),
        area: area.value,
        modalidad: modalidad.value,
        jornada: jornada.value,
        duracion: duracion.value.trim(),
        matricula: Number(matricula.value),
        arancel: Number(arancel.value),
        descripcion: descripcion.value.trim(),
        imagen: imagenGuardada
    };

    if (ofertaEdicion) {
        const indice = lista.findIndex(function (oferta) { return oferta.id === ofertaEdicion.id; });
        lista[indice] = { ...lista[indice], ...datos };
        mensajeOferta.textContent = "Oferta actualizada correctamente.";
    } else {
        const id = lista.reduce(function (maximo, oferta) { return Math.max(maximo, oferta.id); }, 0) + 1;
        lista.push({ id, ...datos });
        mensajeOferta.textContent = "Oferta creada correctamente.";
    }

    guardarOfertas(lista);
    ofertas = lista;
    mensajeOferta.classList.remove("oculto");
    setTimeout(function () { window.location.href = "ofertas.html"; }, 500);
}

function guardarFormulario() {
    const rutaActual = ofertaEdicion?.imagen || imagenPredeterminada(area.value);
    if (!imagen?.files?.length) {
        guardarConImagen(rutaActual);
        return;
    }

    const archivo = imagen.files[0];
    if (!archivo.type.startsWith("image/")) {
        alert("Seleccione un archivo de imagen válido.");
        return;
    }

    const lector = new FileReader();
    lector.addEventListener("load", function () { guardarConImagen(String(lector.result)); });
    lector.readAsDataURL(archivo);
}

function cargarEdicion() {
    if (!idEdicion) return;
    if (!ofertaEdicion) {
        mensajeOferta.textContent = "La oferta solicitada no existe.";
        mensajeOferta.classList.remove("oculto");
        formOferta.querySelectorAll("input, select, textarea, button").forEach(function (control) { control.disabled = true; });
        return;
    }

    codigo.value = ofertaEdicion.codigo || "";
    carrera.value = ofertaEdicion.carrera || "";
    institucion.value = ofertaEdicion.institucion || "";
    sede.value = ofertaEdicion.sede || "";
    area.value = ofertaEdicion.area || "";
    modalidad.value = ofertaEdicion.modalidad || "";
    jornada.value = ofertaEdicion.jornada || "";
    duracion.value = ofertaEdicion.duracion || "";
    matricula.value = ofertaEdicion.matricula ?? "";
    arancel.value = ofertaEdicion.arancel ?? "";
    descripcion.value = ofertaEdicion.descripcion || "";
}

camposOferta.forEach(function (item) {
    item.campo.addEventListener(item.campo.tagName === "SELECT" ? "change" : "input", function () {
        mensajeOferta.classList.add("oculto");
        validarCampoOferta(item);
    });
});

formOferta.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (validarOferta()) guardarFormulario();
});

cargarEdicion();
