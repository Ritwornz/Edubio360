const formLogin = document.getElementById("formLogin");

const correo = document.getElementById("correo");
const password = document.getElementById("password");

const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

const mensajeLogin = document.getElementById("mensajeLogin");

errorCorreo.setAttribute("role", "alert");
errorPassword.setAttribute("role", "alert");

function mostrarError(campo, error, mensaje) {
    campo.setAttribute("aria-invalid", "true");
    error.textContent = mensaje;
}

function correoValido(valor) {
    const expresion = /^[A-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

    return expresion.test(valor);
}

function validarLogin() {
    let valido = true;

    errorCorreo.textContent = "";
    errorPassword.textContent = "";
    correo.removeAttribute("aria-invalid");
    password.removeAttribute("aria-invalid");

    mensajeLogin.classList.add("oculto");

    const valorCorreo = correo.value.trim();
    const valorPassword = password.value;

    if (valorCorreo === "") {
        mostrarError(correo, errorCorreo, "El correo es obligatorio.");
        valido = false;
    } else if (valorCorreo.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        valido = false;
    } else if (!correoValido(valorCorreo)) {
        mostrarError(correo, errorCorreo, "Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        valido = false;
    }

    if (valorPassword === "") {
        mostrarError(password, errorPassword, "La contraseña es obligatoria.");
        valido = false;
    } else if (
        valorPassword.length < 4 ||
        valorPassword.length > 10
    ) {
        mostrarError(password, errorPassword, "La contraseña debe tener entre 4 y 10 caracteres.");
        valido = false;
    }

    if (!valido) {
        formLogin.querySelector('[aria-invalid="true"]').focus();
    }

    return valido;
}

formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (validarLogin()) {
        mensajeLogin.classList.remove("oculto");
    }
});
