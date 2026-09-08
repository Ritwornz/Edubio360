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

const mensajeOferta = document.getElementById("mensajeOferta");

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

camposOferta.forEach(function (item) {
    const idError = `error${item.campo.id.charAt(0).toUpperCase()}${item.campo.id.slice(1)}`;
    let error = document.getElementById(idError);

    if (!error) {
        error = document.createElement("small");
        error.id = idError;
        error.className = "mensaje-error";
        item.campo.insertAdjacentElement("afterend", error);
    }

    item.error = error;
    item.campo.setAttribute("aria-describedby", idError);
    item.error.setAttribute("role", "alert");
});

function validarCampoOferta(item) {
    const valor = item.campo.value.trim();

    item.campo.removeAttribute("aria-invalid");
    item.error.textContent = "";

    if (item.requerido !== false && valor === "") {
        item.error.textContent = `${item.nombre} es un campo obligatorio.`;
    } else if (valor !== "" && item.minimo && valor.length < item.minimo) {
        item.error.textContent = `${item.nombre} debe tener al menos ${item.minimo} caracteres.`;
    } else if (valor !== "" && item.maximo && valor.length > item.maximo) {
        item.error.textContent = `${item.nombre} no puede superar los ${item.maximo} caracteres.`;
    } else if (
        valor !== "" &&
        item.numerico &&
        (!Number.isFinite(Number(valor)) || Number(valor) < 0)
    ) {
        item.error.textContent = `${item.nombre} debe ser un valor igual o mayor que cero.`;
    }

    if (item.error.textContent) {
        item.campo.setAttribute("aria-invalid", "true");
        return false;
    }

    return true;
}

camposOferta.forEach(function (item) {
    const evento = item.campo.tagName === "SELECT" ? "change" : "input";

    item.campo.addEventListener(evento, function () {
        mensajeOferta.classList.add("oculto");
        validarCampoOferta(item);
    });
});

function validarOferta() {
    let valido = true;

    mensajeOferta.classList.add("oculto");

    camposOferta.forEach(function (item) {
        if (!validarCampoOferta(item)) {
            valido = false;
        }
    });

    if (!valido) {
        const primerCampoInvalido = formOferta.querySelector('[aria-invalid="true"]');

        if (primerCampoInvalido) {
            primerCampoInvalido.focus();
        }
    }

    return valido;
}

formOferta.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (validarOferta()) {
        mensajeOferta.classList.remove("oculto");
    }
});
