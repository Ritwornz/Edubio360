const formContacto = document.getElementById("formContacto");

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const comentario = document.getElementById("comentario");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorComentario = document.getElementById("errorComentario");

const mensajeContacto = document.getElementById("mensajeContacto");

errorNombre.setAttribute("role", "alert");
errorCorreo.setAttribute("role", "alert");
errorComentario.setAttribute("role", "alert");

function mostrarError(campo, error, mensaje) {
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function correoValido(valor) {
    const expresion = /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

    return expresion.test(valor);
}

function validarContacto() {
    let valido = true;

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorComentario.textContent = "";
    nombre.removeAttribute("aria-invalid");
    correo.removeAttribute("aria-invalid");
    comentario.removeAttribute("aria-invalid");

    mensajeContacto.classList.add("oculto");

    const valorNombre = nombre.value.trim();
    const valorCorreo = correo.value.trim();
    const valorComentario = comentario.value.trim();

    if (valorNombre === "") {
        mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
        valido = false;
    } else if (valorNombre.length > 100) {
        mostrarError(nombre, errorNombre, "El nombre no puede superar los 100 caracteres.");
        valido = false;
    }

    if (valorCorreo.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        valido = false;
    } else if (
        valorCorreo !== "" &&
        !correoValido(valorCorreo)
    ) {
        mostrarError(correo, errorCorreo, "Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        valido = false;
    }

    if (valorComentario === "") {
        mostrarError(comentario, errorComentario, "El comentario es obligatorio.");
        valido = false;
    } else if (valorComentario.length > 500) {
        mostrarError(comentario, errorComentario, "El comentario no puede superar los 500 caracteres.");
        valido = false;
    }

    if (!valido) {
        formContacto.querySelector('[aria-invalid="true"]').focus();
    }

    return valido;
}

formContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (validarContacto()) {
        mensajeContacto.classList.remove("oculto");

        formContacto.reset();
    }
});
