const formContacto = document.getElementById("formContacto");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const comentario = document.getElementById("comentario");
const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorComentario = document.getElementById("errorComentario");
const mensajeContacto = document.getElementById("mensajeContacto");

[errorNombre, errorCorreo, errorComentario].forEach(function (error) {
    error.setAttribute("role", "alert");
});

function correoValido(valor) {
    return /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|duocuc\.cl|gmail\.com)$/i.test(valor);
}

function limpiarCampo(campo, error) {
    campo.removeAttribute("aria-invalid");
    error.textContent = "";
}

function mostrarError(campo, error, mensaje) {
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function validarNombreContacto() {
    limpiarCampo(nombre, errorNombre);
    const valor = nombre.value.trim();
    if (!valor) {
        mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
        return false;
    }
    if (valor.length > 100) {
        mostrarError(nombre, errorNombre, "El nombre no puede superar los 100 caracteres.");
        return false;
    }
    return true;
}

function validarCorreoContacto() {
    limpiarCampo(correo, errorCorreo);
    const valor = correo.value.trim();
    if (!valor) return true;
    if (valor.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        return false;
    }
    if (!correoValido(valor)) {
        mostrarError(correo, errorCorreo, "Ingrese un correo @duoc.cl, @profesor.duoc.cl, @duocuc.cl o @gmail.com.");
        return false;
    }
    return true;
}

function validarComentarioContacto() {
    limpiarCampo(comentario, errorComentario);
    const valor = comentario.value.trim();
    if (!valor) {
        mostrarError(comentario, errorComentario, "El comentario es obligatorio.");
        return false;
    }
    if (valor.length > 500) {
        mostrarError(comentario, errorComentario, "El comentario no puede superar los 500 caracteres.");
        return false;
    }
    return true;
}

nombre.addEventListener("input", function () {
    mensajeContacto.classList.add("oculto");
    validarNombreContacto();
});

correo.addEventListener("input", function () {
    mensajeContacto.classList.add("oculto");
    validarCorreoContacto();
});

comentario.addEventListener("input", function () {
    mensajeContacto.classList.add("oculto");
    validarComentarioContacto();
});

formContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const nombreCorrecto = validarNombreContacto();
    const correoCorrecto = validarCorreoContacto();
    const comentarioCorrecto = validarComentarioContacto();
    if (!nombreCorrecto || !correoCorrecto || !comentarioCorrecto) {
        formContacto.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }
    mensajeContacto.classList.remove("oculto");
    formContacto.reset();
});
